/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.TTRSSAPI",
	kind: "FeedSpider2.API",

	published: {
		auth: null,
		baseURL: "",
		titles: null
	},

	//UPDATED 1.1.0
	login: function(credentials, success, failure) {
		//Clean Up Base URL (if necessary)
		//Remove whitespace
		credentials.server = credentials.server.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
		
		//Remove trailing slash
		credentials.server = credentials.server.replace(/\/$/, "");
		
		this.set("baseURL", credentials.server + "/api/");
		
		var authSuccess = function(inRequest, inResponse) {
			var authResult = inResponse;

			if(authResult.content.error)
			{
				Log.debug("Login Failure. Error: " + authResult.content.error);
				failure();
			}
			else if (!authResult.content.api_level || authResult.content.api_level < 7)
			{
				Log.debug("Login Failure. API Level too low");
				failure();
			}
			else if(authResult.content.session_id)
			{
				this.set("auth", authResult.content.session_id);
				success(this.get("auth"));
			}
			else
			{
				failure();
			}
		}.bind(this);
		
		var parameters = {
			op: "login",
			user: credentials.email,
			password: credentials.password
		};

		var request = new enyo.Ajax({
			url: this.get("baseURL"),
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: JSON.stringify(parameters),
			cacheBust: false
		});

		request.error(failure);
		request.response(authSuccess, this);
		request.go();
	},
  
	//UPDATED 1.1.2
	getTags: function(success, failure) {
		var parameters = {
			sid: this.get("auth"),
			op: "getCategories",
			include_empty: false
		};

		var request = new enyo.Ajax({
			url: this.get("baseURL"),
			method: "POST",
			postBody: JSON.stringify(parameters),
			xhrFields: {mozSystem: true},
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			//Post-Processing
			var tags = inResponse;

			for(var i = 0; i < tags.length; i++)
			{
				tags.content[i].sortid = tags.content[i].order_id;
			}
			
			success(tags.content);
		}, this);
		request.go({output: "json"});
	},

	//NOT SUPPORTED BY API
	getSortOrder: function(success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL")+ "preference/stream/list",
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			var prefs = inResponse;
			var sortOrder = {};

			if(prefs && prefs.streamprefs) {
				var streamprefsKeys = Object.keys(prefs.streamprefs);
				for (var i = 0; i < streamprefsKeys.length; i++)
				{
					var key = streamprefsKeys[i].replace(/user\/\d+\//g, "user/-/");
					var valueArray = prefs.streamprefs[streamprefsKeys[i]];

					for (var j = 0; j < valueArray.length; j++)
					{
						if("subscription-ordering" == valueArray[j].id) {
							sortOrder[key] = new FeedSpider2.SortOrder(valueArray[j].value);
						}
					}
				}
			}

			success(sortOrder);
		}, this);

		request.go({output: "json"});
	},

	//NOT SUPPORTED BY API
	setSortOrder: function(sortOrder, stream) {
		this._getEditToken(function(token) {
			var parameters = {
				T: token,
				s: stream || "user/-/state/com.google/root",
				k: "subscription-ordering",
				v: sortOrder
			};

			var request = new enyo.Ajax({
				url: this.get("baseURL")+ "preference/stream/set", 
				method: "POST",
				xhrFields: {mozSystem: true},
				postBody: JSON.stringify(parameters),
				headers: this._requestHeaders(),
				cacheBust: false
			});

			request.go({output: "json"});
		}.bind(this));
	},
  
	//UPDATED 1.1.0
	unsubscribe: function(feed) {
		if(feed.isFolder) {
			Feeder.notify($L("Folder Delete Not Supported"));
			feedspider.handleApiStateChanged({state: "FolderDeleted", id: feed.id});
			//this.removeLabel(feed)
		}
		else {
			var parameters = {
				sid: this.get("auth"),
				op: "unsubscribeFeed",
				feed_id: feed.id
			};

			var request = new enyo.Ajax({
				url: this.get("baseURL"),
				method: "POST",
				postBody: JSON.stringify(parameters),
				xhrFields: {mozSystem: true},
				cacheBust: false
			});
	
			request.response(function(inRequest, inResponse) {
				feedspider.handleApiStateChanged({state: "SubscriptionDeleted", id: feed.id, count: feed.unreadCount});
			}, this);
			request.go({output: "json"});
		}
	},

	//NOT SUPPORTED BY API
	removeLabel: function(folder) {
		this._getEditToken(function(token) {
			var parameters = {
				T: token,
				s: folder.id,
				t: folder.title
			};

			var request = new enyo.Ajax({
				url: this.get("baseURL")+ "disable-tag",
				method: "POST",
				xhrFields: {mozSystem: true},
				postBody: JSON.stringify(parameters),
				headers: this._requestHeaders(),
				cacheBust: false
			});

			request.response(function(inRequest, inResponse) {
				feedspider.handleApiStateChanged({state: "FolderDeleted", id: folder.id});
			});
			request.go({output: "json"});
		}.bind(this));
	},
  
	//NOT SUPPORTED BY API
	searchSubscriptions: function(query, success, failure) {
		failure();
		/*var self = this

		new Ajax.Request(TTRSSApi.BASE_URL + "feed-finder", {
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

	//UPDATED 1.1.0
	addSubscription: function(url, success, failure) {
		var parameters = {
			sid: this.get("auth"),
			op: "subscribeToFeed",
			feed_url: url,
			category_id: 0
		};
		
		var request = new enyo.Ajax({
			url: this.get("baseURL"),
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: JSON.stringify(parameters),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			if(inResponse.content.status.code == 1) {
				success();
			}
			else {
				failure();
			}
		}, this);
		request.go();
	},

	//UPDATED 1.1.0
	getAllSubscriptions: function(success, failure) {
		var parameters = {
			sid: this.get("auth"),
			op: "getCategories",
			include_empty: false
		};
		
		var request = new enyo.Ajax({
			url: this.get("baseURL"),
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: JSON.stringify(parameters),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			this._processCategories(success, failure, inResponse);
		}, this);
		request.go();
	},
  
	//UPDATED 1.1.0
	_processCategories: function(success, failure, response) {
		var categories = response.content;
		var subscriptions = [];
		var parameters = {
			sid: this.get("auth"),
			op: "getFeeds"
		};
		
		var request = new enyo.Ajax({
			url: this.get("baseURL"),
			method: "POST",
			xhrFields: {mozSystem: true},
			sync: true,
			cacheBust: false
		});

		request.error(failure);

		for (var i = 0; i < categories.length; i++)
		{			
			if (categories[i].id > 0)
			{
				parameters.cat_id = categories[i].id;
				request.postBody = JSON.stringify(parameters);

				request.response(function(inRequest, inResponse) {
					var feeds = inResponse.content;
					for (var j = 0; j < feeds.length; j++)
					{
						feeds[j].categories = [{
							id: categories[i].id,
							label: categories[i].title
						}];
						subscriptions.push(feeds[j]);
					}
				}, this);
				request.go();
			}
		}
		
		parameters.cat_id = 0;
		request.postBody = JSON.stringify(parameters);
		request.sync = false;

		request.response(function(inRequest, inResponse) {
			var feeds = inResponse.content;
			for (var i = 0; i < feeds.length; i++)
			{
				subscriptions.push(feeds[i]);
			}
			this.cacheTitles(subscriptions);
			success(subscriptions); 
		}, this);
		request.go();
	},
  
	//UPDATED 1.1.0
	cacheTitles: function(subscriptions) {
		this.set("titles", {});
		for (var i=0 ; i<subscriptions.length; i++)
		{
			this.get("titles")[subscriptions[i].id] = subscriptions[i].title;
		}
	},

	//UPDATED 1.1.0
	titleFor: function(id) {
		return this.get("titles")[id];
	},

	//UPDATED 1.1.2
	getUnreadCounts: function(success, failure) {
		var parameters = {
			sid: this.get("auth"),
			op: "getCounters",
			output_mode: "f"
		};
		
		var request = new enyo.Ajax({
			url: this.get("baseURL"),
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: JSON.stringify(parameters),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			var rawFeeds = inResponse.content;
			var feeds = [];

			for (var i = 0; i < rawFeeds.length; i++)
			{
				if (rawFeeds[i].id > 0 && rawFeeds[i].kind !== "cat")
				{
					rawFeeds[i].count = rawFeeds[i].counter;
					feeds.push(rawFeeds[i]);
				}
			}
						
			success(feeds);
		}, this);
		request.go();
	},

	//UPDATED 1.1.0
	getAllArticles: function(continuation, success, failure) {
		this._getArticles(
			-4,
			FeedSpider2.Preferences.hideReadArticles() ? "unread" : "all_articles",
			continuation,
			success,
			failure
		);
	},

	//UPDATED 1.1.0
	getAllStarred: function(continuation, success, failure) {
		this._getArticles(
			-1,
			"all_articles",
			continuation,
			success,
			failure
		);
	},

	//UPDATED 1.1.0
	getAllShared: function(continuation, success, failure) {
		this._getArticles(
			-2,
			"all_articles",
			continuation,
			success,
			failure
		);
	},

	//UPDATED 1.2.0
	getAllFresh: function(continuation, success, failure) {
		this._getArticles(
			-3,
			"all_articles",
			continuation,
			success,
			failure
		);
	},

	//UPDATED 1.2.0
	getAllArchived: function(continuation, success, failure) {
		this._getArticles(
			-0,
			"all_articles",
			continuation,
			success,
			failure
		);
	},

	//UPDATED 1.1.0
	getAllArticlesFor: function(id, continuation, success, failure) {
		this._getArticles(
			id,
			FeedSpider2.Preferences.hideReadArticles() ? "unread" : "all_articles",
			continuation,
			success,
			failure
		);
	},

	//UPDATED 2.0.0
	_getArticles: function(id, exclude, continuation, success, failure) {
		var parameters = {
			sid: this.get("auth"),
			op: "getHeadlines",
			feed_id: id,
			limit: 40,
			show_content: true,
		};
		
		if(id != -4 &&
			id != -3 &&
			id != -2 &&
			id != 0 &&
			FeedSpider2.Preferences.isOldestFirst()) 
		{
			parameters.order_by = "date_reverse";
		} 
		else 
		{
			parameters.order_by = "feed_dates";
		}

		if(continuation) {
			parameters.skip = continuation;
		}

		if(exclude) {
			parameters.view_mode = exclude;
		}
		
		if (id.constructor == String)
		{
			parameters.is_cat = true;
		}    
		
		var request = new enyo.Ajax({
			url: this.get("baseURL"),
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: JSON.stringify(parameters),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			var articles = inResponse.content;

			//Do post-processing to conform articles to FeedSpider spec
			for (var i = 0; i < articles.length; i++)
			{
				//Set article origin
				articles[i].origin = {streamId : articles[i].feed_id};
				
				//Set article content				
				articles[i].content = {content: articles[i].content};
				
				//Set article categories
				articles[i].categories = []
				if (!articles[i].unread)
				{
					articles[i].categories.push("/state/com.google/read");
				}
				
				if (articles[i].marked)
				{
					articles[i].categories.push("/state/com.google/starred");
				}
				
				if (articles[i].published)
				{
					articles[i].categories.push("/state/com.google/broadcast");
				}
				
				//Set article link
				articles[i].alternate = [{
					type: "html",
					href: articles[i].link
				}];
				
				//Set article timestamp
				articles[i].crawlTimeMsec = articles[i].updated + "000";
			}
			
			//Load more articles (if there are more to load)
			continuation = continuation ? continuation + parameters.limit : parameters.limit;

			success(articles, id, articles.length == parameters.limit ? continuation : false);
		}, this);
		request.go(); 
	},

	//UPDATED 1.1.0
	markAllRead: function(id, success, failure) {
		var parameters = {
			sid: this.get("auth"),
			op: "catchupFeed",
			feed_id: id
		};
		
		//NOTE: This particular behaviour works due to how category ids are handled, as opposed to feed ids within the app
		//it's a bit of an ugly hack, but there isn't an easy way of determining feed vs category without making significant
		//changes elsewhere.
		if (id === "user/-/state/com.google/reading-list")
		{
			//NOTE: This behaviour does not work correctly with 1.12 - it must be a bug on the other end.
			parameters.feed_id = -4;
			parameters.is_cat = false;
		}
		else if (id.constructor == String)
		{
			parameters.is_cat = true;
		}
		else if (id.constructor == Number)
		{
			parameters.is_cat = false;
		}
		
		var request = new enyo.Ajax({
			url: this.get("baseURL"),
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: JSON.stringify(parameters),
			cacheBust: false
		});

		request.error(failure);
		request.response(success);
		request.go();
	},

	//NOT SUPPORTED BY API
	search: function(query, id, success, failure) {
		var parameters = {
			q: query,
			num: 50,
			output: "json"
		};

		if(id) {
			parameters.s = id;
		}

		var request = new enyo.Ajax({
			url: this.get("baseURL")+ "search/items/ids",
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			this.searchItemsFound(success, failure, inResponse);
		}, this);
		request.go(parameters);
	},

	//NOT SUPPORTED BY API
	searchItemsFound: function(success, failure, response) {
		var ids = response.results;

		if(ids.length) {
			this._getEditToken(
				function(token) {
					var parameters = {
						T: token,
						i: ids.map(function(n) {return n.id;})
					};

					var request = new enyo.Ajax({
						url: this.get("baseURL")+ "stream/items/contents",
						method: "POST",
						xhrFields: {mozSystem: true},
						postBody: JSON.stringify(parameters),
						headers: this._requestHeaders(),
						cacheBust: false
					});

					request.error(failure);
					request.response(function(inRequest, inResponse) {
						success(inResponse.items, inResponse.id, inResponse.continuation);
					}, this);
					request.go({output: "json"});
				}
			);
		}
		else {
			success([], "", false);
		}
	},

	//NOT SUPPORTED BY API
	mapSearchResults: function(response) {
		console.log(response);
	},

	//UPDATED 1.1.0
	setArticleRead: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			null,
			2,
			success,
			failure
		);
	},

	//UPDATED 1.1.0
	setArticleNotRead: function(articleId, subscriptionId, success, failure, sticky) {
		this._editTag(
			articleId,
			subscriptionId,
			2,
			null,
			success,
			failure
		);
	},

	//UPDATED 1.1.0
	setArticleShared: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			1,
			null,
			success,
			failure
		);
	},

	//UPDATED 1.1.0
	setArticleNotShared: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			null,
			1,
			success,
			failure
		);
	},

	//UPDATED 1.1.0
	setArticleStarred: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			0,
			null,
			success,
			failure
		);
	},

	//UPDATED 1.1.0
	setArticleNotStarred: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			null,
			0,
			success,
			failure
		);
	},

	//UPDATED 1.1.0
	_editTag: function(articleId, subscriptionId, addTag, removeTag, success, failure) {
		Log.debug("editing tag for article id = " + articleId + " and subscription id = " + subscriptionId);

		var parameters = {
			sid: this.get("auth"),
			op: "updateArticle",
			article_ids: articleId
		};

		if(addTag !== null){
			parameters.mode = 1;
			parameters.field = addTag;
		}
		
		if(removeTag !== null){
			parameters.mode = 0;
			parameters.field = removeTag;
		}
		
		var request = new enyo.Ajax({
			url: this.get("baseURL"),
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: JSON.stringify(parameters),
			cacheBust: false
		});

		request.error(failure);
		request.response(success);
		request.go();
	},

	//UPDATED 1.1.0    
	supportsAllArticles: function() {
		return true
	},

	//UPDATED 1.2.0  
	supportsArchived: function() {
		return true
	},
	
	//UPDATED 1.2.0  
	supportsFresh: function() {
		return true
	},

	//UPDATED 1.1.0  
	supportsStarred: function() {
		return true
	},

	//UPDATED 1.1.0  
	supportsShared: function() {
		return true
	},

	//UPDATED 1.1.0  
	supportsSearch: function() {
		return false
	},
	
	//UPDATED 1.1.0
	supportsManualSort: function() {
		return false
	}
});