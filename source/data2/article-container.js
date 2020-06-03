/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.ArticleContainer",
	kind: "FeedSpider2.Countable",
	layoutKind: "enyo.FittableColumnsLayout",
	noStretch: true,

	published: {
		model: "",
		itemTap: "",
		last: false
	},
	
	events: {
		onSourceTap: "",
	},

	handlers: {
		ontap: "itemTapped"
	},

	components: [
		{name: "sourceIcon", style: "height: 50px; width: 30px;"},
		{name: "sourceName", classes: "subscription-title", tag: "span", fit: true},
		{name: "sourceUnreadCount", classes: "subscription-count", tag: "span"}
	],

	bindings: [
		{from: ".model.iconClass", to: ".$.sourceIcon.classes"},
		{from: ".model.title", to: ".$.sourceName.content"},
		{from: ".model.unreadCount", to: ".$.sourceUnreadCount.content"},
		{from: ".model.unreadCount", to: ".$.sourceUnreadCount.showing"},
		{from: ".model.unreadCount", to: ".$.sourceName.style", transform: function(v){return v ? "font-weight: bold" : "";}},
		{from: ".model.unreadCount", to: ".$.sourceUnreadCount.style", transform: function(v){return v ? "font-weight: bold" : "";}},
	],
	
	rendered: function() {
		if (this.last === false)
		{
			this.addStyles("border-bottom-width: 1px; border-bottom-style: groove");
		}

		this.inherited(arguments);
	},
	
	reset: function() {
		// this.set("items", []);
		// this.set("continuation", false);
	},
	
	itemTapped: function() {
		this.doSourceTap(this);
	}
});