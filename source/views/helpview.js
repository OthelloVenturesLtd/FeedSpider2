enyo.kind({
	name: "FeedSpider2.HelpView",
	kind: "FeedSpider2.BaseView",
	fit: true,
	
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.IconButton", src: "assets/go-back.png", ontap: "handleGoBack"},
			{name: "viewTitle", tag: "span", style:"font-weight: bold; text-align: center", fit: true},
			{kind: "onyx.Icon"}, //This is here to keep the header centered.
		]},
		{kind: "enyo.Scroller", fit: true, style: "padding: 10px", components: [
			{tag: "div", content: "FeedSpider 2", style: "font-size: 24px; font-weight: bold"},
			{tag: "div", content: "Version 1.0.1 by Othello Ventures Ltd."},
			{tag: "br"},
			{tag: "div", components: [
				{tag: "div", content: "FeedSpider 2 is a cross-platform port of the original FeedSpider RSS Reader for webOS, designed to work with Google Reader compatible applications."},
				{tag: "br"},
				{tag: "div", content: "It currently supports:"},
				{tag: "ul", components: [
					{tag: "li", components: [ {tag: "a", attributes: {"href": "https://reader.aol.com", "target": "_blank"}, content: "AOL Reader" }]},
					{tag: "li", components: [ {tag: "a", attributes: {"href": "https://bazqux.com", "target": "_blank"}, content: "BazQux Reader" }]},
					{tag: "li", components: [ {tag: "a", attributes: {"href": "http://feedly.com", "target": "_blank"}, content: "Feedly" }]},
					{tag: "li", components: [ {tag: "a", attributes: {"href": "https://www.inoreader.com", "target": "_blank"}, content: "InoReader" }]},
					{tag: "li", components: [ {tag: "a", attributes: {"href": "https://www.owncloud.org", "target": "_blank"}, content: "OwnCloud News" }]},
					{tag: "li", components: [ {tag: "a", attributes: {"href": "http://tt-rss.org", "target": "_blank"}, content: "Tiny Tiny RSS" }]},
					{tag: "li", components: [ {tag: "a", attributes: {"href": "http://www.theoldreader.com", "target": "_blank"}, content: "The Old Reader" }]},
				]}
			]},
			{tag: "br"},
			{tag: "div", components: [
				{tag: "div", content: "Reach us through:"},
				{tag: "ul", components: [
					{tag: "li", components: [ {tag: "a", attributes: {"href": "http://twitter.com/feedspiderapp", "target": "_blank"}, content: "twitter" }]},
					{tag: "li", components: [ {tag: "a", attributes: {"href": "mailto:feedspider@feedspider.net", "target": "_blank"}, content: "email" }]},
					{tag: "li", components: [ {tag: "a", attributes: {"href": "http://www.feedspider.net", "target": "_blank"}, content: "web" }]},
				]}
			]},
			{tag: "br"},
			{tag: "div", content: "History", style: "font-size: 20px; font-weight: bold"},
			{tag: "div", components: [
				{tag: "div", content: "1.0.1", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Fixed several rendering bugs that would cause content to display incorrectly."},
					{tag: "li", content: "Fixed handling of links so that they properly open in new browser window."},
				]}
			]},
			{tag: "br"},
			{tag: "br"},
			{tag: "div", components: [
				{tag: "div", content: "1.0.0", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Initial Release"},
				]}
			]},
			{tag: "br"},
			{tag: "div", content: "Special Thanks", style: "font-size: 20px; font-weight: bold"},
			{tag: "br"},			
			{tag: "div", content: "Refresh Icon made by Yannick from www.flaticon.com"},
			{tag: "br"},
		]}
	],

  	create: function() {
    	this.inherited(arguments);
    	this.$.viewTitle.setContent($L("Help"));
    },
    	
	handleGoBack: function() {
		this.doGoBack({lastPage: this.previousPage})
	},
})