enyo.kind({
	name: "FeedSpider2.Archived",
	kind: "FeedSpider2.ArticleContainer",
	
	constructor: function(api) {
		this.inherited(arguments);	
		this.id = "user/-/state/com.google/archived";
		this.title = "Archived"; //$L("Archived");
		this.icon = "assets/archived.png";
		this.sticky = true;
		this.divideBy = "Home";
		this.hideDivider = "hide-divider";
		this.showOrigin = true;
		this.canMarkAllRead = false;
	},

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-archived");
		this.inherited(arguments);				
	},

	makeApiCall: function(continuation, success, failure) {
		this.api.getAllArchived(continuation, success, failure)
	},

	articleRead: function(subscriptionId) {
	},

	articleNotRead: function(subscriptionId) {
	}
});

/*var Archived = Class.create(ArticleContainer, {
  initialize: function($super, api) {
    $super(api)
    this.id = "user/-/state/com.google/archived"
    this.title = $L("Archived")
    this.icon = "archived"
    this.sticky = true
    this.divideBy = "Home"
    this.hideDivider = "hide-divider"
    this.showOrigin = true
    this.canMarkAllRead = false
  },

  makeApiCall: function(continuation, success, failure) {
    this.api.getAllArchived(continuation, success, failure)
  },

  articleRead: function(subscriptionId) {
  },

  articleNotRead: function(subscriptionId) {
  }
})*/