enyo.kind({
	name: "FeedSpider2.Fresh",
	kind: "FeedSpider2.ArticleContainer",
	
	constructor: function(api) {
		this.inherited(arguments);	
		this.id = "user/-/state/com.google/fresh";
		this.title = $L("Fresh");
		this.icon = "assets/fresh.png";
		this.sticky = true;
		this.divideBy = "Home";
		this.hideDivider = "hide-divider";
		this.showOrigin = true;
		this.canMarkAllRead = false;
	},

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-fresh");
		this.inherited(arguments);				
	},

	makeApiCall: function(continuation, success, failure) {
		this.api.getAllFresh(continuation, success, failure)
	},

	articleRead: function(subscriptionId) {
	},

	articleNotRead: function(subscriptionId) {
	}
});