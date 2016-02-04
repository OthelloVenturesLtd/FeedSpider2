enyo.kind({
	name: "FeedSpider2.ConfigureSharingDialog",
	kind: "onyx.Popup",
	modal: false,
	autoDismiss: false,
	floating: true,
	centered: true,
	scrim: true,
	
	style: "padding: 20px; height: 60%; width: 80%;  max-width: 300px; text-align: center;",
	
	published: {
		sources: {}
	},
	
	events: {
		onDismiss: "",	
	},
	
	components: [
		{layoutKind: "FittableRowsLayout", components: [
			{name: "SharingList", kind: "List", classes: "feeds-list", count: 0, multiSelect: false, noSelect: true, onSetupItem: "setupItem", components: [
				{name: "item", kind: "enyo.FittableColumns", noStretch: true, style: "padding: 5px 8px; border-color: #aaaaaa; border-style: solid; border-width: 0 0 1px 0", components: [
                	{name: "sharingSourceCheckbox", kind: "onyx.Checkbox", onchange: "addRemoveSource"},
                	{name: "sharingSourceTitle", style: "padding-left: 10px; padding-top: 6px;", fit:true, allowHtml: true}
            	]} 
			]},
			{name: "SharingListButton", kind: "onyx.Button", classes: "onyx-affirmative", style: "width:50%; margin-top: 5px;", ontap: "closeDialog"},
		]}
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.$.SharingListButton.setContent($L("Done"));
	},
	
	closeDialog: function(){
		this.sources.each(function(item) {
      		FeedSpider2.Preferences.setSharingOptionEnabled(item.id, item.enabled);
    	});
		
		this.doDismiss();
	},
	
	show: function(sharingOptions){
    	this.sources = sharingOptions;
    	
    	this.sources.each(function(item) {
      		item.enabled = FeedSpider2.Preferences.isSharingOptionEnabled(item.id, item.defaultEnabled);
    	});
    	
    	//Calculate list height
		var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);   	
    	var dialogHeightPC = this.domStyles.height.replace('%', '') / 100;
    	var dialogPadding = this.domStyles.padding.replace('px', '');
		
		var listHeight = Math.round(windowHeight * dialogHeightPC) - (dialogPadding * 2);
		
    	this.$.SharingList.setStyle("width: 100%; height: " + listHeight + "px");

		this.$.SharingList.setCount(this.sources.length);
		this.inherited(arguments);
	},

	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.sources[i];
		
		this.$.sharingSourceCheckbox.setChecked(item.enabled);
		
		if (item.command)
    	{
    		this.$.sharingSourceTitle.removeClass("bold");
    		this.$.sharingSourceTitle.setContent("&nbsp;&nbsp;&nbsp;&nbsp;" + item.label);
    	}
    	else
    	{
    		this.$.sharingSourceTitle.addClass("bold");
    		this.$.sharingSourceTitle.setContent(item.label);
    	}
    	
		return true;
	},
	
	addRemoveSource: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.sources[i];
		
		item.enabled = !item.enabled;
		
		this.$.SharingList.reset();
	}
});