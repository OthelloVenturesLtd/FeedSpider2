enyo.kind({
	name: "FeedSpider2.AllArticlesModel",
	kind: "FeedSpider2.FeedModel",

	attributes: {
		id: "user/-/state/com.google/reading-list",
		iconClass: "subscription-list",
		title: $L("All Items"),
		showOrigin: true,
		canMarkAllRead: true
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
			this.set("unreadCount", 0);
			this.get("items").forEach(function(item) {item.isRead = true;});
			success();
		}.bind(this));
	}
});