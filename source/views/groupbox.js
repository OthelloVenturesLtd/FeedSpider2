enyo.kind({
	name: "FeedSpider2.GroupBox",
	kind: "enyo.Control",
	components: [
		{tag: "div", classes: "feedspider-groupbox", components: [
			{name: "title", tag: "div", classes: "feedspider-groupbox-header", content: "TITLE"},
			{tag: "div", classes: "feedspider-groupbox-body", components:[
				{content: "Hello World"},
				{content: "Hello World"},
				{content: "Hello World"},
			]}
		]}
	],
});