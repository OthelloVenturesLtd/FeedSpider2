enyo.kind({
	name: "FeedSpider2.Fresh",
	kind: "FeedSpider2.ArticleContainer",
	
	published: {
		id: "user/-/state/com.google/fresh",
		title: $L("Fresh"),
		icon: "assets/fresh.png",
		sticky: true,
		divideBy: "Home",
		hideDivider: "hide-divider",
		showOrigin: true,
		canMarkAllRead: false
	},

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-fresh");
		this.inherited(arguments);				
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllFresh(continuation, success, failure);
	},

	articleRead: function(subscriptionId) {
	},

	articleNotRead: function(subscriptionId) {
	}
});