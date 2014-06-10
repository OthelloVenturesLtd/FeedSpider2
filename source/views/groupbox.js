enyo.kind({
	name: "FeedSpider2.GroupBox",
	kind: "enyo.Control",
	components: [
		{name: "title", tag: "div", style: "box-shadow: inset 0px 1px 1px rgba(255,255,255,0.5); background-color: #989898; padding: 5px; border-radius: 8px; border-color: #909090; border-width: 1px", components: [
			{tag: "div", style: "color: #ffffff; padding-left: 10px; padding-bottom: 5px; font-weight:bold; font-size: 14px", content: "TITLE"},
			{tag: "div", style: "box-shadow: 0px 0px 1px rgba(255,255,255,0.5); background-color: #e6e3de; border-radius: 8px", components:[
				{content: "Hello World", style: "border-radius: 8px 8px 0 0; border-color: #aaaaaa;border-style: solid; border-width: 0 1px 1px 1px; padding: 10px"},
				{content: "Hello World", style: "border-color: #aaaaaa;border-style: solid; border-width: 0 1px 1px 1px; padding: 10px"},
				{content: "Hello World", style: "border-radius: 0 0 8px 8px; border-color: #aaaaaa;border-style: solid; border-width: 0 1px 1px 1px; padding: 10px"},
			]}
		]}
	],
});