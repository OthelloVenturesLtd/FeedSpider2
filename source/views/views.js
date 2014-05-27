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
		
		{name: "MainScroller", kind: "enyo.Scroller", fit: true, components: [
			{kind: "FeedSpider2.Source", type: "All", title: "All Items", unreadCount: 100},
			{kind: "FeedSpider2.Source", type: "Starred", title: "Starred", unreadCount: 0, last: true},
			{kind: "FeedSpider2.Divider", title: "Subscriptions"},
			{kind: "FeedSpider2.Source", type: "Folder", title: "Entertainment", unreadCount: 66},
			{kind: "FeedSpider2.Source", type: "Folder", title: "Computing", unreadCount: 27},
			{kind: "FeedSpider2.Source", type: "Feed", title: "PivotCE", unreadCount: 7, last: true}
		], style: "background-color: #e6e3de; padding-top: 5px"},
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.credentials = new Credentials()
    	this.api = new Api()
    	this.api.login(this.credentials, this.loginSuccess.bind(this), this.loginFailure.bind(this))
	},
	
	loginSuccess: function() {
    	console.log("Success!")
    	this.api.getAllSubscriptions(function(subscriptions){console.log(subscriptions)}, this.loginFailure.bind(this))
    	//this.credentials.save()
    	//this.controller.stageController.swapScene("home", this.api)
  	},

  	loginFailure: function() {
    	//this.controller.stageController.swapScene("credentials", this.credentials, true)
  	},
		
	helloWorldTap: function(inSender, inEvent) {
		this.api = new Api()
		this.$.main.addContent("Hello World<br>");
	},
	toolbarTap: function(inSender, inEvent) {
		window.open("http://www.google.com")
	},
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
