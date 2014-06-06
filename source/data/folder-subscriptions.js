enyo.kind({
	name: "FeedSpider2.FolderSubscriptions",
	kind: "FeedSpider2.SubscriptionContainer",
	
	constructor: function(api, stream) {
		this.inherited(arguments);	
		this.subscriptionOrderingStream = stream
	}
})