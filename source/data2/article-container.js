/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.ArticleContainer",
	kind: "FeedSpider2.Countable",
	layoutKind: "enyo.FittableColumnsLayout",
	noStretch: true,
	spotlight: true,

	published: { 
		api: null,
		continuation: false,
		icon: "",
		id: "",
		items: null,
		itemTap: "",
		last: false,
		title: ""
	},
	
	events: {
		onSourceTap: "",
	},

	handlers: {
		ontap: "itemTapped"
	},
	// {name: "source", style: "width: 100%; border-bottom-width: 1px; border-bottom-style: groove", spotlight: true, ontap: "listSourceTapped" , layoutKind: "enyo.FittableColumnsLayout", components: [
	// 	{name: "sourceIcon", style: "height: 50px; width: 30px;"},
	// 	{name: "sourceName", classes: "subscription-title", tag: "span", fit: true},
	// 	{name: "sourceUnreadCount", classes: "subscription-count", tag: "span"}
	// ]}
	components: [
		{name: "sourceIcon", style: "height: 50px; width: 30px;"},
		{name: "sourceName", classes: "subscription-title", tag: "span", fit: true},
		{name: "sourceUnreadCount", classes: "subscription-count", tag: "span"}
	],

	bindings: [
		{from: ".icon", to: ".$.sourceIcon.src"},
		{from: ".title", to: ".$.sourceName.content"},
		{from: ".unreadCount", to: ".$.sourceUnreadCount.content"},
		{from: ".unreadCount", to: ".$.sourceUnreadCount.showing"},
		{from: ".unreadCount", to: ".$.sourceName.style", transform: function(v){return v ? "font-weight: bold" : "";}},
		{from: ".unreadCount", to: ".$.sourceUnreadCount.style", transform: function(v){return v ? "font-weight: bold" : "";}},
	],
	
	rendered: function() {
		if (this.last === false)
		{
			this.addStyles("border-bottom-width: 1px; border-bottom-style: groove");
		}
		this.inherited(arguments);
	},
	
	reset: function() {
		this.set("items", []);
		this.set("continuation", false);
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
					console.log(new FeedSpider2.ArticleModel(articleData));
					this.get("items").push(new FeedSpider2.Article({api: this.get("api"), data: articleData, subscription: this}));
				}.bind(this));
			}

			success();
		}.bind(this);
		this.makeApiCall(this.get("continuation"), onSuccess, failure);
	},

	highlight: function(node) {
	},
	
	itemTapped: function() {
		this.doSourceTap(this);
	}
	
});