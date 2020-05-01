/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.InoAPI",
	kind: "FeedSpider2.API",

	published: {
		auth: null,
		baseURL: "https://www.inoreader.com/reader/api/0/",
		appID: "1000001438",
		appKey: "Hea9JkjSNEepktY0s9ss9TUaETgCoBzg"	
	},

	login: function(credentials, success, failure) {
		var authSuccess = function(inSender, inResponse) {
			var authMatch = inResponse.match(/Auth\=(.*)/);
			this.set("auth", authMatch ? authMatch[1] : '');
			success(this.get("auth"));
		}.bind(this);

		var request = new enyo.Ajax({
			url: "https://www.inoreader.com/accounts/ClientLogin",
			method: "post",
			xhrFields: {mozSystem: true},
			postBody: {Email: credentials.email, Passwd: credentials.password},
			headers: {AppId: this.get("appID"), AppKey: this.get("appKey")}
		});

		request.error(failure);
		request.response(authSuccess, this);
		request.go();
	},

	getTags: function(success, failure) {
		new Ajax.Request(this.get("baseURL")+ "tag/list", {
			method: "get",
			parameters: {output: "json"},
			requestHeaders: this._requestHeaders(),
			onFailure: failure,
			onSuccess: function(response) {success(response.responseText.evalJSON().tags);}
		});
	},

	getSortOrder: function(success, failure) {
		new Ajax.Request(this.get("baseURL")+ "preference/stream/list", {
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
		})
	},

	setSortOrder: function(sortOrder, stream) {
		this._getEditToken(function(token) {
		var parameters = {
			T: token,
			s: stream || "user/-/state/com.google/root",
			k: "subscription-ordering",
			v: sortOrder
		}

		new Ajax.Request(this.get("baseURL")+ "preference/stream/set", {
			method: "post",
			parameters: parameters,
			requestHeaders: this._requestHeaders()
		})
		}.bind(this))
	},

	unsubscribe: function(feed) {
		if(feed.isFolder) {
		this.removeLabel(feed)
		}
		else {
		this._getEditToken(function(token) {
			var parameters = {
			T: token,
			s: feed.id,
			ac: "unsubscribe",
			t: feed.title
			}

			new Ajax.Request(this.get("baseURL")+ "subscription/edit", {
			method: "post",
			parameters: parameters,
			requestHeaders: this._requestHeaders(),
			onSuccess: function() {feedspider.handleApiStateChanged({state: "SubscriptionDeleted", id: feed.id, count: feed.unreadCount})}
			})
		}.bind(this))
		}
	},

	removeLabel: function(folder) {
		this._getEditToken(function(token) {
		var parameters = {
			T: token,
			s: folder.id,
			t: folder.title
		}

		new Ajax.Request(this.get("baseURL")+ "disable-tag", {
			method: "post",
			parameters: parameters,
			requestHeaders: this._requestHeaders(),
			onSuccess: function() {feedspider.handleApiStateChanged({state: "FolderDeleted", id: folder.id})}
		})
		}.bind(this))
	},

	searchSubscriptions: function(query, success, failure) {
		//Not supported by InoReader API. Auto-Fail
		failure()
		
		/*var self = this

		new Ajax.Request(this.get("baseURL")+ "feed-finder", {
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

	addSubscription: function(url, success, failure) {
		this._getEditToken(function(token) {
		var parameters = {
			T: token,
			quickadd: url
		}

		new Ajax.Request(this.get("baseURL")+ "subscription/quickadd", {
			method: "post",
			parameters: parameters,
			requestHeaders: this._requestHeaders(),
			onFailure: failure,
			onSuccess: function(response) {
			var json = response.responseText.evalJSON()

			if(json.streamId) {
				success()
			}
			else {
				failure()
			}
			}
		})
		}.bind(this))
	},

	getAllSubscriptions: function(success, failure) {
		var self = this

		new Ajax.Request(this.get("baseURL")+ "subscription/list", {
		method: "get",
		parameters: {output: "json"},
		requestHeaders: this._requestHeaders(),
		onFailure: failure,
		onSuccess: function(response) {
			var subscriptions = response.responseText.evalJSON().subscriptions
			self.cacheTitles(subscriptions)
			success(subscriptions)
		}
		})
	},

	cacheTitles: function(subscriptions) {
		var self = this
		self.titles = {}

		subscriptions.each(function(subscription) {
		self.titles[subscription.id] = subscription.title
		})
	},

	titleFor: function(id) {
		return this.titles[id]
	},

	getUnreadCounts: function(success, failure) {
		new Ajax.Request(this.get("baseURL")+ "unread-count", {
		method: "get",
		parameters: {output: "json"},
		requestHeaders: this._requestHeaders(),
		onFailure: failure,
		onSuccess: function(response) {
			var json = response.responseText.evalJSON()

			if(json.denied) {
			failure()
			}
			else {
			success(json.unreadcounts)
			}
		}
		})
	},

	getAllArticles: function(continuation, success, failure) {
		this._getArticles(
		"user/-/state/com.google/reading-list",
		FeedSpider2.Preferences.hideReadArticles() ? "user/-/state/com.google/read" : null,
		continuation,
		success,
		failure
		)
	},

	getAllStarred: function(continuation, success, failure) {
		this._getArticles(
		"user/-/state/com.google/starred",
		null,
		continuation,
		success,
		failure
		)
	},

	getAllShared: function(continuation, success, failure) {
		this._getArticles(
		"user/-/state/com.google/broadcast",
		null,
		continuation,
		success,
		failure
		)
	},

	//UPDATED 1.2.0
	getAllFresh: function(continuation, success, failure) {
		failure()    
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
		failure()
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
		)
	},

	//UPDATED 2.0.0
	_getArticles: function(id, exclude, continuation, success, failure) {
		var parameters = {output: "json", n: 40}

		if(id != "user/-/state/com.google/starred" &&
		id != "user/-/state/com.google/broadcast" &&
		FeedSpider2.Preferences.isOldestFirst()) {
		parameters.r = "o"
		}

		if(continuation) {
		parameters.c = continuation
		}

		if(exclude) {
		parameters.xt = exclude
		}

		new Ajax.Request(this.get("baseURL")+ "stream/contents/" + escape(id), {
		method: "get",
		parameters: parameters,
		requestHeaders: this._requestHeaders(),
		onFailure: failure,
		onSuccess: function(response) {
			if(response.responseJSON) {
				var	articles = response.responseJSON
			}
			else {
				if (enyo.platform.firefoxOS)
				{
					var articles = JSON.parse(response.responseText)
				}
				else
				{
					var articles = JSON2.parse(response.responseText)
				}
			}
			success(articles.items, articles.id, articles.continuation)
		}
		})
	},

	markAllRead: function(id, success, failure) {
		this._getEditToken(
		function(token) {
			var parameters = {
			T: token,
			s: id
			}

			new Ajax.Request(this.get("baseURL")+ "mark-all-as-read", {
			method: "post",
			parameters: parameters,
			requestHeaders: this._requestHeaders(),
			onSuccess: success,
			onFailure: failure
			})
		}.bind(this),

		failure
		)
	},

	search: function(query, id, success, failure) {
		var parameters = {
		q: query,
		num: 50,
		output: "json"
		}

		if(id) {
		parameters.s = id
		}

		new Ajax.Request(this.get("baseURL")+ "search/items/ids", {
		method: "get",
		parameters: parameters,
		requestHeaders: this._requestHeaders(),
		onSuccess: this.searchItemsFound.bind(this, success, failure),
		onFailure: failure
		})
	},

	searchItemsFound: function(success, failure, response) {
		var self = this
		var ids = response.responseText.evalJSON().results

		if(ids.length) {
		self._getEditToken(
			function(token) {
			var parameters = {
				T: token,
				i: ids.map(function(n) {return n.id})
			}

			new Ajax.Request(this.get("baseURL")+ "stream/items/contents", {
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
		}
	},

	mapSearchResults: function(response) {
		console.log(response.responseText)
	},

	setArticleRead: function(articleId, subscriptionId, success, failure) {
		this._editTag(
		articleId,
		subscriptionId,
		"user/-/state/com.google/read",
		null,
		success,
		failure
		)
	},

	setArticleNotRead: function(articleId, subscriptionId, success, failure, sticky) {
		this._editTag(
		articleId,
		subscriptionId,
		null,
		"user/-/state/com.google/read",
		success,
		failure
		)
	},

	setArticleShared: function(articleId, subscriptionId, success, failure) {
		this._editTag(
		articleId,
		subscriptionId,
		"user/-/state/com.google/broadcast",
		null,
		success,
		failure
		)
	},

	setArticleNotShared: function(articleId, subscriptionId, success, failure) {
		this._editTag(
		articleId,
		subscriptionId,
		null,
		"user/-/state/com.google/broadcast",
		success,
		failure
		)
	},

	setArticleStarred: function(articleId, subscriptionId, success, failure) {
		this._editTag(
		articleId,
		subscriptionId,
		"user/-/state/com.google/starred",
		null,
		success,
		failure
		)
	},

	setArticleNotStarred: function(articleId, subscriptionId, success, failure) {
		this._editTag(
		articleId,
		subscriptionId,
		null,
		"user/-/state/com.google/starred",
		success,
		failure
		)
	},

	_editTag: function(articleId, subscriptionId, addTag, removeTag, success, failure) {
		Log.debug("editing tag for article id = " + articleId + " and subscription id = " + subscriptionId)

		this._getEditToken(
		function(token) {
			var parameters = {
			T: token,
			i: articleId,
			s: subscriptionId
			}

			if(addTag) parameters.a = addTag
			if(removeTag) parameters.r = removeTag

			new Ajax.Request(this.get("baseURL")+ "edit-tag", {
			method: "post",
			parameters: parameters,
			requestHeaders: this._requestHeaders(),
			onSuccess: success,
			onFailure: failure
			})
		}.bind(this),

		failure
		)
	},

	_requestHeaders: function() {
		return {Authorization:"GoogleLogin auth=" + this.auth, AppId: this.get("appID"), AppKey: this.get("appKey")}
	},

	_getEditToken: function(success, failure) {
		if(this.editToken && (new Date().getTime() - this.editTokenTime < 120000)) {
		Log.debug("using last edit token - " + this.editToken)
		success(this.editToken)
		}
		else {
		new Ajax.Request(this.get("baseURL")+ "token", {
			method: "get",
			requestHeaders: this._requestHeaders(),
			onFailure: failure,
			onSuccess: function(response) {
			this.editToken = response.responseText
			this.editTokenTime = new Date().getTime()
			Log.debug("retrieved edit token - " + this.editToken)
			success(this.editToken)
			}.bind(this)
		})
		}
	},
	
	supportsAllArticles: function() {
		return true
	},
	
	//UPDATED 1.2.0  
	supportsArchived: function() {
		return false
	},
	
	//UPDATED 1.2.0  
	supportsFresh: function() {
		return false
	},
	
	supportsStarred: function() {
		return true
	},
	
	supportsShared: function() {
		return true
	},
	
	supportsSearch: function() {
		return false
	},
	
	//UPDATED 0.9.5
	supportsManualSort: function() {
		return true
	}
  
});