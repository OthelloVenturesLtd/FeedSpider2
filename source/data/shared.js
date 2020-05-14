enyo.kind({
	name: "FeedSpider2.Shared",
	kind: "FeedSpider2.ArticleContainer",
	
	published: {
		id: "user/-/state/com.google/broadcast",
		title: $L("Shared"),
		icon: "assets/shared-grey.png",
		sticky: true,
		divideBy: "Home",
		hideDivider: "hide-divider",
		showOrigin: true,
		canMarkAllRead: false
	},

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-shared");
		this.inherited(arguments);
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllShared(continuation, success, failure);
	},

	articleRead: function(subscriptionId) {
	},

	articleNotRead: function(subscriptionId) {
	}
});