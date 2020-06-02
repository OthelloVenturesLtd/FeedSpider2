enyo.kind({
	name: "FeedSpider2.AllSourcesModel",
	kind: "enyo.Model",
	options: { parse: true },

	attributes: {
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

	parse: function(data) {
		data.stickySources = {items: []};
		data.subscriptionSources = {items: []};

		if (data.api.supportsAllArticles())
		{
			data.all = new FeedSpider2.AllArticlesModel({api: data.api});
			data.stickySources.items.push(new FeedSpider2.ArticleContainer({model: data.all}));
		}
		
		// if (data.api.supportsFresh())
		// {
		// 	data.fresh = new FeedSpider2.Fresh({api: data.api});
		// 	data.stickySources.items.push(data.fresh);
		// }
	
		// if (data.api.supportsStarred())
		// {
		// 	data.starred = new FeedSpider2.Starred({api: data.api});
		// 	data.stickySources.items.push(data.starred);
		// }
	
		// if (data.api.supportsShared())
		// {
		// 	data.shared = new FeedSpider2.Shared({api: data.api});
		// 	data.stickySources.items.push(data.shared);
		// }
		
		// if (data.api.supportsArchived())
		// {
		// 	data.archived = new FeedSpider2.Archived({api: data.api});
		// 	data.stickySources.items.push(data.archived);
		// }
		
		data.subscriptions = new FeedSpider2.AllSubscriptions({api: data.api});
		return data;
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