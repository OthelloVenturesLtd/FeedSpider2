enyo.kind({
	name: "FeedSpider2.ArticleContainer",
	kind: "FeedSpider2.Countable",
	
	published: { 
  		api: "",
  		continuation: "",
  		icon: "",
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
	
	constructor: function(api) {
		this.inherited(arguments);		
		this.api = api;
		this.continuation = false;
		this.items = [];
	},
	
	create: function() {
		this.inherited(arguments);
		
		this.$.sourceIcon.set("src", this.icon);
		this.$.sourceName.set("content", this.title);
	},
	
	rendered: function() {
	    if (this.unreadCount > 0)
    	{
    		this.$.sourceName.setStyle("font-weight: bold");
    		this.$.sourceUnreadCount.setStyle("font-weight: bold");
    		this.$.sourceUnreadCount.setContent(this.unreadCount); 		
    	} 
		else
		{
    		this.$.sourceName.setStyle("");
    		this.$.sourceUnreadCount.setStyle("");
			this.$.sourceUnreadCount.hide();
		}
		
		if (this.last == false)
    	{
    		this.$.source.addStyles("border-bottom-width: 1px; border-bottom-style: groove");
    	}
    	this.inherited(arguments);
	},
	
	reset: function() {
		this.items.clear();
		this.continuation = false;
	},

	findArticles: function(success, failure) {
		var onSuccess = function(articles, id, continuation) {
			Log.debug("continuation token is " + continuation);

			this.continuation = continuation;
			if(this.items.length && this.items[this.items.length - 1].load_more) {
				this.items.pop();
			}

			$A(articles).each(function(articleData) {
				this.items.push(new FeedSpider2.Article(articleData, this));
			}.bind(this))

			success();
		}.bind(this)
		this.makeApiCall(this.continuation, onSuccess, failure);
	},

	highlight: function(node) {
	},
	
	itemTapped: function() {
		this.doSourceTap(this)
	}
	
});