enyo.kind({
	name: "FeedSpider2.StarredArticlesModel",
	kind: "FeedSpider2.FeedModel",
	
	attributes: {
		id: "user/-/state/com.google/starred",
		iconClass: "subscription-star",
		title: $L("Starred"),
		showOrigin: true
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllStarred(continuation, success, failure);
	}
});