enyo.kind({
	name: "FeedSpider2.AllSubscriptions",
	kind: "FeedSpider2.SubscriptionContainer",

	published: {
		sorted: false
	},

	findAll: function(success, failure) {
		var self = this;

		self.get("api").getAllSubscriptions(
			function(subscriptions) {
				self.set("sorted", false);
				self.clearUnreadCount();
				self.set("items", []);
				var folders = new FeedSpider2.Folders({api: self.api});
				subscriptions.forEach(function(subscriptionData) {
					var subscription = new FeedSpider2.Subscription({api: self.get("api"), data: subscriptionData});
					self.addLoadedSubscription(subscription, folders);
				});
				
				folders.addSortIds(
					function() {
						self.get("items").push.apply(self.get("items"), folders.get("items"));
						self.addUnreadCounts(success, failure);
					}, failure);
			}, failure);
	},

	addLoadedSubscription: function(subscription, folders) {
		if(subscription.belongsToFolder()) {
			subscription.get("categories").forEach(function(category) {
				if(category.label) {
					folders.addSubscription(category.id, category.label, subscription);
				}
			});
		}
		else {
			this.get("items").push(subscription);
		}
	},

	addUnreadCounts: function(success, failure) {
		var self = this;

		self.get("api").getUnreadCounts(
			function(counts) {
				counts.forEach(function(count) {
					if(count.id.toString().indexOf("feed") === 0 || count.id > 0){       	
						self.incrementUnreadCountBy(count.count);

						self.get("items").forEach(function(item) {
							if(item.get("id") == count.id) {
								item.setUnreadCount(count.count);
							}

							if(item.get("isFolder")) {
								item.addUnreadCount(count);
							}
						});
					}
				});

				success();
			}, 
		failure);
	},

	sort: function(success, failure) {
		if(FeedSpider2.Preferences.isManualFeedSort()) {
			if (this.get("api").supportsManualSort())
			{
				this.sortManually(success, failure);
			}
			else
			{
				Feeder.notify($L("Manual Sort Not Available"));
				FeedSpider2.Preferences.setManualFeedSort(false);
				this.sortAlphabetically(success, failure);
			}
		}
		else 
		{
			this.sortAlphabetically(success, failure);
		}
	},

	sortAlphabetically: function(success) {
		var self = this;

		if(self.get("sorted") == "alphabetic") 
		{
			success();
		}
		else 
		{
			self.get("items").forEach(function(item) {
				if(item.isFolder) item.sortAlphabetically();
			});

			self.sortBy(function(itemA, itemB) {
				if (itemA.get("isFolder") && !itemB.get("isFolder"))
				{
					return -1;
				}
				else if (!itemA.get("isFolder") && itemB.get("isFolder"))
				{
					return 1;
				}
				else
				{
					if (itemB.get("title").toUpperCase() < itemA.get("title").toUpperCase())
					{
						return 1;
					}
					else if (itemA.get("title").toUpperCase() < itemB.get("title").toUpperCase())
					{
						return -1;
					}
					else
					{
						return 0;
					}
				}
			});

			self.sorted = "alphabetic";
			success();
		}
	},

	sortManually: function(success, failure) {
		var self = this;

		if(self.sorted == "manual") 
		{
			success();
		}
		else 
		{
			self.get("api").getSortOrder(
				function(sortOrders) {
					var rootSortOrder = sortOrders["user/-/state/com.google/root"] || new FeedSpider2.SortOrder("");

					self.get("items").forEach(function(item) {
						item.set("sortNumber", rootSortOrder.getSortNumberFor(item.get("sortId")));
						if(item.get("isFolder")) item.sortManually(sortOrders[item.get("id").replace(/user\/\d+\//g, "user/-/")]);
					});

					self.sortBy(function(itemA, itemB) {
						return itemA.get("sortNumber") - itemB.get("sortNumber");
					});

					self.set("sorted", "manual");
					success();
				}, failure);
		}
	},

	sortBy: function(f) {
		var sortedItems = this.get("items").sort(f);
		this.set("items", []);
		this.get("items").push.apply(this.get("items"), sortedItems);
	},

	articleRead: function(subscriptionId) {
		this.get("items").forEach(function(subscription) {subscription.articleRead(subscriptionId);});
	},

	articleNotRead: function(subscriptionId) {
		this.get("items").forEach(function(subscription) {subscription.articleNotRead(subscriptionId);});
	},

	recalculateFolderCounts: function() {
		this.get("items").forEach(function(subscription) {
			if(subscription.get("isFolder")) subscription.recalculateUnreadCounts();
		});
	}
});