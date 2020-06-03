enyo.kind({
	name: "FeedSpider2.FreshArticlesModel",
	kind: "FeedSpider2.FeedModel",
	
	attributes: {
		id: "user/-/state/com.google/fresh",
		iconClass: "subscription-fresh",
		title: $L("Fresh"),
		showOrigin: true
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllFresh(continuation, success, failure);
	}
});