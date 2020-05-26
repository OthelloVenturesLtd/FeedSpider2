/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.InoAPI",
	kind: "FeedSpider2.API",

	published: {
		auth: null,
		baseURL: "https://www.inoreader.com/reader/api/0/",
		appID: "1000001438",
		appKey: "Hea9JkjSNEepktY0s9ss9TUaETgCoBzg",
		editToken: null,
		editTokenTime: null,
		titles: null	
	},

	login: function(credentials, success, failure) {
		var authSuccess = function(inRequest, inResponse) {
			var authMatch = inResponse.match(/Auth\=(.*)/);
			this.set("auth", authMatch ? authMatch[1] : '');
			success(this.get("auth"));
		}.bind(this);

		var request = new enyo.Ajax({
			url: "https://www.inoreader.com/accounts/ClientLogin",
			method: "POST",
			xhrFields: {mozSystem: true},
			postBody: {Email: credentials.email, Passwd: credentials.password},
			headers: {AppId: this.get("appID"), AppKey: this.get("appKey")},
			cacheBust: false
		});

		request.error(failure);
		request.response(authSuccess, this);
		request.go();
	},

	getTags: function(success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL")+ "tag/list",
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			success(inResponse.tags);
		}, this);
		request.go({output: "json"});
	},

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

	unsubscribe: function(feed) {
		if(feed.isFolder) {
			this.removeLabel(feed);
		}
		else {
			this._getEditToken(function(token) {
				var parameters = {
					T: token,
					s: feed.id,
					ac: "unsubscribe",
					t: feed.title
				};

				var request = new enyo.Ajax({
					url: this.get("baseURL")+ "subscription/edit",
					method: "POST",
					xhrFields: {mozSystem: true},
					postBody: parameters,
					headers: this._requestHeaders(),
					cacheBust: false
				});

				request.response(function(inRequest, inResponse) {
					feedspider.handleApiStateChanged({state: "SubscriptionDeleted", id: feed.id, count: feed.unreadCount});
				});
				request.go({output: "json"});
			}.bind(this));
		}
	},

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
				postBody: parameters,
				headers: this._requestHeaders(),
				cacheBust: false
			});

			request.response(function(inRequest, inResponse) {
				feedspider.handleApiStateChanged({state: "FolderDeleted", id: folder.id});
			});
			request.go({output: "json"});
		}.bind(this));
	},

	searchSubscriptions: function(query, success, failure) {
		//Not supported by InoReader API. Auto-Fail
		failure();
		
		/*var self = this

		new Ajax.Request(this.get("baseURL")+ "feed-finder", {
		method: "GET",
		parameters: {q: query, output: "json"},
		requestHeaders: this._requestHeaders(),
		onFailure: failure,
		onSuccess: function(response) {
			var subscriptions = response.responseText.evalJSON().items
			success(subscriptions)
		}
		})*/
	},

	addSubscription: function(url, success, failure) {
		this._getEditToken(function(token) {
			var parameters = {
				T: token,
				quickadd: url
			};

			var request = new enyo.Ajax({
				url: this.get("baseURL")+ "subscription/quickadd",
				method: "POST",
				xhrFields: {mozSystem: true},
				postBody: parameters,
				headers: this._requestHeaders(),
				cacheBust: false
			});

			request.error(failure);
			request.response(function(inRequest, inResponse) {
				if(inResponse.streamId) 
				{
					success();
				}
				else 
				{
					failure();
				}
			}, this);
			request.go({output: "json"});
		}.bind(this));
	},

	getAllSubscriptions: function(success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL")+ "subscription/list", 
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			this.cacheTitles(inResponse.subscriptions);
			success(inResponse.subscriptions);
		}, this);
		request.go({output: "json"});
	},

	cacheTitles: function(subscriptions) {
		this.set("titles", {});
		for (var i=0 ; i<subscriptions.length; i++)
		{
			this.get("titles")[subscriptions[i].id] = subscriptions[i].title;
		}
	},

	titleFor: function(id) {
		return this.get("titles")[id];
	},

	getUnreadCounts: function(success, failure) {
		var request = new enyo.Ajax({
			url: this.get("baseURL")+ "unread-count", 
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

	getAllArticles: function(continuation, success, failure) {
		this._getArticles(
			"user/-/state/com.google/reading-list",
			FeedSpider2.Preferences.hideReadArticles() ? "user/-/state/com.google/read" : null,
			continuation,
			success,
			failure
		);
	},

	getAllStarred: function(continuation, success, failure) {
		this._getArticles(
			"user/-/state/com.google/starred",
			null,
			continuation,
			success,
			failure
		);
	},

	getAllShared: function(continuation, success, failure) {
		this._getArticles(
			"user/-/state/com.google/broadcast",
			null,
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

	getAllArticlesFor: function(id, continuation, success, failure) {
		this._getArticles(
			id,
			FeedSpider2.Preferences.hideReadArticles() ? "user/-/state/com.google/read" : null,
			continuation,
			success,
			failure
		);
	},

	//UPDATED 2.0.0
	_getArticles: function(id, exclude, continuation, success, failure) {
		var parameters = {output: "json", n: 40};

		if(id != "user/-/state/com.google/starred" &&
		id != "user/-/state/com.google/broadcast" &&
		FeedSpider2.Preferences.isOldestFirst()) {
			parameters.r = "o";
		}

		if(continuation) {
			parameters.c = continuation;
		}

		if(exclude) {
			parameters.xt = exclude;
		}

		var request = new enyo.Ajax({
			url: this.get("baseURL")+ "stream/contents/" + escape(id),
			method: "GET",
			xhrFields: {mozSystem: true},
			headers: this._requestHeaders(),
			cacheBust: false
		});

		request.error(failure);
		request.response(function(inRequest, inResponse) {
			success(inResponse.items, inResponse.id, inResponse.continuation);
		}, this);
		request.go(parameters);
	},

	markAllRead: function(id, success, failure) {
		this._getEditToken(
			function(token) {
				var parameters = {
					T: token,
					s: id
				};

				var request = new enyo.Ajax({
					url: this.get("baseURL")+ "mark-all-as-read",
					method: "POST",
					xhrFields: {mozSystem: true},
					postBody: parameters,
					headers: this._requestHeaders(),
					cacheBust: false
				});

				request.error(failure);
				request.response(success);
				request.go({output: "json"});
			}.bind(this),

			failure
		);
	},

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
		request.response(this.searchItemsFound.bind(this, success, failure));
		request.go(parameters);
	},

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

	mapSearchResults: function(response) {
		console.log(response);
	},

	setArticleRead: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			"user/-/state/com.google/read",
			null,
			success,
			failure
		);
	},

	setArticleNotRead: function(articleId, subscriptionId, success, failure, sticky) {
		this._editTag(
			articleId,
			subscriptionId,
			null,
			"user/-/state/com.google/read",
			success,
			failure
		);
	},

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

	setArticleStarred: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			"user/-/state/com.google/starred",
			null,
			success,
			failure
		);
	},

	setArticleNotStarred: function(articleId, subscriptionId, success, failure) {
		this._editTag(
			articleId,
			subscriptionId,
			null,
			"user/-/state/com.google/starred",
			success,
			failure
		);
	},

	_editTag: function(articleId, subscriptionId, addTag, removeTag, success, failure) {
		Log.debug("editing tag for article id = " + articleId + " and subscription id = " + subscriptionId);

		this._getEditToken(
			function(token) {
				var parameters = {
					T: token,
					i: articleId,
					s: subscriptionId
				};

				if(addTag) {parameters.a = addTag;}
				if(removeTag) {parameters.r = removeTag;}

				var request = new enyo.Ajax({
					url: this.get("baseURL")+ "edit-tag",
					method: "POST",
					xhrFields: {mozSystem: true},
					postBody: parameters,
					headers: this._requestHeaders(),
					cacheBust: false
				});

				request.error(failure);
				request.response(success);
				request.go({output: "json"});
			}.bind(this),

			failure
		);
	},

	_requestHeaders: function() {
		return {Authorization:"GoogleLogin auth=" + this.auth, AppId: this.get("appID"), AppKey: this.get("appKey")};
	},

	_getEditToken: function(success, failure) {
		if(this.get("editToken") && (new Date().getTime() - this.get("editTokenTime") < 120000)) {
			Log.debug("using last edit token - " + this.get("editToken"));
			success(this.get("editToken"));
		}
		else {
			var request = new enyo.Ajax({
				url: this.get("baseURL")+ "token",
				method: "GET",
				xhrFields: {mozSystem: true},
				headers: this._requestHeaders(),
				cacheBust: false
			});

			request.error(failure);
			request.response(function(inRequest, inResponse) {
				this.set("editToken", inResponse);
				this.set("editTokenTime", new Date().getTime());
				Log.debug("retrieved edit token - " + this.get("editToken"));
				success(this.get("editToken"));
			}.bind(this));
			request.go();
		}
	},
	
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
	
	supportsStarred: function() {
		return true;
	},
	
	supportsShared: function() {
		return true;
	},
	
	supportsSearch: function() {
		return false;
	},
	
	//UPDATED 0.9.5
	supportsManualSort: function() {
		return true;
	}
});