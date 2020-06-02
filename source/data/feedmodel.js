/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.FeedModel",
	kind: "enyo.Model",
	options: { parse: true },
	primaryKey: "id",
	attributes: {
		api: null,
		canMarkAllRead: false,
		continuation: false,
		iconClass: "",
		id: "",
		items: null,
		showOrigin: false,
		title: "",
		unreadCount: 0
	},

	parse: function(data) {
		// All objects and arrays need to be initialized here because initializing them in attributes
		// will cause the same object to be shared across all instances of this model.
		if (!Array.isArray(data.items))
		{
			data.items = [];
		}

		return data;
	},

	findArticles: function(success, failure) {
		var onSuccess = function(articles, id, continuation) {
			Log.debug("continuation token is " + continuation);

			this.set("continuation", continuation);
			if(this.get("items").length && this.get("items")[this.get("items").length - 1].load_more) {
				this.get("items").pop();
			}

			if (articles && articles.length > 0)
			{
				articles.forEach(function(articleData) {
					this.get("items").push(new FeedSpider2.Article({api: this.get("api"), data: articleData, subscription: this}));
				}.bind(this));
			}

			success();
		}.bind(this);
		this.makeApiCall(this.get("continuation"), onSuccess, failure);
	},

	clearUnreadCount: function() {
		this.setUnreadCount(0);
	},

	setUnreadCount: function(count) {
		this.set("unreadCount", count);

		if(this.get("unreadCount") < 0) {
			this.set("unreadCount", 0);
		}
	},

	incrementUnreadCountBy: function(count) {
		this.setUnreadCount((this.getUnreadCount() || 0) + count);
	},

	decrementUnreadCountBy: function(count) {
		this.incrementUnreadCountBy(-count);
	},

	getUnreadCount: function() {
		return this.get("unreadCount");
	}
});

enyo.kind({
	name: "FeedSpider2.FeedCollection",
	kind: "enyo.Collection",
	options: { parse: true },
	model: "FeedSpider2.FeedModel",
});