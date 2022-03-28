enyo.kind({
	name: "FeedSpider2.Divider",
	kind: enyo.Control,
	
	published: { 
  		title: ""
	},
	
	components: [
		// sometimes, you just need to use a table
		{tag: "table", classes: "divider", style: "width: 100%", components: [
			{tag: "tr", components: [
				{name: "left", tag: "td", classes: "labeled-left"},
				{name: "dividerTitle", tag: "td", classes: "label", style:"font-weight: bold; width: 1%; padding-left: 5px; padding-right: 5px"},
				{tag: "td", classes: "labeled-right"},
			]}
		]}
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.$.dividerTitle.setContent(this.title);
    }
});