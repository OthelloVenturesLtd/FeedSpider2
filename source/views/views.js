/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

enyo.kind({
	name: "FeedSpider2.MainView",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.MenuDecorator", components: [
				{kind: "onyx.IconButton", src: "assets/menu-icon.png"},
			    {kind: "onyx.Menu", components: [
        			{kind: "onyx.MenuItem", content: "Add Subscription"},
        			{content: "Help"},
        			{classes: "onyx-menu-divider"},
        			{content: "Logout"},
    			]}
			]},
			{tag: "span", content: "FeedSpider 2", style:"font-weight: bold; text-align: center", fit: true},
			{kind: "onyx.IconButton", ontap: "helloWorldTap", src: "assets/refresh.png"}
		]},
		
		{name: "MainList", kind: "enyo.Scroller", fit: true, components: [
			{kind: "FeedSpider2.AllArticles", unreadCount: 100},
			{kind: "FeedSpider2.Divider", title: "Subscriptions"},
		], style: "background-color: #e6e3de; padding-top: 5px"},
		{name: "LoginDialog", kind: "FeedSpider2.LoginDialog", onLoginSuccess: "loginSuccess"}
	],
	
  	create: function() {
    	this.inherited(arguments);
	},
	
	rendered: function() {
		this.inherited(arguments);
		//this.$.LoginDialog.show();
	},
	
	loginSuccess: function(inSender, inEvent) {
    	this.$.LoginDialog.hide();
    	this.api = inEvent;
    	this.sources = new AllSources(this.api);
    	this.loaded = true;
    	this.showAddSubscription = true;
    	
    	return true;
  	}
});

enyo.kind({
	name: "FeedSpider2.ArticleView",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", components: [
			{tag: "p", content: "Title"},
			{tag: "p", content: "Feed"},
			{tag: "p", content: "Author"}
		], ontap: "toolbarTap"},
		{kind: "enyo.Scroller", fit: true, components: [
			{name: "main", classes: "nice-padding", allowHtml: true}
		]},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.IconButton", ontap: "helloWorldTap", src: "assets/previous-article.png", style: "padding-right: 50px"},
			{kind: "onyx.IconButton", ontap: "helloWorldTap", src: "assets/go-back-footer.png", style: "padding-right: 50px"},
			{kind: "onyx.IconButton", ontap: "helloWorldTap", src: "assets/read-footer-on.png", style: "padding-right: 50px"},
			{kind: "onyx.IconButton", ontap: "helloWorldTap", src: "assets/starred-footer.png", style: "padding-right: 50px"},
			{kind: "onyx.IconButton", ontap: "helloWorldTap", src: "assets/sendto-footer.png", style: "padding-right: 50px"},
			{kind: "onyx.IconButton", ontap: "helloWorldTap", src: "assets/next-article.png"},
		]}
	],
	helloWorldTap: function(inSender, inEvent) {
		this.api = new Api()
		this.$.main.addContent(this.api.version());
	},
	toolbarTap: function(inSender, inEvent) {
		window.open("http://www.google.com")
	},
});
