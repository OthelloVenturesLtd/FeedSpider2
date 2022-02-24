enyo.kind({
	name: "FeedSpider2.Starred",
	kind: "FeedSpider2.ArticleContainer",
	
	published: {
		id: "user/-/state/com.google/starred",
		title: $L("Starred"),
		icon: "assets/starred-grey.png",
		sticky: true,
		divideBy: "Home",
		hideDivider: "hide-divider",
		showOrigin: true,
		canMarkAllRead: false
	},

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-star");
		this.inherited(arguments);				
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllStarred(continuation, success, failure);
	},

	articleRead: function(subscriptionId) {
	},

	articleNotRead: function(subscriptionId) {
	}
});