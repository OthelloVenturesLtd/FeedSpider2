enyo.kind({
	name: "FeedSpider2.Folder",
	kind: "FeedSpider2.ArticleContainer",
	
    published: {
    	icon: "assets/folder-grey.png",
    	divideBy: $L("Subscriptions"),
    	stickySubscriptions: [this],
    	subscriptions: null,
    	showOrigin: true,
    	canMarkAllRead: true,
    	isFolder: true
    },

    create: function() {
    	this.inherited(arguments);
    	this.set("subscriptions", new FeedSpider2.SubscriptionContainer({api: this.get("api"), subscriptionOrderingStream: this.get("id")}));
    },

	rendered: function() {
		this.$.sourceIcon.addClass("subscription-folder");
		this.inherited(arguments);				
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
			return subscriptionA.get("title").toUpperCase() - subscriptionB.get("title").toUpperCase();
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
		this.get("subscriptions").get("items").clear();
		this.get("subscriptions").get("items").push.apply(this.get("subscriptions").get("items"), sortedItems);
	}
});