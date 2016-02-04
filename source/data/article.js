enyo.kind({
	name: "FeedSpider2.Article",
	kind: "enyo.Control",
	index: 0,
	
	published: {
  		api: null,
  		author: "",
  		continuation: "",
  		data: null,
  		displayDate: "",
  		id: null,
  		isRead: false,
  		isShared: false,
  		isStarred: false,
  		last: false,
  		origin: "",
  		readLocked: null,
  		sortDate: "",
  		subscription: null,
  		subscriptionId: null,
  		summary: "",
  		title: ""
	},
	
	events: {
		onArticleTap: ""
	},

	components: [
		{name: "source", layoutKind: enyo.FittableRowsLayout, noStretch: true, ontap: "itemTapped", components: [
			{name: "articleName", tag: "span", classes: "article-title"},
			{layoutKind: "FittableColumnsLayout", components: [
				{name: "starredIcon", tag: "div", showing: false, style:"background: url('assets/starred-grey.png') no-repeat left bottom; width: 16px; height: 24px; margin-left: 10px;"},
				{name: "articleOrigin", fit: true, classes: "article-origin", showing: false},
			]},
			{name: "borderContainer", style: "padding-top: 12px; width: 100%"}
		]}
	],

	bindings: [
		{from: ".subscription.api", to: ".api"},
		{from: ".data.id", to: ".id"},
		{from: ".data.title", to: ".title", transform: function(v){
			return data.title ? data.title : "No Title";
		}},
		{from: ".data.author", to: ".author"},
		{from: ".data", to: ".summary", transform: function(v){
			var content = data.content || data.summary || {content: ""};
			return this.cleanUp(content.content);
		}},
		{from: ".data.isReadStateLocked", to: ".readLocked"},
		{from: ".title", to: ".$.articleName.content"},
		{from: ".origin", to: ".$.articleOrigin.content"},
	],
	
	create: function() {
		this.inherited(arguments);

		this.set("subscriptionId", this.get("data").origin ? this.get("data").origin.streamId : this.get("subscription").id);
		this.set("origin", this.get("api").titleFor(this.get("subscriptionId")));
		this.setStates(this.get("data").categories);
		this.setDates(parseInt(this.get("data").crawlTimeMsec, 10));
		this.setArticleLink(this.get("data").alternate);
	},
	
	rendered: function() {
	    if (!this.get("isRead"))
    	{
    		this.$.articleName.addStyles("font-weight: bold");
    		this.$.articleOrigin.addStyles("font-weight: bold");		
    	}
    	
    	if (this.get("isStarred"))
    	{
    		this.$.starredIcon.show();
    	}
		
		if (this.get("subscription").showOrigin)
    	{
    		this.$.articleOrigin.show();
    	}
		
		if (!this.get("last"))
    	{
    		this.$.borderContainer.addStyles("border-bottom-width: 1px; border-bottom-style: groove");
    	}
    	this.inherited(arguments);
	},
	
	itemTapped: function() {
		this.doArticleTap(this);
	},
	
	cleanUp: function(content) {
		var cleaned = this.replaceYouTubeLinks(content);
		cleaned = cleaned.replace(/<script.*?<\/script.*?>/g , "");
		cleaned = cleaned.replace(/<iframe.*?<\/iframe.*?>/g , "");
		cleaned = cleaned.replace(/<object.*?<\/object.*?>/g , "");
		return cleaned;
	},

	replaceYouTubeLinks: function(content) {
		var embed = /<(embed|iframe).*src="(.*?youtube.com.*?)".*<\/(embed|iframe)>/;
		var urlMatch = embed.exec(content);

		if(urlMatch) {
			var idMatch = /\/(embed|v)\/([_\-a-zA-Z0-9]+)/.exec(urlMatch[2]);

			if(idMatch) {
				var id = idMatch[2];
				content = content.replace(embed, '<div class="youtube"><img class="youtube-thumbnail" src="http://img.youtube.com/vi/' + id + '/0.jpg"><div class="youtube-play" data-url="http://youtube.com/watch?v=' + id + '">&nbsp;</div></div>');
			}
		}

		return content;
	},

	setStates: function(categories) {
		categories.forEach(function(category) {
			if(category.endsWith("/state/com.google/read")) {
				this.set("isRead", true);
			}

			if(category.endsWith("/state/com.google/kept-unread")) {
				this.set("keepUnread", true);
			}

			if(category.endsWith("/state/com.google/starred")) {
				this.set("isStarred", true);
			}

			if(category.endsWith("/state/com.google/broadcast")) {
				this.set("isShared", true);
			}
		}.bind(this));
	},

	setDates: function(milliseconds) {
		var updatedAt = new Date(milliseconds);
		var month = this.leftPad(updatedAt.getMonth() + 1);
		var day = this.leftPad(updatedAt.getDate());
		var year = "" + updatedAt.getFullYear();
		
		var options = {year: "numeric", month: "short", day: "numeric"};
		this.set("displayDate", updatedAt.toLocaleDateString("en-US", options));
		this.set("sortDate", year + month + day);
	},

	setArticleLink: function(alternates) {
		(alternates || []).forEach(function(alternate) {
			if(alternate.type.include("html")) {
				this.url = alternate.href;
			}
		}.bind(this));
	},

	leftPad: function(number) {
		var s = "0000" + number;
		return s.substr(s.length - 2);
	},

	toggleRead: function() {
		if(this.get("isRead")) {
			this.turnReadOff(function() {}, function() {}, true);
		}
		else {
			this.turnReadOn(function() {}, function() {});
		}
	},

	toggleStarred: function() {
		if(this.get("isStarred")) {
			this.turnStarOff(function() {}, function() {});
		}
		else {
			this.turnStarOn(function() {}, function() {});
		}
	},

	turnReadOn: function(success, failure) {
		this._setState("Read", "isRead", true, success, failure);
	},

	turnReadOff: function(success, failure, sticky) {
		this.set("keepUnread", sticky);
		this._setState("NotRead", "isRead", false, success, failure, sticky);
	},

	turnShareOn: function(success, failure) {
		if(this.get("api").supportsShared())
		{
			this._setState("Shared", "isShared", true, success, failure);
		}
		else
		{
			Feeder.notify($L("Sharing Not Available"));
		}
	},

	turnShareOff: function(success, failure) {
		if(this.get("api").supportsShared())
		{
			this._setState("NotShared", "isShared", false, success, failure);
		}
		else
		{
			Feeder.notify($L("Sharing Not Available"));
		}
	},

	turnStarOn: function(success, failure) {
		if(this.get("api").supportsStarred())
		{
			this._setState("Starred", "isStarred", true, success, failure);
		}
		else
		{
			Feeder.notify($L("Starring Not Available"));
		}
	},

	turnStarOff: function(success, failure) {
		if(this.get("api").supportsStarred())
		{
			this._setState("NotStarred", "isStarred", false, success, failure);
		}
		else
		{
			Feeder.notify($L("Starring Not Available"));
		}
	},

	_setState: function(apiState, localProperty, localValue, success, failure, sticky) {
		Log.debug("setting article state - " + apiState);

		if(apiState.match(/Read/) && this.get("readLocked")) {
			Feeder.notify($L("Read state has been locked by the service"));
			success(false);
		}
		else {
			this.set(localProperty, localValue);

			var onComplete = function() {
				feedspider.handleApiStateChanged({state: apiState, subscriptionId: this.subscriptionId});
				success(true);
			}.bind(this);

			this.get("api")["setArticle" + apiState](this.get("id"), this.subscriptionId, onComplete, failure, sticky);
		}
	},

	getPrevious: function(callback) {
		var previousIndex = this.index - 1;
		var previous = null;

		if(this.index) {
			previous = this.get("subscription").get("items")[previousIndex];
			previous.index = previousIndex;
		}

		callback(previous);
	},

	getNext: function(callback, loadingMore) {
		var nextIndex = this.index + 1;
		var next = null;

		if(nextIndex < this.get("subscription").get("items").length) {
			next = this.get("subscription").get("items")[nextIndex];
			next.index = nextIndex;
		}

		if(nextIndex == this.get("subscription").get("items").length && this.get("subscription").get("continuation") !== undefined && this.get("subscription").get("continuation") !== false) {
			loadingMore();

			var foundMore = function() {
				next = this.subscription.get("items")[nextIndex];
				next.index = nextIndex;
				callback(next);
			}.bind(this);

			this.get("subscription").findArticles(foundMore, callback);
		}
		else {
			callback(next);
		}
	}
});