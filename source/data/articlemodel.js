enyo.kind({
	name: "FeedSpider2.ArticleModel",
	kind: "enyo.Model",
	options: { parse: true },
	primaryKey: "id",
	attributes: {
		alternate: null,
		annotations: null,
		author: "",
		categories: null,
		comments: null,
		commentsNum: 0,
		crawlTimeMsec: "",
		id: "",
		likingUsers: null,
		origin: null,
		published: 0,
		summary: null,
		timestampUsec: "",
		title: "",
		updated: 0
	},

	parse: function(data) {
		// All objects and arrays need to be initialized here because initializing them in attributes
		// will cause the same object to be shared across all instances of this model.
		if (!Array.isArray(data.alternate))
		{
			data.alternate = [];
		}

		if (!Array.isArray(data.annotations))
		{
			data.annotations = [];
		}

		if (!Array.isArray(data.categories))
		{
			data.categories = [];
		}

		if (!Array.isArray(data.comments))
		{
			data.comments = [];
		}

		if (!Array.isArray(data.likingUsers))
		{
			data.likingUsers = [];
		}

		if (!data.origin)
		{
			data.origin = {};
		}

		if (!data.summary)
		{
			data.summary = {};
		}

		return data;
	}
});

enyo.kind({
	name: "FeedSpider2.ArticleCollection",
	kind: "enyo.Collection",
	options: { parse: true },
	model: "FeedSpider2.ArticleModel",
});