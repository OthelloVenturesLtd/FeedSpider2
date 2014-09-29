enyo.kind({
	name: "FeedSpider2.ChoiceDialog",
	kind: "onyx.Popup",
	modal: false,
	autoDismiss: false,
	floating: true,
	centered: true,
	scrim: true,
	
	style: "padding: 15px; width: 80%; max-width: 300px",
	
	events: {
		onDismiss: "",
		onAction: "",		
	},
	
	components: [
		{name: "dialogTitle", style: "font-weight: bold"},
		{tag: "hr"},
		{name: "dialogContent"},
		{components: [
			{kind: "onyx.Button", style: "margin-top: 10px; margin-right: 5%; width: 45%", classes: "onyx-affirmative", content: "Yes", ontap: "chooseYes"},
			{kind: "onyx.Button", style: "margin-top: 10px; margin-left: 5%; width: 45%", classes: "onyx-negative", content: "No", ontap: "chooseNo"}
		]}
	],
	
	show: function(title, content, data) {
		this.$.dialogTitle.setContent(title)
		this.$.dialogContent.setContent(content)
		this.returnData = data;
		
		this.inherited(arguments);
	},
	
	chooseNo: function(){
		this.doDismiss();
	},
	
	chooseYes: function(){
		this.doAction({data: this.returnData});
	},
})