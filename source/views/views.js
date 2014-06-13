/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/
enyo.kind({
	name: "FeedSpider2.BasePanels",
	kind: "Panels",
	draggable: false,
	arrangerKind: "CardSlideInArranger",
	components: [		
		{name: "main", kind: "FeedSpider2.MainView", onSwitchPanels: "switchPanels"},
		{name: "article", kind: "FeedSpider2.ArticleView"},
		{name: "preferences", kind: "FeedSpider2.PreferencesView", onGoBack: "closePreferences"},
		{name: "help", kind: "FeedSpider2.HelpView", onGoBack: "closePanel"}
	],
	
	switchPanels: function(inSender, inEvent) {
		this.setIndex(this.selectPanelByName("article"))
	},
	
	openPreferences: function(inSender, inEvent) {
		this.$.preferences.setSources(this.sources)
		this.$.preferences.setPreviousPage(inEvent)
		this.setIndex(this.selectPanelByName("preferences"))
	},
	
	openHelp: function(inSender, inEvent) {
		this.$.help.setPreviousPage(inEvent)
		this.setIndex(this.selectPanelByName("help"))
	},
	
	closePreferences: function(inSender, inEvent) {
		//TODO: Handle Changes
		this.setIndex(this.selectPanelByName(inEvent.lastPage.name))
	},
	
	closePanel: function(inSender, inEvent) {
		this.setIndex(this.selectPanelByName(inEvent.name))
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
