enyo.kind({
	name: "FeedSpider2.Archived",
	kind: "FeedSpider2.ArticleContainer",
	
	published: {
		id: "user/-/state/com.google/archived",
		title: $L("Archived"),
		icon: "assets/archived.png",
		sticky: true,
		divideBy: "Home",
		hideDivider: "hide-divider",
		showOrigin: true,
		canMarkAllRead: false
	},

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-archived");
		this.inherited(arguments);				
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllArchived(continuation, success, failure);
	},

	articleRead: function(subscriptionId) {
	},

	articleNotRead: function(subscriptionId) {
	}
});