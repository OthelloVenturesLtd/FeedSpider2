enyo.kind({
	name: "FeedSpider2.ArchivedArticlesModel",
	kind: "FeedSpider2.FeedModel",
	
	attributes: {
		id: "user/-/state/com.google/archived",
		iconClass: "subscription-archived",
		title: $L("Archived"),
		showOrigin: true
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllArchived(continuation, success, failure);
	}
});