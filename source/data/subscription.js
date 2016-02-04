enyo.kind({
	name: "FeedSpider2.Subscription",
	kind: "FeedSpider2.ArticleContainer",
	
	published: {
		canMarkAllRead: true,
		categories: null,
		data: null,
		divideBy: $L("Subscriptions"),
		feedWatched: false,
		icon: "assets/rss-grey.png",
		sortId: null	
	},

	bindings: [
		{from: ".data.id", to: ".id"},
		{from: ".data.title", to: ".title"},
		{from: ".data.sortid", to: ".sortId"},
		{from: ".data.categories", to: ".categories"}
	],
	
	rendered: function() {
		this.$.sourceIcon.addClass("subscription-rss");
		this.inherited(arguments);				
	},

	belongsToFolder: function() {
		return this.categories && this.categories.length;
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllArticlesFor(this.get("id"), continuation, success, failure);
	},

	articleRead: function(subscriptionId) {
		if(this.get("id") == subscriptionId) {this.decrementUnreadCountBy(1);}
	},

	articleNotRead: function(subscriptionId) {
		if(this.get("id") == subscriptionId) {this.incrementUnreadCountBy(1);}
	},

	markSourceRead: function(success, error) {
		this.get("api").markAllRead(this.get("id"),
	  		function() {
				this.clearUnreadCount();
				this.get("items").forEach(function(item) {item.set("isRead", true);});
				success();
	  		}.bind(this), error);
	}
});