enyo.kind({
	name: "FeedSpider2.AllArticles",
	kind: "FeedSpider2.ArticleContainer",

	published: {
		id: "user/-/state/com.google/reading-list",
		title: $L("All Items"),
		icon: "assets/list.png",
		sticky: true,
		divideBy: "Home",
		hideDivider: "hide-divider",
		showOrigin: true,
		canMarkAllRead: true
	},

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-list");
		this.inherited(arguments);				
	},
	
	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllArticles(continuation, success, failure);
	},

	articleRead: function(subscriptionId) {
		this.incrementUnreadCountBy(-1);
	},

	articleNotRead: function(subscriptionId) {
		this.incrementUnreadCountBy(1);
	},

	markSourceRead: function(success) {
		this.get("api").markAllRead(this.get("id"), function() {
			this.clearUnreadCount();
			this.get("items").forEach(function(item) {item.isRead = true;});
			success();
		}.bind(this));
	}
});