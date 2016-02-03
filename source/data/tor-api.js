enyo.kind({
  name: "FeedSpider2.TorAPI",
  kind: "FeedSpider2.API",

  published: {
    auth: null,
    baseURL: "https://theoldreader.com/reader/api/0/",
    baseURL2: "https://theoldreader.com/reader/atom/",
    editToken: null,
    editTokenTime: null,
    titles: null
  },
  
  login: function(credentials, success, failure) {
    var authSuccess = function(inSender, inResponse) {
      var authMatch = inResponse.match(/Auth\=(.*)/);
      this.set("auth", authMatch ? authMatch[1] : '');
      success(this.get("auth"));
    }.bind(this);

    var request = new enyo.Ajax({
      url: "https://theoldreader.com/reader/api/0/accounts/ClientLogin",
      method: "post",
      handleAs: "text",
      postBody: {client: "FeedSpider2", accountType: "HOSTED_OR_GOOGLE", service: "reader", Email: credentials.email, Passwd: credentials.password},
      xhrFields: {mozSystem: true}
    });

    request.error(failure);

    request.response(authSuccess, this);

    request.go();
  },
  
  getTags: function(success, failure) {
    var request = new enyo.Ajax({
      url: this.get("baseURL") + "tag/list",
      headers: this._requestHeaders(),
      xhrFields: {mozSystem: true}
    });

    request.error(failure);

    request.response(function (inRequest, inResponse){
      success(inResponse.tags);
    }, this);

    request.go({output: "json"});
  },

  getSortOrder: function(success, failure) {
    var request = new enyo.Ajax({
      url: this.get("baseURL") + "preference/stream/list",
      headers: this._requestHeaders(),
      xhrFields: {mozSystem: true}
    });

    request.error(failure);

    request.response(function (inRequest, inResponse){
      var prefs = inResponse;
      var sortOrder = {};

      if(prefs && prefs.streamprefs) {
        $H(prefs.streamprefs).each(function(pair) {
          pair.key = pair.key.gsub(/user\/\d+\//, "user/-/");

          $A(pair.value).each(function(pref) {
            if("subscription-ordering" == pref.id) {
              sortOrder[pair.key] = new FeedSpider2.SortOrder(pref.value);
            }
          });
        });
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
        url: this.get("baseURL") + "preference/stream/set",
        method: "post",
        headers: this._requestHeaders(),
        xhrFields: {mozSystem: true},
        postBody: parameters
      });

      request.go();
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
          url: this.get("baseURL") + "preference/stream/set",
          method: "post",
          headers: this._requestHeaders(),
          xhrFields: {mozSystem: true},
          postBody: parameters
        });

        request.response(function(inRequest, inResponse){
          feedspider.handleApiStateChanged({state: "SubscriptionDeleted", id: feed.id, count: feed.unreadCount});
        });

        request.go();
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
        url: this.get("baseURL") + "disable-tag",
        method: "post",
        headers: this._requestHeaders(),
        xhrFields: {mozSystem: true},
        postBody: parameters
      });

      request.response(function(inRequest, inResponse){
        feedspider.handleApiStateChanged({state: "FolderDeleted", id: folder.id});
      });
    }.bind(this));
  },

  searchSubscriptions: function(query, success, failure) {
    var request = new enyo.Ajax({
      url: this.get("baseURL") + "feed-finder",
      headers: this._requestHeaders(),
      xhrFields: {mozSystem: true}
    });

    request.error(failure);

    request.response(function (inRequest, inResponse){
        success(inResponse.items);
    }, this);

    request.go({q: query, output: "json"});
  },

  addSubscription: function(url, success, failure) {
    this._getEditToken(function(token) {
      var parameters = {
        T: token,
        quickadd: url
      };

      var request = new enyo.Ajax({
        url: this.get("baseURL") + "subscription/quickadd",
        method: "post",
        headers: this._requestHeaders(),
        xhrFields: {mozSystem: true},
        postBody: parameters
      });

      request.error(failure);

      request.response(function(inRequest, inResponse){
          if(inResponse.streamId) {
            success();
          }
          else {
            failure();
          }
      });
    }.bind(this));
  },

  getAllSubscriptions: function(success, failure) {
    var self = this;
    var request = new enyo.Ajax({
      url: this.get("baseURL") + "subscription/list",
      headers: this._requestHeaders(),
      xhrFields: {mozSystem: true}
    });

    request.error(failure);

    request.response(function (inRequest, inResponse){
      var subscriptions = inResponse.subscriptions;
      self.cacheTitles(subscriptions);
      success(subscriptions);
    }, this);

    request.go({output: "json"});
  },

  cacheTitles: function(subscriptions) {
    var self = this;
    var titles = {};

    subscriptions.each(function(subscription) {
      titles[subscription.id] = subscription.title;
    });

    this.set("titles", titles);
  },

  titleFor: function(id) {
    return this.get("titles")[id];
  },

  getUnreadCounts: function(success, failure) {
    var request = new enyo.Ajax({
      url: this.get("baseURL") + "unread-count",
      headers: this._requestHeaders(),
      xhrFields: {mozSystem: true}
    });

    request.error(failure);

    request.response(function (inRequest, inResponse){
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
      Preferences.hideReadArticles() ? "user/-/state/com.google/read" : null,
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
      Preferences.hideReadArticles() ? "user/-/state/com.google/read" : null,
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
       Preferences.isOldestFirst()) {
      parameters.r = "o";
    }

    if(continuation) {
      parameters.c = continuation;
    }

    if(exclude) {
      parameters.xt = exclude;
    }
	
    var request = new enyo.Ajax({
      url: this.get("baseURL2") + escape(id),
      headers: this._requestHeaders(),
      xhrFields: {mozSystem: true}
    });

    request.error(failure);

    request.response(function (inRequest, inResponse){
      success(inResponse.items, inResponse.id, inResponse.continuation);
    }, this);

    request.go(parameters);
	
	// NOTE: This is the original Google Reader API Logic. The Old Reader API does not properly support using this method
	// for accessing "feeds of feeds" such as the all items feed, or "all" feeds within a folder. These must be accessed using
	// the Atom feed (https://theoldreader.com/reader/atom/) instead. Once The Old Reader fixes their API, I will look into
	// re-implementing the original logic for consistency's sake.
	/*
		new Ajax.Request(TorApi.BASE_URL + "stream/contents/" + escape(id), {
		  method: "get",
		  parameters: parameters,
		  requestHeaders: this._requestHeaders(),
		  onFailure: failure,
		  onSuccess: function(response) {
			var articles = response.responseText.evalJSON()
			success(articles.items, articles.id, articles.continuation)
		  }
		})
    */
  },

  markAllRead: function(id, success, failure) {
    this._getEditToken(
      function(token) {
        var parameters = {
          T: token,
          s: id
        };

        var request = new enyo.Ajax({
          url: this.get("baseURL") + "mark-all-as-read",
          method: "post",
          headers: this._requestHeaders(),
          xhrFields: {mozSystem: true},
          postBody: parameters
        });

        request.error(failure);

        request.response(success);
      }.bind(this), failure);
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
      url: this.get("baseURL") + "search/items/ids",
      headers: this._requestHeaders(),
      xhrFields: {mozSystem: true}
    });

    request.error(failure);

    request.response(this.searchItemsFound.bind(this, success, failure));

    request.go(parameters);
  },

  searchItemsFound: function(success, failure, inRequest, inResponse) {
    var self = this;
    var ids = inResponse.results;

    if(ids.length) {
      self._getEditToken(
        function(token) {
          var parameters = {
            T: token,
            i: ids.map(function(n) {return n.id;})
          };

          var request = new enyo.Ajax({
            url: this.get("baseURL") + "stream/items/contents",
            method: "post",
            headers: self._requestHeaders(),
            xhrFields: {mozSystem: true},
            postBody: parameters
          });

          request.error(failure);

          request.response(function(inRequest, inResponse) {
              success(inResponse.items, inResponse.id, inResponse.continuation);
          });
        }
      );
    }
    else {
      success([], "", false);
    }
  },

  mapSearchResults: function(response) {
    console.log(response.responseText);
  },

  setArticleRead: function(articleId, subscriptionId, success, failure) {
    this._editTag(
      articleId,
      subscriptionId,
      "user/-/state/com.google/read",
      "user/-/state/com.google/kept-unread",
      success,
      failure
    );
  },

  setArticleNotRead: function(articleId, subscriptionId, success, failure, sticky) {
    this._editTag(
      articleId,
      subscriptionId,
      sticky ? "user/-/state/com.google/kept-unread" : null,
      "user/-/state/com.google/read",
      success,
      failure
    );
  },

  setArticleShared: function(articleId, subscriptionId, success, failure) {
    /*this._editTag(
      articleId,
      subscriptionId,
      "user/-/state/com.google/broadcast",
      null,
      success,
      failure
    )*/
  },

  setArticleNotShared: function(articleId, subscriptionId, success, failure) {
    /*this._editTag(
      articleId,
      subscriptionId,
      null,
      "user/-/state/com.google/broadcast",
      success,
      failure
    )*/
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

        if(addTag) parameters.a = addTag;
        if(removeTag) parameters.r = removeTag;

        var request = new enyo.Ajax({
          url: this.get("baseURL") + "edit-tag",
          method: "post",
          headers: this._requestHeaders(),
          xhrFields: {mozSystem: true},
          postBody: parameters
        });

        request.error(failure);

        request.response(success);        

      }.bind(this), failure);
  },

  _requestHeaders: function() {
    return {Authorization:"GoogleLogin auth=" + this.get("auth")};
  },

  _getEditToken: function(success, failure) {
    if(this.get("editToken") && (new Date().getTime() - this.get("editTokenTime") < 120000)) {
      Log.debug("using last edit token - " + this.editToken);
      success(this.get("editToken"));
    }
    else {
      var request = new enyo.Ajax({
        url: this.get("baseURL") + "token",
        headers: this._requestHeaders(),
        xhrFields: {mozSystem: true}
      });

      request.error(failure);

      request.response(function(inRequest, inResponse){
        this.set("editToken", inResponse);
        this.set("editTokenTime", new Date().getTime());
        Log.debug("retrieved edit token - " + this.editToken);
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
	 return false;
  },
  
  supportsSearch: function() {
	 return false;
  },
  
  //UPDATED 0.9.5
  supportsManualSort: function() {
	 return false;
  }
});