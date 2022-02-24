enyo.kind({
	name: "FeedSpider2.AllSources",

	published: {
		all: null,
		api: null,
		archived: null,
		fresh: null,
		shared: null,
		starred: null,
		stickySources: null,
		subscriptions: null,
		subscriptionSources: null
	},

	create: function() {
		this.inherited(arguments);

		this.set("stickySources", {items: []});
		this.set("subscriptionSources", {items: []});

		if (this.get("api").supportsAllArticles())
		{
			this.set("all", new FeedSpider2.AllArticles({api: this.get("api")}));
			this.get("stickySources").items.push(this.all);
		}
		
		if (this.get("api").supportsFresh())
		{
			this.set("fresh", new FeedSpider2.Fresh({api: this.get("api")}));
			this.get("stickySources").items.push(this.fresh);
		}
	
		if (this.get("api").supportsStarred())
		{
			this.set("starred", new FeedSpider2.Starred({api: this.get("api")}));
			this.get("stickySources").items.push(this.starred);
		}
	
		if (this.get("api").supportsShared())
		{
			this.set("shared", new FeedSpider2.Shared({api: this.get("api")}));
			this.get("stickySources").items.push(this.shared);
		}
		
		if (this.get("api").supportsArchived())
		{
			this.set("archived", new FeedSpider2.Archived({api: this.get("api")}));
			this.get("stickySources").items.push(this.archived);
		}
		
		this.set("subscriptions", new FeedSpider2.AllSubscriptions({api: this.get("api")}));
	},

	findAll: function(success, failure) {
		var self = this;

		self.get("subscriptions").findAll(
			function() {
				self.get("all").setUnreadCount(self.get("subscriptions").getUnreadCount());
				success();
			}, failure
		);
	},

	sortAndFilter: function(success, failure) {
		var self = this;
		self.get("subscriptionSources").items = [];

		self.get("subscriptions").sort(
			function() {
				var hideReadFeeds = FeedSpider2.Preferences.hideReadFeeds();
				
				self.get("subscriptions").items.forEach(function(subscription) {
					if(!hideReadFeeds || (hideReadFeeds && subscription.get("unreadCount"))) {
						self.get("subscriptionSources").items.push(subscription);
					}
				});
				success();
			}, failure
		);
	},

	articleRead: function(subscriptionId) {
		this.get("all").decrementUnreadCountBy(1);
		this.get("subscriptions").articleRead(subscriptionId);
	},

	articleNotRead: function(subscriptionId) {
		this.get("all").incrementUnreadCountBy(1);
		this.get("subscriptions").articleNotRead(subscriptionId);
	},

	markedAllRead: function(count) {
		this.get("all").decrementUnreadCountBy(count);
		this.get("subscriptions").recalculateFolderCounts();
	},

	nukedEmAll: function() {
		this.get("all").clearUnreadCount();

		Log.debug("Marked EVERYTHING read");

		this.get("subscriptions").items.forEach(function(item) {
			Log.debug("Marking " + item.id + " read");

			if(item.get("isFolder")) {
				item.get("subscriptions").items.forEach(function(subscription) {
					subscription.clearUnreadCount();
				});

				item.recalculateUnreadCounts();
			}
			else {
				item.clearUnreadCount();
			}
		});
	}
});