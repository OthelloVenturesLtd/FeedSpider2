enyo.kind({
	name: "FeedSpider2.SubscriptionContainer",
	kind: "FeedSpider2.Countable",
	
	published: {
		api: null,
		items: [],
		subscriptionOrderingStream: null
	},
	
	remove: function(subscription) {
		for (var i = 0; i < this.get("items").length; i++)
		{
			if(this.get("items")[i].get("id") == subscription.get("id")) {
				this.get("items").splice(i, 1);
				this.get("api").unsubscribe(subscription);
				break;
			}			
		}
	},

	move: function(subscription, beforeSubscription) {
		if (this.get("api").supportsManualSort())
		{
			for (var i = 0; i < this.get("items").length; i++)
			{
				if(this.get("items")[i].get("id") == subscription.get("id")) {
					Log.debug("removing " + subscription.get("id") + " at index " + i);
					this.get("items").splice(i, 1);
					break;
				}
			}
			
			if(beforeSubscription) {
				for (var j = 0; j < this.get("items").length; j++)
				{
					if(this.get("items")[j].get("id") == beforeSubscription.get("id")) {
						Log.debug("inserting " + subscription.get("id") + " at index " + j);
						this.get("items").splice(j, 0, subscription);
						break;
					}
				}
			}
			else {
				this.get("items").push(subscription);
			}
			var sortOrder = this.get("items").map(function(subscription) {return subscription.sortId;}).join("");
			this.get("api").setSortOrder(sortOrder, this.get("subscriptionOrderingStream"));
		}
		else
		{
			FeedSpider2.Notifications.notify($L("Manual Sort Not Available"));
			FeedSpider2.Preferences.setManualFeedSort(false);
		}
	}
});