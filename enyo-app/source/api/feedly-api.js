/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.FeedlyAPI",
	kind: "FeedSpider2.API",

	published: {
		baseURL: "https://cloud.feedly.com/v3/",
		clientID: "feedspider",
		clientSecret: "FE01DA2G93CK87ZP8NW6T5WYG862",
		credentials: null,
		titles: null
	},

	//UPDATED 1.2.0
	login: function(credentials, success, failure, controller) {
		if (credentials.id != null && credentials.accessToken != null && credentials.refreshToken != null && credentials.tokenExpiry != null)
		{
			this.set("credentials", credentials);
			if (this._checkTokenExpiry())
			{
				success(this.get("credentials").accessToken);
			}
			else
			{
				this.get("credentials").password = null;
				this.get("credentials").server = null;
				this.get("credentials").id = null;
				this.get("credentials").refreshToken = null;
				this.get("credentials").accessToken = null;
				this.get("credentials").tokenType = null;
				this.get("credentials").plan = null;
				this.get("credentials").clear();
				failure();
				return;
			}
		}
		else
		{    
			var oauthConfig={
				callbackScene:'login', //Name of the assistant to be called on the OAuth Success
				authorizeUrl: this.get("baseURL") + 'auth/auth',
				accessTokenUrl: this.get("baseURL") + 'auth/token',
				accessTokenMethod:'POST', // Optional - 'GET' by default if not specified
				client_id: this.get("clientID"),
				client_secret: this.get("clientSecret"),
				//redirect_uri: 'http://localhost', //'urn:ietf:wg:oauth:2.0:oob', // Optional - 'oob' by default if not specified
				response_type:'code', // now only support code
				scope: ['https://cloud.feedly.com/subscriptions'],
				service: credentials.service       	
			};
			
			if(enyo.platform.webos || window.PalmSystem)
			{
				oauthConfig.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob';
				controller.$.oAuthBrowserWebOS.beginOAuth(oauthConfig);
			}
			else
			{
				oauthConfig.redirect_uri = 'http://localhost';
				controller.$.oAuthBrowserFFOS.beginOAuth(oauthConfig);
			}
		}
	},

	//UPDATED 0.9.5
	getTags: function(success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL")+ "tags",
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			success(inResponse);
		}, this);
		request.go({output: "json"});
	},

	//NOT CURRENTLY SUPPORTED BY API
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

	//NOT CURRENTLY SUPPORTED BY API
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
				postBody: parameters,
				headers: this._requestHeaders(),
				cacheBust: false
			});

			request.go({output: "json"});
		}.bind(this));
	},

	//UPDATED 0.9.5
	unsubscribe: function(feed) {
		if(feed.isFolder) {
			this.removeLabel(feed);
		}
		else {
			var request = new enyo.Ajax({
				url: this.get("baseURL") + "subscriptions/" + encodeURIComponent(feed.id),
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

	//UPDATED 0.9.5
	removeLabel: function(folder) {
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "categories/" + encodeURIComponent(folder.id),
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

	//UPDATED 1.1.2
	searchSubscriptions: function(query, success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL")+ "search/feeds",
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			//Post-processing
			var subscriptions = inResponse.results;

			for (var i = 0; i < subscriptions.length; i++)
			{
				subscriptions[i].content = {content: $L("Website") + ": " + subscriptions[i].website + ", " + $L("Subscribers") + ": " + subscriptions[i].subscribers};
				subscriptions[i].feed = [{href: subscriptions[i].feedId.substr(5)}];
			}
			
			success(subscriptions);
		}, this);
		request.go({q: query, output: "json"});
	},

	//UPDATED 0.9.5
	addSubscription: function(url, success, failure) {
		//Get Feed Information
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "feeds/" + encodeURIComponent("feed/" + url), 
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			this._processSubscription.bind(success, failure, inResponse);
		}, this);
		request.go({output: "json"});
	},
  
	//UPDATED 0.9.5
	_processSubscription: function(success, failure, response) {
		// Then add feed
		var feed = response;
		if (feed !== undefined && feed !== null && feed.id && feed.title)
		{	
			var parameters = {
				id: feed.id,
				title: feed.title
			};

			var request = new enyo.Ajax({
				url: this.get("baseURL") + "subscriptions",
				method: "POST",
				xhrFields: {mozSystem: true},
				postBody: parameters,
				headers: this._requestHeaders(),
				contentType: "application/json",
				cacheBust: false
			});

			request.error(failure);
			request.response(success);
			request.go({output: "json"});
		}
		else
		{
			failure();
		}
	},
  
	//UPDATED 0.9.5
	getAllSubscriptions: function(success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "subscriptions", 
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			this.cacheTitles(inResponse);
			success(inResponse);
		}, this);
		request.go({output: "json"});
	},

	//UPDATED 0.9.5
	cacheTitles: function(subscriptions) {
		this.set("titles", {});
		for (var i=0 ; i<subscriptions.length; i++)
		{
			this.get("titles")[subscriptions[i].id] = subscriptions[i].title;
		}
	},

	//UPDATED 0.9.5
	titleFor: function(id) {
		return this.get("titles")[id];
	},

	//UPDATED 0.9.5
	getUnreadCounts: function(success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "markers/counts", 
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			if(inResponse.denied) {
				failure();
			}
			else {
				success(inResponse.unreadcounts);
			}
		}, this);
		request.go({output: "json"});
	},
  
	//UPDATED 0.9.5
	getAllArticles: function(continuation, success, failure) {
		this._getArticles(
			"user/" + this.get("credentials").id + "/category/global.all",
			FeedSpider2.Preferences.hideReadArticles() ? true : false,
			continuation,
			success,
			failure
		);
	},

	//UPDATED 0.9.5
	getAllStarred: function(continuation, success, failure) {
		this._getArticles(
			"user/" + this.get("credentials").id + "/tag/global.saved",
			false,
			continuation,
			success,
			failure
		);
	},

	//NOT CURRENTLY SUPPORTED BY API
	getAllShared: function(continuation, success, failure) {
		this._getArticles(
			"user/-/state/com.google/broadcast",
			false,
			continuation,
			success,
			failure
		);
	},

	//UPDATED 1.2.0
	getAllFresh: function(continuation, success, failure) {
		failure();
		/*this._getArticles(
			-3,
			"all_articles",
			continuation,
			success,
			failure
		)*/
	},

	//UPDATED 1.2.0
	getAllArchived: function(continuation, success, failure) {
		failure();
		/*this._getArticles(
			-0,
			"all_articles",
			continuation,
			success,
			failure
		)*/
	},

	//UPDATED 1.1.2
	getAllArticlesFor: function(id, continuation, success, failure) {
		this._getArticles(
			id,
			FeedSpider2.Preferences.hideReadArticles() ? true : false,
			continuation,
			success,
			failure
		);
	},

	//UPDATED 2.0.0
	_getArticles: function(id, exclude, continuation, success, failure) {
		var parameters = {output: "json", count: 40};
		var ajaxURL = this.get("baseURL") + "streams/" + encodeURIComponent(id) + "/contents";

		if(!this._endsWith(id, "/tag/global.saved") && FeedSpider2.Preferences.isOldestFirst()) {
			parameters.ranked = "oldest";
		}

		if(continuation) {
			parameters.continuation = continuation;
		}

		if(exclude) {
			parameters.unreadOnly = exclude;
		}
		
		if (FeedSpider2.Preferences.isFeedlySortEngagement() && !this._endsWith(id, "/tag/global.saved")){
			parameters.count = 20;
			ajaxURL = this.get("baseURL") + "mixes/" + encodeURIComponent(id) + "/contents";
		}

		var request = new enyo.Ajax({
			url: ajaxURL,
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			this._processArticles(inResponse, success);
		}, this);
		request.go(parameters);
	},
  
	//UPDATED 1.2.0
	_processArticles: function(articles, success) {
		//Do post-processing to conform articles to FeedSpider spec
		var items = articles.items;
		for (var i = 0; i < items.length; i++) {
			//Set article categories
			items[i].categories = [];
			if(items[i].tags) {
				for (var j = 0; j < items[i].tags.length; j++) {
					if (items[i].tags[j].id !== undefined)
					{
						if(this._endsWith(items[i].tags[j].id, "/tag/global.read")) {
							items[i].categories.push("/state/com.google/read")
						}
				
						if(this._endsWith(items[i].tags[j].id, "/tag/global.saved")) {
							items[i].categories.push("/state/com.google/starred")
						}
					}
				}
			}
			if (items[i].unread !== undefined)
			{
				if(items[i].unread == false)
				{
					items[i].categories.push("/state/com.google/read");
				}
			}

			//Set article timestamp
			items[i].crawlTimeMsec = items[i].crawled;
		}

		success(articles.items, articles.id, articles.continuation);
	},

	//UPDATED 0.9.5
	markAllRead: function(id, success, failure) {
		if (id === "user/-/state/com.google/reading-list")
		{
			id = "user/" + this.get("credentials").id + "/category/global.all";
		}
		
		var parameters = {
			action: "markAsRead",
			asOf: new Date().getTime()
		};
		
		if (id.indexOf("category") !== -1)
		{
			parameters.type = "categories";
			parameters.categoryIds = [id];
		}
		else
		{
			parameters.type = "feeds";
			parameters.feedIds = [id];
		}
		
		this._editMarker(parameters, success, failure);
	},

	//TODO NEXT VERSION
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

	//TODO NEXT VERSION
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
						postBody: parameters,
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

	//TODO NEXT VERSION
	mapSearchResults: function(response) {
		console.log(response)
	},

	//UPDATED 0.9.5
	setArticleRead: function(articleId, subscriptionId, success, failure) {
		var parameters = {
			action: "markAsRead",
			type: "entries",
			entryIds: [articleId]
		};
		
		this._editMarker(parameters, success, failure);
	},
  
	//UPDATED 0.9.5
	setArticleNotRead: function(articleId, subscriptionId, success, failure, sticky) {
		var parameters = {
			action: "keepUnread",
			type: "entries",
			entryIds: [articleId]
		};
		
		this._editMarker(parameters, success, failure);
	},

	//NOT CURRENTLY SUPPORTED BY API
	setArticleShared: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			"user/-/state/com.google/broadcast",
			null,
			success,
			failure
		);
	},
  
	//NOT CURRENTLY SUPPORTED BY API
	setArticleNotShared: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			null,
			"user/-/state/com.google/broadcast",
			success,
			failure
		);
	},

	//UPDATED 0.9.5
	setArticleStarred: function(articleId, subscriptionId, success, failure) {
		var parameters = {
			entryIds: [articleId]
		};
		this._addTag(parameters, "user/" + this.get("credentials").id +"/tag/global.saved", success, failure);
	},

	//UPDATED 0.9.5
	setArticleNotStarred: function(articleId, subscriptionId, success, failure) {
		this._removeTag(articleId, "user/" + this.get("credentials").id +"/tag/global.saved", success, failure);
	},
  
	//UPDATED 0.9.5
	_editMarker: function(parameters, success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "markers",
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: parameters,
			headers: this._requestHeaders(),
			contentType: "application/json",
			cacheBust: false
		});

		request.error(failure);
		request.response(success);
		request.go({output: "json"});
	},
    
	//UPDATED 0.9.5
	_addTag: function(parameters, tag, success, failure) {
		Log.debug("adding tag "+ tag);
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "tags/" + encodeURIComponent(tag),
			method: "PUT",
			xhrFields: {mozSystem: true},
			postBody: parameters,
			headers: this._requestHeaders(),
			contentType: "application/json",
			cacheBust: false
		});

		request.error(failure);
		request.response(success);
		request.go({output: "json"});
	},
  
	//UPDATED 0.9.5
	_removeTag: function(articleId, tag, success, failure) {
		Log.debug("removing tag "+ tag);
		var request = new enyo.Ajax({
			url: this.get("baseURL") + "tags/" + encodeURIComponent(tag) + "/" + encodeURIComponent(articleId),
			method: "DELETE",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(success);
		request.go({output: "json"});
	},

	//UPDATED 0.9.5
	_requestHeaders: function() {
		if (this._checkTokenExpiry())
		{
			return {Authorization:"OAuth " + this.get("credentials").accessToken};
		}
		else
		{
			return {Authorization:"OAuth Error"};
		}
	},
  
	//UPDATED 1.0.3
	_checkTokenExpiry: function() {
		if (new Date(this.get("credentials").tokenExpiry).getTime() > new Date().getTime())
		{
			return true;
		} 
		else
		{
			var parameters = {
				refresh_token: this.get("credentials").refreshToken,
				client_id: this.get("clientID"),
				client_secret: this.get("clientSecret"),
				grant_type: "refresh_token"
			};
			
			try {
				var req = new XMLHttpRequest({mozSystem: true});
				req.open("POST", this.get("baseURL") + "auth/token", false);
				req.setRequestHeader('Content-Type', 'application/json');
				req.send(JSON.stringify(parameters));
				if(req.readyState === 4 && req.status === 200){
					var response = req.responseText.evalJSON();
					if (response) {
						if (response.id) {
							this.get("credentials").id = response.id;
						}
						if (response.access_token) {
							this.get("credentials").accessToken = response.access_token;
						}
						if (response.expires_in) {
							var expiryDate = new Date();
							expiryDate.setSeconds(expiryDate.getSeconds() + response.expires_in);
							this.get("credentials").tokenExpiry = expiryDate;
						}
						if (response.token_type) {
							this.get("credentials").tokenType = response.token_type;
						}
						if (response.plan) {
							this.get("credentials").plan = response.plan;
						}
						this.get("credentials").save();
						return true;
					}
					else
					{
						return false;
					}
				} 
				else
				{
					throw req.responseText;
				}
			}
			catch (e) {
				Log.debug('_checkTokenExpiry failed! Error:' + e);
				return false;
			}
		}
	},
  
	//UPDATED 0.9.5
	supportsAllArticles: function() {
		return true;
	},
	
	//UPDATED 1.2.0  
	supportsArchived: function() {
		return false;
	},
	
	//UPDATED 1.2.0  
	supportsFresh: function() {
		return false;
	},
	
	//UPDATED 0.9.5
	supportsStarred: function() {
		return true;
	},
	
	//UPDATED 0.9.5
	supportsShared: function() {
		return false;
	},
	
	//UPDATED 0.9.5
	supportsSearch: function() {
		return false;
	},
	
	//UPDATED 0.9.5
	supportsManualSort: function() {
		return false;
	},

	_endsWith: function(sourceString, searchString) {
		return sourceString.indexOf(searchString) === (sourceString.length - searchString.length);
	}
});