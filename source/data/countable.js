enyo.kind({
	name: "FeedSpider2.Countable",
	kind: "enyo.Control",
	
	published: { 
  		unreadCount: 0,
  		unreadCountDisplay: ""
	},
	
	bindings: [
		{from: ".unreadCount", to: "unreadCountDisplay", transform: function(v){
			if (v > 9999)
			{
				return "10000+";
			}
			else if (v <= 0)
			{
				return "";
			}
			else
			{
				return v;
			}
		}}
	],

	constructor: function() {
		this.inherited(arguments);
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