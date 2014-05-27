enyo.kind({
	name: "FeedSpider2.Divider",
	kind: enyo.Control,
	
	published: { 
  		title: ""
	},
	
	components: [
		// ugly, but it works.
		{allowHtml: true, content: "<table style='width: 100%'><tr><td style='background: url(assets/divider-line.png) no-repeat 100% 60%;width:1%'></td>"},
		{name: "dividerTitle", tag: "td", style:"color: #999; text-transform: none; font-weight: bold; width: 1%; padding-left: 5px; padding-right: 5px"},
		{allowHtml: true, content: "<td style='background: url(assets/divider-line.png) no-repeat 0% 60%;'></td></tr></table>"}
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.$.dividerTitle.setContent(this.title);
    }
});