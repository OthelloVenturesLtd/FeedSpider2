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
		{name: "preferences", kind: "FeedSpider2.PreferencesView"},
		{name: "main", kind: "FeedSpider2.MainView", onSwitchPanels: "switchPanels"},
		{name: "article", kind: "FeedSpider2.ArticleView"},
		
	],
	
	switchPanels: function(inSender, inEvent) {
		this.setIndex(this.selectPanelByName("article"))
	}
});

enyo.kind({
	name: "FeedSpider2.PreferencesView",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.IconButton", src: "assets/go-back.png"},
			{tag: "span", content: "Preferences", style:"font-weight: bold; text-align: center", fit: true},
			{kind: "onyx.Icon"}, //This is here to keep the header centered.
		]},
		{kind: "enyo.Scroller", fit: true, style: "background-color: #e6e3de; padding: 10px", components: [
			/*{name: "title", tag: "div", style: "box-shadow: inset 0px 1px 1px rgba(255,255,255,0.5); background-color: #989898; padding: 5px; border-radius: 8px; border-color: #909090; border-width: 1px", components: [
				{tag: "div", style: "color: #ffffff; padding-left: 10px; padding-bottom: 5px; font-weight:bold; font-size: 14px", content: "TITLE"},
				{tag: "div", style: "box-shadow: 0px 0px 1px rgba(255,255,255,0.5); background-color: #e6e3de; border-radius: 8px", components:[
					{content: "Hello World", style: "border-radius: 8px 8px 0 0; border-color: #aaaaaa;border-style: solid; border-width: 0 1px 1px 1px; padding: 10px"},
					{content: "Hello World", style: "border-color: #aaaaaa;border-style: solid; border-width: 0 1px 1px 1px; padding: 10px"},
					{content: "Hello World", style: "border-radius: 0 0 8px 8px; border-color: #aaaaaa;border-style: solid; border-width: 0 1px 1px 1px; padding: 10px"},
				]}
			]}*/
			{kind: "FeedSpider2.GroupBox", style: "margin-bottom: 10px"},
			{kind: "FeedSpider2.GroupBox", style: "margin-bottom: 10px"},
			{kind: "FeedSpider2.GroupBox"}	
		]},
	],
	helloWorldTap: function(inSender, inEvent) {
		this.api = new Api()
		this.$.main.addContent(this.api.version());
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
