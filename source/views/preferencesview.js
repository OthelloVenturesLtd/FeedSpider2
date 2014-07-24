enyo.kind({
	name: "FeedSpider2.PreferencesView",
	kind: "FeedSpider2.BaseView",
	fit: true,
	
	published: {
		sources: "",
		subscriptions: ""
	},

	events: {
		onSetTheme: "",
	},
	
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.IconButton", src: "assets/go-back.png", ontap: "handleGoBack"},
			{tag: "span", content: "Preferences", style:"font-weight: bold; text-align: center", fit: true},
			{kind: "onyx.Icon"}, //This is here to keep the header centered.
		]},
		{kind: "enyo.Scroller", fit: true, style: "padding: 10px", components: [
			{tag: "div", classes: "feedspider-groupbox", components: [
				{tag: "div", classes: "feedspider-groupbox-header", content: "General"},
				{name: "generalGroupbox", tag: "div", classes: "feedspider-groupbox-body", style: "width: 100%", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Allow landscape"},
						{name: "allowLandscape", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setAllowLandscape"}
					]},
					//Nothing that we support right now supports a Palm-style gesture area
					/*{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Landscape gesture scrolling"},
						{name: "gestureScrolling", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setGestureScrolling"}
					]},*/
					{kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "themePickerHeader", tag: "span", fit: true, classes: "feedspider-picker-header", style: "text-align: left; width: 100%"},
								{kind: "onyx.Icon", src: "assets/downarrow.png"},
							]},
							{name: "themePicker", kind: "onyx.Picker", onChange: "setTheme",components: [
		  						{content: "Grey Theme", value: "grey"},
		  						{content: "Light Theme", value: "light"},
		  						{content: "Dark Theme", value: "dark"}
    						]}
						]},
					]}
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{tag: "div", classes: "feedspider-groupbox-header", content: "Feeds"},
				{tag: "div", classes: "feedspider-groupbox-body", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Hide read feeds"},
						{name: "hideReadFeeds", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setHideReadFeeds"}
					]},
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Go back after mark all read"},
						{name: "backAfterMarkRead", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setBackAfterMarkRead"}
					]},
					{kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "feedSortOrderPickerHeader", tag: "span", fit: true, classes: "feedspider-picker-header", style: "text-align: left; width: 100%;"},
								{kind: "onyx.Icon", src: "assets/downarrow.png"},
							]},
							{name: "feedSortOrderPicker", kind: "onyx.Picker", onChange: "setFeedSortOrder",components: [
		  						{content: "Sort alphabetically", value: "alphabetical"},
		  						{content: "Sort manually", value: "manual"}
    						]}
						]},
					]}
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{tag: "div", classes: "feedspider-groupbox-header", content: "Articles"},
				{tag: "div", classes: "feedspider-groupbox-body", components:[
					{kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "sortOrderPickerHeader", tag: "span", classes: "feedspider-picker-header", fit: true, style: "text-align: left; width: 100%;"},
								{kind: "onyx.Icon", src: "assets/downarrow.png"},
							]},
							{name: "sortOrderPicker", kind: "onyx.Picker", onChange: "setSortOrder",components: [
		  						{content: "Sort newest first", value: "newest"},
		  						{content: "Sort oldest first", value: "oldest"}
    						]}
						]},
					]},
					{kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "fontSizePickerHeader", tag: "span", classes: "feedspider-picker-header", fit: true, style: "text-align: left; width: 100%;"},
								{kind: "onyx.Icon", src: "assets/downarrow.png"},
							]},
							{name: "fontSizePicker", kind: "onyx.Picker", onChange: "setFontSize",components: [
		  						{content: "Tiny Font", value: "tiny"},
		  						{content: "Small Font", value: "small"},
		  						{content: "Medium Font", value: "medium"},
		  						{content: "Large Font", value: "large"}
    						]}
						]},
					]},
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Hide Read Articles"},
						{name: "hideReadArticles", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setHideReadArticles"}
					]},
					//This is not currently supported by the enyo list kind
					/*{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Mark read as you scroll"},
						{name: "markReadScroll", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setMarkReadScroll"}
					]}*/
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{tag: "div", classes: "feedspider-groupbox-header", content: "Folders"},
				{tag: "div", classes: "feedspider-groupbox-body-single", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Combine Articles"},
						{name: "combineFolders", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setCombineFolders"}
					]},
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{tag: "div", classes: "feedspider-groupbox-header", content: "Sharing"},
				{tag: "div", classes: "feedspider-groupbox-body-single", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Shorten URLs"},
						{name: "shortenURLs", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setShortenURLs"}
					]},
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{tag: "div", classes: "feedspider-groupbox-header", content: "Notifications"},
				{name: "notificationsBody", tag: "div", components:[
					{kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "notificationIntervalPickerHeader", tag: "span", fit: true, classes: "feedspider-picker-header", style: "text-align: left; width: 100%;"},
								{kind: "onyx.Icon", src: "assets/downarrow.png"},
							]},
							{name: "notificationIntervalPicker", kind: "onyx.Picker", onChange: "setNotificationInterval",components: [
								{content: "Off", value: 0},
								//{content: "10 Seconds", value: 10},
								//{content: "30 Seconds", value: 30},
								{content: "5 Minutes", value: 300},
								{content: "15 Minutes", value: 900},
								{content: "30 Minutes", value: 1800},
								{content: "1 Hour", value: 3600},
								{content: "4 Hours", value: 14400},
								{content: "8 Hours", value: 18800}
    						]}
						]},
					]},
					{name: "notificationFeedsRow", kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "notificationFeedsPickerHeader", tag: "span", fit: true, classes: "feedspider-picker-header", style: "text-align: left; width: 100%;"},
								{kind: "onyx.Icon", src: "assets/downarrow.png"},
							]},
							{name: "notificationFeedsPicker", kind: "onyx.Picker", onChange: "setNotificationFeeds",components: [
								{content: "Any feed", value: "any"},
								{content: "Selected feeds", value: "selected"}
    						]}
						]},
					]},
					{name: "notificationFeedsSelectionRow", kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "enyo.FittableColumns", noStretch: true, style: "width: 100%; padding: 5px", components: [
							{kind: "onyx.Button", classes: "onyx-blue", content: "Select Feeds", style: "width: 100%", ontap: "selectFeeds"}
						]}
					]}
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{tag: "div", classes: "feedspider-groupbox-header", content: "Feedly Options"},
				{tag: "div", classes: "feedspider-groupbox-body-single", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Show most engaging articles only"},
						{name: "feedlySortEngagement", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setFeedlySortEngagement"}
					]},
				]}
			]},
		]},
		{name: "notificationFeedsDialog", kind: "FeedSpider2.NotificationFeedsDialog", onComplete: "feedSelectionComplete"}
	],
	
	rendered: function()
	{
		this.inherited(arguments);
		
		//Fix pickers - there is a rendering error if the pickers have their width set if they are hidden 
		this.$.themePickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		this.$.feedSortOrderPickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		this.$.sortOrderPickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		this.$.fontSizePickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		this.$.notificationIntervalPickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		this.$.notificationFeedsPickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
	},

	activate: function()
	{
		//Cache Existing Values
		this.originalAllowLandscape = Preferences.allowLandscape();
		this.originalSortOrder = Preferences.isOldestFirst();
		this.originalHideReadFeeds = Preferences.hideReadFeeds();
		this.originalHideReadArticles = Preferences.hideReadArticles();
		this.originalFontSize = Preferences.fontSize();
		this.originalFeedSortOrder = Preferences.isManualFeedSort();
		this.originalTheme = Preferences.getTheme();
		this.originalNotificationInterval = Preferences.notificationInterval();
		this.originalFeedlySortEngagement = Preferences.isFeedlySortEngagement();
		
		//Setup checkboxes
		this.$.allowLandscape.checked = Preferences.allowLandscape();
		//this.$.gestureScrolling.checked = Preferences.gestureScrolling();
		this.$.hideReadFeeds.checked = Preferences.hideReadFeeds();
		this.$.hideReadArticles.checked = Preferences.hideReadArticles();
		this.$.backAfterMarkRead.checked = Preferences.goBackAfterMarkAsRead();
		this.$.combineFolders.checked = Preferences.combineFolders();
		//this.$.markReadScroll.value = Preferences.markReadAsScroll();
		this.$.feedlySortEngagement.checked = Preferences.isFeedlySortEngagement();
		this.$.shortenURLs.checked = Preferences.isShortenURLs();

		//Get Picker values
		this.sortOrder = (Preferences.isOldestFirst() ? "oldest": "newest");
		this.fontSize = Preferences.fontSize();
		this.feedSortOrder = (Preferences.isManualFeedSort() ? "manual": "alphabetical");
		this.theme = Preferences.getTheme();
		this.debug = Preferences.isDebugging(); //TODO: Decide whether to eliminate debugging or not.
		this.notificationInterval = Preferences.notificationInterval();
		this.notificationFeeds = Preferences.anyOrSelectedFeedsForNotifications();
		
		//Cache current values (this prevents additional callbacks when setting up pickers)
		this.currentTheme = Preferences.getTheme();
		this.currentFeedSortOrder = (Preferences.isManualFeedSort() ? "manual": "alphabetical");
		this.currentSortOrder = (Preferences.isOldestFirst() ? "oldest": "newest");
		this.currentFontSize = Preferences.fontSize();
		this.currentNotificationInterval = Preferences.notificationInterval();
		this.currentNotificationFeeds = Preferences.anyOrSelectedFeedsForNotifications();
		
		//Set Pickers
		this.setPicker(this.$.themePicker, this.$.themePickerHeader, this.theme);
		this.setPicker(this.$.feedSortOrderPicker, this.$.feedSortOrderPickerHeader, this.feedSortOrder);
		this.setPicker(this.$.sortOrderPicker, this.$.sortOrderPickerHeader, this.sortOrder);
		this.setPicker(this.$.fontSizePicker, this.$.fontSizePickerHeader, this.fontSize);
		this.setPicker(this.$.notificationIntervalPicker, this.$.notificationIntervalPickerHeader, this.notificationInterval);
		this.setPicker(this.$.notificationFeedsPicker, this.$.notificationFeedsPickerHeader, this.notificationFeeds);
		
		//Set up Notifications groupbox
		this.showAndHideStuff();
		
		this.render();
	},
		
	setPicker: function(picker, header, pref) {
		for (var i = 0; i < picker.controls.length; i++) {
        	if (picker.controls[i].value === pref) {
            	picker.setSelected(picker.controls[i]);
        	}
    	}
    	header.content = picker.selected.content;
	},
	
	showAndHideStuff: function() {
		if(Preferences.notificationInterval() == 0) {
		  this.$.notificationFeedsRow.hide();
		  this.$.notificationFeedsSelectionRow.hide();
		  this.$.notificationsBody.removeClass("feedspider-groupbox-body");
		  this.$.notificationsBody.addClass("feedspider-groupbox-body-single");
		}
		else {
		  this.$.notificationsBody.removeClass("feedspider-groupbox-body-single");
		  this.$.notificationsBody.addClass("feedspider-groupbox-body");
		  this.$.notificationFeedsPickerHeader.addStyles({"width" : this.$.notificationIntervalPickerHeader.domStyles.width});
		  this.$.notificationFeedsRow.show();

		  if(Preferences.anyOrSelectedFeedsForNotifications() == "any") {
		  	this.$.notificationFeedsSelectionRow.hide();
		  }
		  else {
		  	this.$.notificationFeedsSelectionRow.show();
		  }
		}
	},

	setDialogTheme: function(theme) {
		this.$.notificationFeedsDialog.removeClass("theme-dark-dialog");
		this.$.notificationFeedsDialog.removeClass("theme-grey-dialog");
		this.$.notificationFeedsDialog.removeClass("theme-light-dialog");
		
		this.$.notificationFeedsDialog.addClass("theme-" + theme + "-dialog");		
	},

	setShortenURLs: function() {
		Preferences.setShortenURLs(this.$.shortenURLs.checked);
	},

	setFeedlySortEngagement: function() {
		Preferences.setFeedlySortEngagement(this.$.feedlySortEngagement.checked);
	},

	setAllowLandscape: function() {
		Preferences.setAllowLandscape(this.$.allowLandscape.checked);
	},

	setGestureScrolling: function() {
		Preferences.setGestureScrolling(this.$.gestureScrolling.checked);
	},

	setSortOrder: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentSortOrder)
		{
			this.currentSortOrder = inEvent.selected.value;
			Preferences.setOldestFirst(inEvent.selected.value == "oldest");
			this.$.sortOrderPickerHeader.content = inEvent.selected.content;
		}
	},

	setFontSize: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentFontSize)
		{
			this.currentFontSize = inEvent.selected.value;
			Preferences.setFontSize(inEvent.selected.value);
			this.$.fontSizePickerHeader.content = inEvent.selected.content;
		}	
		
	},

	setHideReadFeeds: function() {
		Preferences.setHideReadFeeds(this.$.hideReadFeeds.checked);
	},

	setHideReadArticles: function() {
		Preferences.setHideReadArticles(this.$.hideReadArticles.checked);
	},

	setBackAfterMarkRead: function() {
		Preferences.setBackAfterMarkAsRead(this.$.backAfterMarkRead.checked);
	},

	setCombineFolders: function() {
		Preferences.setCombineFolders(this.$.combineFolders.checked);
	},

	setFeedSortOrder: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentFeedSortOrder)
		{
			this.currentFeedSortOrder = inEvent.selected.value;
			Preferences.setManualFeedSort(inEvent.selected.value == "manual");
			this.$.feedSortOrderPickerHeader.content = inEvent.selected.content;
		}
	},

	setTheme: function(inSender, inEvent, $super) {
		if (inEvent.selected.value != this.currentTheme)
		{
			this.currentTheme = inEvent.selected.value;
			Preferences.setTheme(inEvent.selected.value);
			this.$.themePickerHeader.content = inEvent.selected.content;
			this.doSetTheme();
		}
	},

	setNotificationInterval: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentNotificationInterval)
		{
			this.currentNotificationInterval = inEvent.selected.value;
			Preferences.setNotificationInterval(inEvent.selected.value);
			this.showAndHideStuff();
			this.$.notificationIntervalPickerHeader.content = inEvent.selected.content;
		}
	},

	setNotificationFeeds: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentNotificationFeeds)
		{
			this.currentNotificationFeeds = inEvent.selected.value;
			Preferences.setAnyOrSelectedFeedsForNotification(inEvent.selected.value);
			this.showAndHideStuff();
			this.$.notificationFeedsPickerHeader.content = inEvent.selected.content;
		}
	},

	setDebugging: function() {
		Preferences.setDebugging(this.$.debug.checked);
	},

	setMarkReadScroll: function() {
		Preferences.setMarkReadAsScroll(this.$.markReadScroll.checked);
	},

	selectFeeds: function() {
		this.$.notificationFeedsDialog.setSources(this.sources);
		this.$.notificationFeedsDialog.show();
	},
	
	feedSelectionComplete: function() {
		this.$.notificationFeedsDialog.hide();
	},

	handleGoBack: function() {
		if (this.originalNotificationInterval != Preferences.notificationInterval()) {
		  feedspider.setInterval({action: "notificationIntervalChange"});
		}

		changes = {};

		if (this.originalAllowLandscape != Preferences.allowLandscape()) changes.allowLandscapeChanged = true;
		if (this.originalSortOrder != Preferences.isOldestFirst()) changes.sortOrderChanged = true;
		if (this.originalHideReadFeeds != Preferences.hideReadFeeds()) changes.hideReadFeedsChanged = true;
		if (this.originalHideReadArticles != Preferences.hideReadArticles()) changes.hideReadArticlesChanged = true;
		if (this.originalFontSize != Preferences.fontSize()) changes.fontSizeChanged = true;
		if (this.originalFeedSortOrder != Preferences.isManualFeedSort()) changes.feedSortOrderChanged = true;
		if (this.originalTheme != Preferences.getTheme()) changes.themeChanged = true;
		if (this.originalFeedlySortEngagement != Preferences.isFeedlySortEngagement()) changes.sortOrderChanged = true;

		this.doGoBack({lastPage: this.previousPage, changes: changes});
	},
});