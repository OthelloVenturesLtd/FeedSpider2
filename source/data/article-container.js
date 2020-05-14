enyo.kind({
	name: "FeedSpider2.ArticleContainer",
	kind: "FeedSpider2.Countable",
	
	published: { 
  		api: null,
  		continuation: false,
  		icon: "",
  		id: "",
  		items: [],
  		itemTap: "",
  		last: false,
  		title: ""
	},
	
	events: {
		onSourceTap: "",
	},

	components: [
		{name: "source", kind: enyo.FittableColumns, noStretch: true, ontap: "itemTapped", components: [
			{name: "sourceIcon", style: "height: 50px; width: 30px;"},
			{name: "sourceName", classes: "subscription-title", tag: "span", fit: true},
			{name: "sourceUnreadCount", classes: "subscription-count", tag: "span"}
		]}
	],

	bindings: [
		{from: ".icon", to: ".$.sourceIcon.src"},
		{from: ".title", to: ".$.sourceName.content"}
	],
	
	rendered: function() {
	    if (this.get("unreadCount") > 0)
    	{
    		this.$.sourceName.set("style", "font-weight: bold");
    		this.$.sourceUnreadCount.set("style", "font-weight: bold");
    		this.$.sourceUnreadCount.set("content", this.get("unreadCount"));
    	} 
		else
		{
    		this.$.sourceName.set("style", "");
    		this.$.sourceUnreadCount.set("style", "");
			this.$.sourceUnreadCount.hide();
		}
		
		if (this.last === false)
    	{
    		this.$.source.addStyles("border-bottom-width: 1px; border-bottom-style: groove");
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