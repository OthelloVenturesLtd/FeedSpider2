/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.OCAPI",
	kind: "FeedSpider2.API",

	published: {
		articleHashes: null,
		auth: null,
		baseURL: "",
		folderTitles: null,
		newestItemID: 0,
		titles: null,
	},

	//UPDATED 1.2.1
	login: function(credentials, success, failure) {
		//Clean Up Base URL (if necessary)
		//Remove whitespace
		credentials.server = credentials.server.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		
		//Remove trailing slash
		credentials.server = credentials.server.replace(/\/$/, "");
		
		this.set("baseURL", credentials.server + "/index.php/apps/news/api/v1-2/");
		this.set("auth", btoa(credentials.email + ":" + credentials.password));

		var request = new enyo.Ajax({
			url: this.get("baseURL") + "version",
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(success(this.auth));
		request.go({output: "json"});
	},
  
	//UPDATED 1.2.1
	getTags: function(success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "folders",
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			//Post-Processing
			var tags = inResponse.folders;
			var sortID = 1;
			for (var i = 0; i < tags.length; i++)
			{
				tags[i].sortid = sortID;
				sortID++;			
			}
			
			success(tags);
		}, this);
		request.go({output: "json"});
	},

	//NOT SUPPORTED BY API
	getSortOrder: function(success, failure) {
		/*new Ajax.Request(this.get("baseURL") + "preference/stream/list", {
		method: "get",
		parameters: {output: "json"},
		requestHeaders: this._requestHeaders(),
		onFailure: failure,
		onSuccess: function(response) {
			var prefs = response.responseText.evalJSON()
			var sortOrder = {}

			if(prefs && prefs.streamprefs) {
			$H(prefs.streamprefs).each(function(pair) {
				pair.key = pair.key.gsub(/user\/\d+\//, "user/-/")

				$A(pair.value).each(function(pref) {
				if("subscription-ordering" == pref.id) {
					sortOrder[pair.key] = new SortOrder(pref.value)
				}
				})
			})
			}

			success(sortOrder)
		}
		})*/
		failure();
	},

	//NOT SUPPORTED BY API
	setSortOrder: function(sortOrder, stream) {
		/*this._getEditToken(function(token) {
		var parameters = {
			T: token,
			s: stream || "user/-/state/com.google/root",
			k: "subscription-ordering",
			v: sortOrder
		}

		new Ajax.Request(this.get("baseURL") + "preference/stream/set", {
			method: "post",
			parameters: parameters,
			requestHeaders: this._requestHeaders()
		})
		}.bind(this))*/
	},
  
	//UPDATED 1.2.1
	unsubscribe: function(feed) {
		if(feed.isFolder) {
			this.removeLabel(feed);
		}
		else {
			var request = new enyo.Ajax({
				url: this.get("baseURL") + "feeds/" + feed.id,
				method: "DELETE",
				xhrFields: {mozSystem: true},
				headers: this._requestHeaders(),
				cacheBust: false
			});

			request.response(function(inRequest, inResponse) {
				feedspider.handleApiStateChanged({state: "SubscriptionDeleted", id: feed.id, count: feed.unreadCount});
			});
			request.go({output: "json"});
		}
	},

	//UPDATED 1.2.1
	removeLabel: function(folder) {
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "folders/" + folder.id.substr(7),
			method: "DELETE",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.response(function(inRequest, inResponse) {
			feedspider.handleApiStateChanged({state: "FolderDeleted", id: folder.id});
		});
		request.go({output: "json"});
	},
  
	//NOT SUPPORTED BY API
	searchSubscriptions: function(query, success, failure) {
		failure();
		/*var self = this

		new Ajax.Request(this.get("baseURL") + "feed-finder", {
		method: "get",
		parameters: {q: query, output: "json"},
		requestHeaders: this._requestHeaders(),
		onFailure: failure,
		onSuccess: function(response) {
			var subscriptions = response.responseText.evalJSON().items
			success(subscriptions)
		}
		})*/
	},

	//UPDATED 1.2.1
	addSubscription: function(url, success, failure) {
		var parameters = {
			url: url,
			folderId: 0
		};
		
		//Get Feed Information
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "feeds", 
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: parameters,
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(success);
		request.go({output: "json"});
	},

	//UPDATED 1.2.1
	getAllSubscriptions: function(success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "feeds", 
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inSender, inResponse) {
			this._processFeeds(success, failure, inResponse);
		}, this);
		request.go({output: "json"});
	},
  
	//UPDATED 1.2.1
	_processFeeds: function(success, failure, response) {
		var feeds = response.feeds;
		var subscriptions = [];
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "folders", 
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false,
			sync: true
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			this._cacheFolderTitles(inResponse.folders);
		}, this);
		request.go({output: "json"});
		
		for (var i = 0; i < feeds.length; i++) {
			if (feeds[i].folderId > 0)
			{
				feeds[i].categories = [{
					id: "folder/" + feeds[i].folderId,
					label: this._titleForFolder(feeds[i].folderId)
				}];
			}
			subscriptions.push(feeds[i]);
		}
		this.cacheTitles(subscriptions);
		success(subscriptions);
	},
  
	//UPDATED 1.2.1
	cacheTitles: function(subscriptions) {
		this.set("titles", {});
		for (var i = 0; i < subscriptions.length; i++) {
			this.get("titles")[subscriptions[i].id] = subscriptions[i].title;
		}
	},

	//UPDATED 1.2.1
	_cacheFolderTitles: function(folders) {
		this.set("folderTitles", {});
		for (var i = 0; i < folders.length; i++) {
			this.get("folderTitles")[folders[i].id] = folders[i].name;
		}
	},
  
	//UPDATED 1.2.1
	_cacheArticleHashes: function(articles, append) {
		if (!append || !this.get("articleHashes"))
		{
			this.set("articleHashes", {});
		}
		for (var i = 0; i < articles.length; i++) {
			this.get("articleHashes")[articles[i].id] = articles[i].guidHash;
		}
	},

	//UPDATED 1.2.1
	titleFor: function(id) {
		return this.get("titles")[id];
	},
	
	//UPDATED 1.2.1
	_titleForFolder: function(id) {
		return this.get("folderTitles")[id];
	},
	
	//UPDATED 1.2.1
	_hashForArticle: function(id) {
		return this.get("articleHashes")[id];
	},

	//UPDATED 1.2.1
	getUnreadCounts: function(success, failure) { 
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "feeds", 
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			var feedsJson = inResponse.feeds;
			var feeds = [];
			
			for (var i = 0; i < feedsJson.length; i++)
			{
				var feedCount = {};
				feedCount.id = feedsJson[i].id;
				feedCount.count = feedsJson[i].unreadCount;
				feeds.push(feedCount);
			}

			success(feeds);
		}, this);
		request.go({output: "json"});
	},

	//UPDATED 1.2.1
	getAllArticles: function(continuation, success, failure) {
		this._getArticles(
			"all",
			FeedSpider2.Preferences.hideReadArticles() ? false : true,
			continuation,
			success,
			failure
		);
	},

	//UPDATED 1.2.1
	getAllStarred: function(continuation, success, failure) {
		this._getArticles(
			"starred",
			true,
			continuation,
			success,
			failure
		);
	},

	//NOT SUPPORTED BY API
	getAllShared: function(continuation, success, failure) {
		failure();
	},

	//NOT SUPPORTED BY API
	getAllFresh: function(continuation, success, failure) {
		failure();
	},

	//NOT SUPPORTED BY API
	getAllArchived: function(continuation, success, failure) {
		failure();
	},

	//UPDATED 1.2.1
	getAllArticlesFor: function(id, continuation, success, failure) {
		this._getArticles(
			id,
			FeedSpider2.Preferences.hideReadArticles() ? false : true,
			continuation,
			success,
			failure
		);
	},

	//UPDATED 2.0.0
	_getArticles: function(id, exclude, continuation, success, failure) {
		var parameters = {
			batchSize: 40,
			getRead: exclude
		};
		
		if (id.toString().substr(0,7) === "folder/")
		{
			parameters.type = 1;
			parameters.id = id.substr(7);
		}
		else if (id === "starred")
		{
			parameters.type = 2;
			parameters.id = 0;
		}
		else if (id === "all")
		{
			parameters.type = 3;
			parameters.id = 0;
		}
		else
		{
			parameters.type = 0;
			parameters.id = id;
		}
		
		if(continuation) {
			parameters.offset = continuation;
		}    
		
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "items",
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			this._processArticles(inResponse, success, continuation, parameters.batchSize, id);
		}, this);
		request.go(parameters); 
	},

	_processArticles: function(articles, success, continuation, batchSize, id) {
		//Do post-processing to conform articles to FeedSpider spec
		var lastArticleId = 0;
		this.set("newestItemID", 0);
		
		if(!continuation && articles.items[0] != undefined)
		{
			this.set("newestItemID", articles.items[0].id);
		}
		
		for (var i = 0; i < articles.items.length; i++)
		{
			//Set article origin
			articles.items[i].origin = {streamId : articles.items[i].feedId};
			
			//Set article content				
			articles.items[i].content = {content: articles.items[i].body};
			
			//Set article categories
			articles.items[i].categories = [];
			if (!articles.items[i].unread)
			{
				articles.items[i].categories.push("/state/com.google/read");
			}
			
			if (articles.items[i].starred)
			{
				articles.items[i].categories.push("/state/com.google/starred");
			}
			
			//Set article link
			articles.items[i].alternate = [{
				type: "html",
				href: articles.items[i].url
			}];
			
			//Set article timestamp
			articles.items[i].crawlTimeMsec = articles.items[i].pubDate	+ "000";
			
			//Check article id
			if (articles.items[i].id < lastArticleId || lastArticleId == 0)
			{
				lastArticleId = articles.items[i].id;
			}
		}
		
		//Store article hashes
		this._cacheArticleHashes(articles.items, continuation ? true : false);
		
		//Load more articles (if there are more to load)
		success(articles.items, id, articles.items.length === batchSize ? lastArticleId : false);
	},

	//UPDATED 1.2.1
	markAllRead: function(id, success, failure) { 
		var parameters = {
			newestItemId: this.get("newestItemID")
		};
		
		if (id === "user/-/state/com.google/reading-list")
		{
			this._ajaxPut(parameters, this.get("baseURL") + "items/read", success, failure);
		}
		else if (id.toString().substr(0,7) === "folder/")
		{
			this._ajaxPut(parameters, this.get("baseURL") + "folders/" + id.substr(7) + "/read", success, failure);
		}
		else
		{
			this._ajaxPut(parameters, this.get("baseURL") + "feeds/" + id + "/read", success, failure);
		}
	},

	//NOT SUPPORTED BY API
	search: function(query, id, success, failure) {
		/*var parameters = {
		q: query,
		num: 50,
		output: "json"
		}

		if(id) {
		parameters.s = id
		}

		new Ajax.Request(this.get("baseURL") + "search/items/ids", {
		method: "get",
		parameters: parameters,
		requestHeaders: this._requestHeaders(),
		onSuccess: this.searchItemsFound.bind(this, success, failure),
		onFailure: failure
		})*/
		failure();
	},

	//NOT SUPPORTED BY API
	searchItemsFound: function(success, failure, response) {
		/*var self = this
		var ids = response.responseText.evalJSON().results

		if(ids.length) {
		self._getEditToken(
			function(token) {
			var parameters = {
				T: token,
				i: ids.map(function(n) {return n.id})
			}

			new Ajax.Request(this.get("baseURL") + "stream/items/contents", {
				method: "post",
				parameters: parameters,
				requestHeaders: self._requestHeaders(),
				onFailure: failure,
				onSuccess: function(response) {
				var articles = response.responseText.evalJSON()
				success(articles.items, articles.id, articles.continuation)
				}
			})
			}
		)
		}
		else {
		success([], "", false)
		}*/
		failure();
	},

	//NOT SUPPORTED BY API
	mapSearchResults: function(response) {
		//console.log(response.responseText)
	},

	//UPDATED 1.2.1
	setArticleRead: function(articleId, subscriptionId, success, failure) {
		this._ajaxPut({}, this.get("baseURL") + "items/" + articleId + "/read", success, failure);
	},

	//UPDATED 1.2.1
	setArticleNotRead: function(articleId, subscriptionId, success, failure, sticky) {
		this._ajaxPut({}, this.get("baseURL") + "items/" + articleId + "/unread", success, failure);
	},

	//NOT SUPPORTED BY API
	setArticleShared: function(articleId, subscriptionId, success, failure) {
		/*this._editTag(
		articleId,
		subscriptionId,
		1,
		null,
		success,
		failure
		)*/
		failure();
	},

	//NOT SUPPORTED BY API
	setArticleNotShared: function(articleId, subscriptionId, success, failure) {
		/*this._editTag(
		articleId,
		subscriptionId,
		null,
		1,
		success,
		failure
		)*/
		failure();
	},

	//UPDATED 1.2.1
	setArticleStarred: function(articleId, subscriptionId, success, failure) {
		var articleGuid = this._hashForArticle(articleId)
		this._ajaxPut({}, this.get("baseURL") + "items/" + subscriptionId + "/" + articleGuid + "/star", success, failure);
	},

	//UPDATED 1.2.1
	setArticleNotStarred: function(articleId, subscriptionId, success, failure) {
		var articleGuid = this._hashForArticle(articleId)    
		this._ajaxPut({}, this.get("baseURL") + "items/" + subscriptionId + "/" + articleGuid + "/unstar", success, failure);
	},
  
	//UPDATED 1.2.1
	_requestHeaders: function() {
		return {Authorization:"Basic " + this.auth};
	},

	//UPDATED 1.2.1
	_ajaxPut: function(params, url, success, failure) {
		var request = new enyo.Ajax({
			url: url,
			method: "PUT",
			xhrFields: {mozSystem: true},
			postBody: params,
			headers: this._requestHeaders(),
			contentType: "application/json",
			cacheBust: false
		});

		request.error(failure);
		request.response(success);
		request.go({output: "json"});
	},

	//UPDATED 1.2.1    
	supportsAllArticles: function() {
		return true;
	},

	//UPDATED 1.2.1  
	supportsArchived: function() {
		return false;
	},
	
	//UPDATED 1.2.1  
	supportsFresh: function() {
		return false;
	},

	//UPDATED 1.2.1  
	supportsStarred: function() {
		return true;
	},

	//UPDATED 1.2.1  
	supportsShared: function() {
		return false;
	},

	//UPDATED 1.2.1  
	supportsSearch: function() {
		return false;
	},
	
	//UPDATED 1.2.1
	supportsManualSort: function() {
		return false;
	}
});