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

	components: [
		{name: "source", kind: enyo.FittableColumns, noStretch: true, ontap: this.itemTap, style: "padding-top: 10px; padding-right: 10px;", components: [
			{name: "sourceIcon", kind: "onyx.Icon", style: "margin-left: 10px; margin-top: 2px"},
			{name: "sourceName", tag: "span", fit: true},
			{name: "sourceUnreadCount", tag: "span"}
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
		
		this.$.sourceIcon.setSrc(this.icon);
		this.$.sourceName.setContent(this.title);
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
				this.items.push(new Article(articleData, this));
			}.bind(this))

			if(this.continuation) {
				this.items.push(new LoadMore());
			}

			success();
		}.bind(this)

		this.makeApiCall(this.continuation, onSuccess, failure);
	},

	highlight: function(node) {
	}
});

/*var ArticleContainer = Class.create(Countable, {
  initialize: function($super, api) {
    $super()
    this.api = api
    this.continuation = false
    this.items = []
  },

  reset: function() {
    this.items.clear()
    this.continuation = false
  },

  findArticles: function(success, failure) {
    var onSuccess = function(articles, id, continuation) {
      Log.debug("continuation token is " + continuation)

      this.continuation = continuation

      if(this.items.length && this.items[this.items.length - 1].load_more) {
        this.items.pop()
      }

      $A(articles).each(function(articleData) {
        this.items.push(new Article(articleData, this))
      }.bind(this))

      if(this.continuation) {
        this.items.push(new LoadMore())
      }

      success()
    }.bind(this)

    this.makeApiCall(this.continuation, onSuccess, failure)
  },

  highlight: function(node) {
  }
})*/
