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
			{tag: "div", content: "Version 2.0.8 by Othello Ventures Ltd."},
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
				{tag: "div", content: "2.0.8", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "New icon for FirefoxOS. Thanks to FabianOvrWrt"},
				]}
			]},
			{tag: "div", components: [
				{tag: "div", content: "2.0.7", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Added localization support for Bengali (India), Dutch (Netherlands), Malayalam, and Tamil (India)"},
				]}
			]},
			{tag: "div", components: [
				{tag: "div", content: "2.0.6", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Added support for updated InoReader API"},
				]}
			]},
			{tag: "div", components: [
				{tag: "div", content: "2.0.5", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Added localization support for Bengali (Bangladesh) and French"},
				]}
			]},
			{tag: "div", components: [
				{tag: "div", content: "2.0.4", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Added localization support for Breton, German, Greek and Spanish"},
				]}
			]},
			{tag: "div", components: [
				{tag: "div", content: "2.0.3", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Added support for Instapaper on Firefox OS"},
				]}
			]},
			{tag: "div", components: [
				{tag: "div", content: "2.0.2", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Compatibility fixes for LuneOS"},
				]}
			]},
			{tag: "div", components: [
				{tag: "div", content: "2.0.1", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Added support for webOS 3.x and LuneOS"},
				]}
			]},
			{tag: "div", components: [
				{tag: "div", content: "2.0.0", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Fixed issue that would cause the app to fail to load on FirefoxOS 2.x."},
					{tag: "li", content: "Fixed issue that would cause JSON parsing to fail on FirefoxOS if ResponseJSON is not present."},
					{tag: "li", content: "Added localization engine with initial support for English."},
				]}
			]},
			{tag: "br"},
			{tag: "div", components: [
				{tag: "div", content: "1.0.1", style: "font-weight: bold" },
				{tag: "ul", components: [
					{tag: "li", content: "Fixed several rendering bugs that would cause content to display incorrectly."},
					{tag: "li", content: "Fixed handling of links so that they properly open in new browser window."},
				]}
			]},
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
			{tag: "div", components: [
				{tag: "span", content: "FirefoxOS Icon by: "},
				{tag: "a", attributes: {"href": "mailto:fabianovrwrt@gmail.com", "target": "_blank"}, content: "FabianOvrWrt" }
			]},
			{tag: "br"},			
			{tag: "div", content: "Refresh Icon made by Yannick from www.flaticon.com"},
			{tag: "br"},
			{tag: "div", components: [
				{tag: "span", content: "Localization by SimpleLang: "},
				{tag: "a", attributes: {"href": "https://github.com/minego/macaw-enyo/tree/master/lib/simplelang", "target": "_blank"}, content: "GitHub" }
			]},
			{tag: "br"},
			{tag: "div", content: "Localization Team", style: "font-size: 20px; font-weight: bold"},
			{tag: "br"},
			{tag: "div", components: [
				{tag: "span", content: "Bengali (Bangladesh): "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/hossainalikram/", "target": "_blank"}, content: "Hossain Al Ikram" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/atiqueahmedziad/", "target": "_blank"}, content: "Atique Ahmed Ziad" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/Forhad/", "target": "_blank"}, content: "Forhad Hossain" }
			]},
			{tag: "div", components: [
				{tag: "span", content: "Bengali (India): "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/hossainalikram/", "target": "_blank"}, content: "Ayan Choudhury" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/Mainak/", "target": "_blank"}, content: "Mainak Roy Chowdhury" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/dpknit/", "target": "_blank"}, content: "Forhad Hossain" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/koustavsuny/", "target": "_blank"}, content: "কৌস্তভ সমাদ্দার" }
			]},
			{tag: "div", components: [
				{tag: "span", content: "Breton: "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/Mediaoueg/", "target": "_blank"}, content: "Mediaoueg" }
			]},
			{tag: "div", components: [
				{tag: "span", content: "Dutch (Netherlands): "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/Vistaus/", "target": "_blank"}, content: "Heimen Stoffels" }
			]},
			{tag: "div", components: [
				{tag: "span", content: "French: "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/havi_moz/", "target": "_blank"}, content: "havi_moz" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/bolasoma/"}, content: "Soma Ismael BOLA" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/noreiller/"}, content: "Aurélien MANCA" }
			]},
			{tag: "div", components: [
				{tag: "span", content: "German: "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/havi_moz/", "target": "_blank"}, content: "havi_moz" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/Samplidude/", "target": "_blank"}, content: "Samplidude™" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/grrd/", "target": "_blank"}, content: "Gerard Tyedmers" },
			]},
			{tag: "div", components: [
				{tag: "span", content: "Greek: "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/jonakis/", "target": "_blank"}, content: "Jon Alexopoulos" }
			]},
			{tag: "div", components: [
				{tag: "span", content: "Malayalam: "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/riginoommen/", "target": "_blank"}, content: "Rigin Oommen" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/abinabraham/", "target": "_blank"}, content: "abinabraham" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/cskumaresan/", "target": "_blank"}, content: "Kumaresan.C.S" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/haseebp/", "target": "_blank"}, content: "haseeb" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/manazpk/", "target": "_blank"}, content: "Muhammed Anaz PK" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/ruwaizrazak/", "target": "_blank"}, content: "Ruwaiz Razak" }
			]},
			{tag: "div", components: [
				{tag: "span", content: "Spanish: "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/havi_moz/", "target": "_blank"}, content: "havi_moz" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/CarlitoFft/", "target": "_blank"}, content: "Carlos Arturo Riveros Olivares" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/auroszx/", "target": "_blank"}, content: "auroszx" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/ravmn/", "target": "_blank"}, content: "Richard von Moltke" }
			]},
			{tag: "div", components: [
				{tag: "span", content: "Tamil (India): "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/jskcse4/", "target": "_blank"}, content: "Khaleel Jageer" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/viswaprasathKS/", "target": "_blank"}, content: "viswaprasathKS" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/ksmammar/", "target": "_blank"}, content: "Mohammed Ammar" },
				{tag: "span", content: ", "},
				{tag: "a", attributes: {"href": "https://www.transifex.com/accounts/profile/Adam24/", "target": "_blank"}, content: "Mohammed Adam" }
			]},
			{tag: "br"},
		]},
		{kind: enyo.Signals, onkeyup: "handleKeyUp"}
	],

  	create: function() {
    	this.inherited(arguments);
    	this.$.viewTitle.setContent($L("Help"));
    },

	handleKeyUp: function(inSender, inEvent) {
        if (this.showing && inEvent.keyCode === 27)
        {
        	this.handleGoBack();
        	if (enyo.platform.webos || window.PalmSystem)
        	{
        		inEvent.stopPropagation();
        		inEvent.preventDefault();
       			return -1;
       		}
        }
    },
    	
	handleGoBack: function() {
		this.doGoBack({lastPage: this.previousPage});
	},
});