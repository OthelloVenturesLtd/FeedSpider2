enyo.kind({
	name: "FeedSpider2.FeedView",
	kind: "FeedSpider2.BaseView",
	fit: true,
	
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.MenuDecorator", ontap: "openHelp", components: [
				{kind: "onyx.IconButton", src: "assets/menu-icon.png"},
			    {kind: "onyx.Menu", components: [
        			//{kind: "onyx.MenuItem", content: "Add Subscription"},
        			//{name: "showHideFeedsMenuItem", kind: "onyx.MenuItem", ontap: "toggleFeeds"},
        			//{classes: "onyx-menu-divider"},
        			//{name: "preferencesMenuItem", kind: "onyx.MenuItem", ontap: "openPreferences", content: "Preferences"},
        			//{content: "Help"},
        			//{classes: "onyx-menu-divider"},
        			{content: "Logout"},
    			]}
			]},
			{tag: "span", content: "FeedSpider 2", style:"font-weight: bold; text-align: center", fit: true},
			{name: "errorIcon", kind: "onyx.Icon", src: "assets/error.png", style: "display: none"},
			{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "display: none"},
			{name: "refreshButton", kind: "onyx.IconButton", ontap: "switchPanels", src: "assets/refresh.png"}
		]},
		
		{name: "MainList", kind: "enyo.Scroller", fit: true, style: "background-color: #e6e3de; padding-top: 5px"},
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.credentials = new Credentials();
    	this.loaded = false;
    	this.reloading = false;
	},
	
	rendered: function() {
		this.inherited(arguments);
		if (Preferences.hideReadFeeds()){
			//this.$.showHideFeedsMenuItem.setContent("Show Read Feeds")
		}
		else
		{
			//this.$.showHideFeedsMenuItem.setContent("Hide Read Feeds")
		}
	},
});