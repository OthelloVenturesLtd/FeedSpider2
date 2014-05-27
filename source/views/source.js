enyo.kind({
	name: "FeedSpider2.Source",
	kind: enyo.FittableColumns,
	noStretch: true,
	
	published: { 
  		type: "",
  		title: "",
  		unreadCount: 0,
  		last: false
	},
	
	ontap: "toolbarTap",
	style: "padding-top: 10px; padding-right: 10px;",
	components: [
		{name: "sourceIcon", kind: "onyx.Icon", style: "margin-left: 10px; margin-top: 2px"},
		{name: "sourceName", tag: "span", fit: true},
		{name: "sourceUnreadCount", tag: "span"}
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.$.sourceName.setContent(this.title);
    	if (this.unreadCount > 0)
    	{
    		this.$.sourceName.setStyle("font-weight: bold");
    		this.$.sourceUnreadCount.setStyle("font-weight: bold");
    		this.$.sourceUnreadCount.setContent(this.unreadCount); 		
    	} 
		else
		{
			this.$.sourceUnreadCount.hide();
		}
    	switch (this.type) {
    		case "All":
    			this.$.sourceIcon.setSrc("assets/list.png");
    			break;
    		case "Starred":
    			this.$.sourceIcon.setSrc("assets/starred-grey.png");
    			break;
    	    case "Shared":
    			this.$.sourceIcon.setSrc("assets/shared-grey.png");
    			break;
    		case "Fresh":
    			this.$.sourceIcon.setSrc("assets/fresh.png");
    			break;
    		case "Archived":
    			this.$.sourceIcon.setSrc("assets/archived.png");
    			break;
    		case "Folder":
    			this.$.sourceIcon.setSrc("assets/folder-grey.png");
    			break;
    	    case "Feed":
    			this.$.sourceIcon.setSrc("assets/rss-grey.png");
    			break;
    		default:
    			this.$.sourceIcon.setSrc("assets/error.png");
    	}
    	if (this.last == false)
    	{
    		this.addStyles("border-bottom-width: 1px; border-bottom-style: groove");
    	}
    },
    
    toolbarTap: function(inSender, inEvent) {
		window.open("http://www.google.com")
	},
});