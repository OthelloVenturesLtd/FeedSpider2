enyo.kind({
	name: "FeedSpider2.SharedArticlesModel",
	kind: "FeedSpider2.FeedModel",
	
	attributes: {
		id: "user/-/state/com.google/broadcast",
		iconClass: "subscription-shared",
		title: $L("Shared"),
		showOrigin: true
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllShared(continuation, success, failure);
	}
});