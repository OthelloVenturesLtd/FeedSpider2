enyo.kind({
	name: "FeedSpider2.Shared",
	kind: "FeedSpider2.ArticleContainer",
	
	constructor: function(api) {
		this.inherited(arguments);	
		this.id = "user/-/state/com.google/broadcast";
		this.title = $L("Shared");
		this.icon = "assets/shared-grey.png";
		this.sticky = true;
		this.divideBy = "Home";
		this.hideDivider = "hide-divider";
		this.showOrigin = true;
		this.canMarkAllRead = false;
	},

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-shared");
		this.inherited(arguments);				
	},

	makeApiCall: function(continuation, success, failure) {
		this.api.getAllShared(continuation, success, failure)
	},

	articleRead: function(subscriptionId) {
	},

	articleNotRead: function(subscriptionId) {
	}
});