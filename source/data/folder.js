enyo.kind({
	name: "FeedSpider2.Folder",
	kind: "FeedSpider2.ArticleContainer",
	
    published: {
    	icon: "assets/folder-grey.png",
    	divideBy: $L("Subscriptions"),
    	feedWatched: false,
    	stickySubscriptions: [],
    	subscriptions: null,
    	showOrigin: true,
    	canMarkAllRead: true,
    	isFolder: true
    },

    create: function() {
    	this.inherited(arguments);
    	this.set("subscriptions", new FeedSpider2.SubscriptionContainer({api: this.get("api"), items: [], subscriptionOrderingStream: this.get("id")}));
    	this.set("stickySubscriptions", [this]);
    },

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-folder");
		this.inherited(arguments);				
	},

	addSubscription: function(subscription)
	{
		console.log("Entering Add Subscription");
		var subscriptionItems = this.get("subscriptions").get("items");
		//Check to make sure that the subscription doesn't already exist
		var subscriptionIndex;
		
		//Explicitly shortcircuit this check, because we don't have access to array.findIndex in es5.
		subscriptionItems.find(function(value, index, array){
			if (value.id === subscription.id) {subscriptionIndex = index;}
			return value.id === subscription.id;
		});
console.log("Got Subscription Index", subscriptionIndex);
		if (subscriptionIndex >= 0)
		{
			console.log("Replacing Existing subscription", subscription);
			//Assume that a fresh subscription contains updated data that should superscede what we already have.
			subscriptionItems[subscriptionIndex] = subscription;
		}
		else
		{
			console.log("Pushing New Subscription", subscription);
			//Otherwise, add it to the end. The sort function will take care of sorting things.
			subscriptionItems.push(subscription);
		}
	},

	makeApiCall: function(continuation, success, failure) {
		this.get("api").getAllArticlesFor(this.get("id"), continuation, success, failure);
	},

	markSourceRead: function(success) {
		var self = this;

		self.get("api").markAllRead(self.get("id"), function() {
			self.get("subscriptions").get("items").forEach(function(subscription) {
				subscription.clearUnreadCount();
			});

			self.clearUnreadCount();
			self.get("items").forEach(function(item) {item.isRead = true;});
			self.recalculateUnreadCounts();
			success();
		});
	},

	addUnreadCount: function(count) {
		this.get("subscriptions").get("items").forEach(function(subscription) {
			if(subscription.get("id") == count.id) {
				if (count.count !== undefined)
				{
					subscription.setUnreadCount(count.count);
				}
				else
				{
					subscription.setUnreadCount(count.counter);
				}
			}
		});

		this.recalculateUnreadCounts();
	},

	articleRead: function(subscriptionId) {
		this.get("subscriptions").get("items").forEach(function(subscription){
			subscription.articleRead(subscriptionId);
		});

		this.recalculateUnreadCounts();
	},

	articleNotRead: function(subscriptionId) {
		this.get("subscriptions").get("items").forEach(function(subscription){
			subscription.articleNotRead(subscriptionId);
		});

		this.recalculateUnreadCounts();
	},

	recalculateUnreadCounts: function() {
		this.setUnreadCount(0);

		this.get("subscriptions").get("items").forEach(function(subscription) {
			this.incrementUnreadCountBy(subscription.getUnreadCount());
		}.bind(this));
	},

	sortAlphabetically: function() {
		this.sortBy(function(subscriptionA, subscriptionB) {
			if (subscriptionB.get("title").toUpperCase() < subscriptionA.get("title").toUpperCase())
			{
				return 1;
			}
			else if (subscriptionA.get("title").toUpperCase() < subscriptionB.get("title").toUpperCase())
			{
				return -1;
			}
			else
			{
				return 0;
			}
		});
	},

	sortManually: function(sortOrder, error) {
		if(!sortOrder) {return;}

		this.get("subscriptions").get("items").forEach(function(subscription, index) {
			subscription.set("sortNumber", sortOrder.getSortNumberFor(subscription.get("sortId")));
		}.bind(this));

		this.sortBy(function(subscriptionA, subscriptionB) {return subscriptionA.get("sortNumber") - subscriptionB.get("sortNumber");});
	},

	sortBy: function(f) {
		var sortedItems = this.get("subscriptions").get("items").sort(f);
		this.get("subscriptions").set("items", []);
		this.get("subscriptions").get("items").push.apply(this.get("subscriptions").get("items"), sortedItems);
	}
});