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
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{kind: "onyx.Button", ontap: "helloWorldTap", style: "height:48px", components: [
				{kind: "onyx.Icon", src: "assets/menu-icon.png"}
			]},
			{tag: "span", content: "FeedSpider 2", style:"font-weight: bold; text-align: center", fit:true},
			{kind: "onyx.Button", ontap: "helloWorldTap", style: "height:48px", components: [
				{kind: "onyx.Icon", src: "assets/refresh.png"}
			]},
		]},
		
		//{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
		//	{kind: "onyx.IconButton", ontap: "helloWorldTap", src: "assets/menu-icon.png"},
		//	{tag: "span", content: "FeedSpider 2", style:"font-weight: bold"},
		//	{kind: "onyx.IconButton", ontap: "helloWorldTap", src: "assets/refresh.png"}
		//]},
		
		{kind: "enyo.Scroller", fit: true, components: [
			{kind: "FeedSpider2.Divider"},
			{name: "main", classes: "nice-padding", allowHtml: true}
		], style: "background-color: #e6e3de"},
	],
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
