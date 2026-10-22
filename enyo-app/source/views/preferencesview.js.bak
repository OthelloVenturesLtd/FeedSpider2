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
			{name: "viewTitle", tag: "span", style:"font-weight: bold; text-align: center", fit: true},
			{kind: "onyx.Icon"}, //This is here to keep the header centered.
		]},
		{kind: "enyo.Scroller", fit: true, style: "padding: 10px", touchOverscroll: true, touch: true, strategyKind:"TouchScrollStrategy", components: [
			{tag: "div", classes: "feedspider-groupbox", components: [
				{name: "generalHeader", tag: "div", classes: "feedspider-groupbox-header"},
				{name: "generalGroupbox", tag: "div", classes: "feedspider-groupbox-body", style: "width: 100%", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{name: "allowLandscapeTitle", tag: "span", fit: true, classes: "feedspider-preference-title"},
						{name: "allowLandscape", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setAllowLandscape"}
					]},
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{name: "allowSwipeNavTitle", tag: "span", fit: true, classes: "feedspider-preference-title"},
						{name: "allowSwipeNav", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setAllowSwipeNav"}
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
		  						{name: "greyThemePickerItem", value: "grey"},
		  						{name: "lightThemePickerItem", value: "light"},
		  						{name: "darkThemePickerItem", value: "dark"}
    						]}
						]},
					]}
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{name: "feedsHeader", tag: "div", classes: "feedspider-groupbox-header"},
				{tag: "div", classes: "feedspider-groupbox-body", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{name: "hideReadFeedsTitle", tag: "span", fit: true, classes: "feedspider-preference-title"},
						{name: "hideReadFeeds", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setHideReadFeeds"}
					]},
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{name: "backAfterMarkReadTitle", tag: "span", fit: true, classes: "feedspider-preference-title"},
						{name: "backAfterMarkRead", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setBackAfterMarkRead"}
					]},
					{kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "feedSortOrderPickerHeader", tag: "span", fit: true, classes: "feedspider-picker-header", style: "text-align: left; width: 100%;"},
								{kind: "onyx.Icon", src: "assets/downarrow.png"},
							]},
							{name: "feedSortOrderPicker", kind: "onyx.Picker", onChange: "setFeedSortOrder",components: [
		  						{name: "sortAlphabeticallyPickerItem", value: "alphabetical"},
		  						{name: "sortManuallyPickerItem", value: "manual"}
    						]}
						]},
					]}
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{name: "articlesHeader", tag: "div", classes: "feedspider-groupbox-header"},
				{tag: "div", classes: "feedspider-groupbox-body", components:[
					{kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "sortOrderPickerHeader", tag: "span", classes: "feedspider-picker-header", fit: true, style: "text-align: left; width: 100%;"},
								{kind: "onyx.Icon", src: "assets/downarrow.png"},
							]},
							{name: "sortOrderPicker", kind: "onyx.Picker", onChange: "setSortOrder",components: [
		  						{name: "newestFirstPickerItem", value: "newest"},
		  						{name: "oldestFirstPickerItem", value: "oldest"}
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
		  						{name: "tinyFontPickerItem", value: "tiny"},
		  						{name: "smallFontPickerItem", value: "small"},
		  						{name: "mediumFontPickerItem", value: "medium"},
		  						{name: "largeFontPickerItem", value: "large"}
    						]}
						]},
					]},
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{name: "hideReadArticlesTitle", tag: "span", fit: true, classes: "feedspider-preference-title"},
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
				{name: "foldersHeader", tag: "div", classes: "feedspider-groupbox-header"},
				{tag: "div", classes: "feedspider-groupbox-body-single", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{name: "combineFoldersTitle", tag: "span", fit: true, classes: "feedspider-preference-title"},
						{name: "combineFolders", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setCombineFolders"}
					]},
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{name: "sharingHeader", tag: "div", classes: "feedspider-groupbox-header"},
				{tag: "div", classes: "feedspider-groupbox-body-single", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{name: "shortenURLsTitle", tag: "span", fit: true, classes: "feedspider-preference-title"},
						{name: "shortenURLs", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setShortenURLs"}
					]},
				]}
			]},
			{name: "notificationsGroupbox", tag: "div", classes: "feedspider-groupbox", components: [
				{name: "notificationsHeader", tag: "div", classes: "feedspider-groupbox-header"},
				{name: "notificationsBody", tag: "div", components:[
					{kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "notificationIntervalPickerHeader", tag: "span", fit: true, classes: "feedspider-picker-header", style: "text-align: left; width: 100%;"},
								{kind: "onyx.Icon", src: "assets/downarrow.png"},
							]},
							{name: "notificationIntervalPicker", kind: "onyx.Picker", onChange: "setNotificationInterval",components: [
								{name: "offPickerItem", value: 0},
								//{content: "10 Seconds", value: 10},
								//{content: "30 Seconds", value: 30},
								{name: "fiveMinutesPickerItem", value: 300},
								{name: "fifteenMinutesPickerItem", value: 900},
								{name: "thirtyMinutesPickerItem", value: 1800},
								{name: "oneHourPickerItem", value: 3600},
								{name: "fourHoursPickerItem", value: 14400},
								{name: "eightHoursPickerItem", value: 18800}
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
								{name: "anyFeedPickerItem", value: "any"},
								{name: "selectedFeedsPickerItem", value: "selected"}
    						]}
						]},
					]},
					{name: "notificationFeedsSelectionRow", kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "enyo.FittableColumns", noStretch: true, style: "width: 100%; padding: 5px", components: [
							{name: "selectFeedsButton", kind: "onyx.Button", classes: "onyx-blue", style: "width: 100%", ontap: "selectFeeds"}
						]}
					]}
				]}
			]},
			{tag: "div", classes: "feedspider-groupbox", components: [
				{name: "feedlyOptionsHeader", tag: "div", classes: "feedspider-groupbox-header"},
				{tag: "div", classes: "feedspider-groupbox-body-single", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{name: "feedlySortEngagementTitle", tag: "span", fit: true, classes: "feedspider-preference-title"},
						{name: "feedlySortEngagement", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setFeedlySortEngagement"}
					]},
				]}
			]},
			{name: "instapaperOptionsGroupbox", tag: "div", classes: "feedspider-groupbox", style: "margin-bottom: 20px", components: [
				{name: "instapaperOptionsHeader", tag: "div", classes: "feedspider-groupbox-header"},
				{tag: "div", classes: "feedspider-groupbox-body-single", components:[
					{kind: "enyo.FittableColumns", noStretch: true, style: "width: 100%; padding: 5px", components: [
						{name: "clearInstapaperCredentialsButton", kind: "onyx.Button", classes: "onyx-negative", ontap: "clearInstapaperCredentials"}
					]}
				]}
			]},
		]},
		{name: "notificationFeedsDialog", kind: "FeedSpider2.NotificationFeedsDialog", onComplete: "feedSelectionComplete"},
		{kind: enyo.Signals, onkeyup: "handleKeyUp"}
	],
	
	create: function() {
    	this.inherited(arguments);
    	
    	this.$.viewTitle.setContent($L("Preferences"));
    	this.$.generalHeader.setContent($L("General"));
    	this.$.allowLandscapeTitle.setContent($L("Allow Landscape"));
		this.$.allowSwipeNavTitle.setContent($L("Allow Swipe Nav"));
    	this.$.greyThemePickerItem.setContent($L("Grey Theme"));
    	this.$.lightThemePickerItem.setContent($L("Light Theme"));
    	this.$.darkThemePickerItem.setContent($L("Dark Theme"));
    	this.$.feedsHeader.setContent($L("Feeds"));
		this.$.hideReadFeedsTitle.setContent($L("Hide Read Feeds"));
		this.$.backAfterMarkReadTitle.setContent($L("Go back after mark all read"));
    	this.$.sortAlphabeticallyPickerItem.setContent($L("Sort alphabetically"));
    	this.$.sortManuallyPickerItem.setContent($L("Sort manually"));
    	this.$.articlesHeader.setContent($L("Articles"));
    	this.$.newestFirstPickerItem.setContent($L("Sort newest first"));
    	this.$.oldestFirstPickerItem.setContent($L("Sort oldest first"));
    	this.$.tinyFontPickerItem.setContent($L("Tiny Font"));
    	this.$.smallFontPickerItem.setContent($L("Small Font"));
    	this.$.mediumFontPickerItem.setContent($L("Medium Font"));
    	this.$.largeFontPickerItem.setContent($L("Large Font"));
		this.$.hideReadArticlesTitle.setContent($L("Hide Read Articles"));
    	this.$.foldersHeader.setContent($L("Folders"));
    	this.$.combineFoldersTitle.setContent($L("Combine Folders"));
    	this.$.sharingHeader.setContent($L("Sharing"));
    	this.$.shortenURLsTitle.setContent($L("Shorten URLs"));
        this.$.notificationsHeader.setContent($L("Notifications"));
        this.$.offPickerItem.setContent($L("Off"));
        this.$.fiveMinutesPickerItem.setContent($L("5 Minutes"));
        this.$.fifteenMinutesPickerItem.setContent($L("15 Minutes"));
        this.$.thirtyMinutesPickerItem.setContent($L("30 Minutes"));
        this.$.oneHourPickerItem.setContent($L("1 Hour"));
        this.$.fourHoursPickerItem.setContent($L("4 Hours"));
        this.$.eightHoursPickerItem.setContent($L("8 Hours"));
        this.$.anyFeedPickerItem.setContent($L("Any feed"));
        this.$.selectedFeedsPickerItem.setContent($L("Selected feeds"));
        this.$.selectFeedsButton.setContent($L("Select Feeds"));
        this.$.feedlyOptionsHeader.setContent($L("Feedly Options"));
        this.$.feedlySortEngagementTitle.setContent($L("Show most engaging articles only"));
        this.$.instapaperOptionsHeader.setContent($L("Instapaper Options"));
        this.$.clearInstapaperCredentialsButton.setContent($L("Clear Instapaper Credentials"));
    },
	
	rendered: function()
	{
		this.inherited(arguments);
		
		//Fix pickers - there is a rendering error if the pickers have their width set if they are hidden
		// this.$.themePickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		// this.$.feedSortOrderPickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		// this.$.sortOrderPickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		// this.$.fontSizePickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		// this.$.notificationIntervalPickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		// this.$.notificationFeedsPickerHeader.addStyles({"width" : this.$.generalGroupbox.domStyles.width});
		// var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);  
		// this.$.clearInstapaperCredentialsButton.addStyles({"width" : windowWidth - 42 + "px"});
		
		if(!(enyo.platform.webos || enyo.platform.firefoxOS || window.PalmSystem))
	 	{
	 		this.$.instapaperOptionsGroupbox.hide();
	 	}
	 	
	 	if(!enyo.platform.webos && window.PalmSystem)
	 	{
	 		this.$.notificationsGroupbox.hide();
	 	}
	},

	activate: function()
	{
		//Cache Existing Values
		this.originalAllowLandscape = FeedSpider2.Preferences.allowLandscape();
		this.originalAllowSwipeNav = FeedSpider2.Preferences.allowSwipeNav();
		this.originalSortOrder = FeedSpider2.Preferences.isOldestFirst();
		this.originalHideReadFeeds = FeedSpider2.Preferences.hideReadFeeds();
		this.originalHideReadArticles = FeedSpider2.Preferences.hideReadArticles();
		this.originalFontSize = FeedSpider2.Preferences.fontSize();
		this.originalFeedSortOrder = FeedSpider2.Preferences.isManualFeedSort();
		this.originalTheme = FeedSpider2.Preferences.getTheme();
		this.originalNotificationInterval = FeedSpider2.Preferences.notificationInterval();
		this.originalFeedlySortEngagement = FeedSpider2.Preferences.isFeedlySortEngagement();
		
		//Setup checkboxes
		this.$.allowLandscape.checked = FeedSpider2.Preferences.allowLandscape();
		this.$.allowSwipeNav.checked = FeedSpider2.Preferences.allowSwipeNav();
		//this.$.gestureScrolling.checked = FeedSpider2.Preferences.gestureScrolling();
		this.$.hideReadFeeds.checked = FeedSpider2.Preferences.hideReadFeeds();
		this.$.hideReadArticles.checked = FeedSpider2.Preferences.hideReadArticles();
		this.$.backAfterMarkRead.checked = FeedSpider2.Preferences.goBackAfterMarkAsRead();
		this.$.combineFolders.checked = FeedSpider2.Preferences.combineFolders();
		//this.$.markReadScroll.value = FeedSpider2.Preferences.markReadAsScroll();
		this.$.feedlySortEngagement.checked = FeedSpider2.Preferences.isFeedlySortEngagement();
		this.$.shortenURLs.checked = FeedSpider2.Preferences.isShortenURLs();

		//Get Picker values
		this.sortOrder = (FeedSpider2.Preferences.isOldestFirst() ? "oldest": "newest");
		this.fontSize = FeedSpider2.Preferences.fontSize();
		this.feedSortOrder = (FeedSpider2.Preferences.isManualFeedSort() ? "manual": "alphabetical");
		this.theme = FeedSpider2.Preferences.getTheme();
		this.debug = FeedSpider2.Preferences.isDebugging(); //TODO: Decide whether to eliminate debugging or not.
		this.notificationInterval = FeedSpider2.Preferences.notificationInterval();
		this.notificationFeeds = FeedSpider2.Preferences.anyOrSelectedFeedsForNotifications();
		
		//Cache current values (this prevents additional callbacks when setting up pickers)
		this.currentTheme = FeedSpider2.Preferences.getTheme();
		this.currentFeedSortOrder = (FeedSpider2.Preferences.isManualFeedSort() ? "manual": "alphabetical");
		this.currentSortOrder = (FeedSpider2.Preferences.isOldestFirst() ? "oldest": "newest");
		this.currentFontSize = FeedSpider2.Preferences.fontSize();
		this.currentNotificationInterval = FeedSpider2.Preferences.notificationInterval();
		this.currentNotificationFeeds = FeedSpider2.Preferences.anyOrSelectedFeedsForNotifications();
		
		//Set Pickers
		this.setPicker(this.$.themePicker, this.$.themePickerHeader, this.theme);
		this.setPicker(this.$.feedSortOrderPicker, this.$.feedSortOrderPickerHeader, this.feedSortOrder);
		this.setPicker(this.$.sortOrderPicker, this.$.sortOrderPickerHeader, this.sortOrder);
		this.setPicker(this.$.fontSizePicker, this.$.fontSizePickerHeader, this.fontSize);
		this.setPicker(this.$.notificationIntervalPicker, this.$.notificationIntervalPickerHeader, this.notificationInterval);
		this.setPicker(this.$.notificationFeedsPicker, this.$.notificationFeedsPickerHeader, this.notificationFeeds);
		
		//Set up Notifications groupbox
		this.showAndHideStuff();
		
		//Set up Clear Instapaper Credentials Button
		var ipUsername = FeedSpider2.Preferences.getInstapaperUsername();
		var ipPassword = FeedSpider2.Preferences.getInstapaperPassword();
		
		if (ipUsername || ipPassword)
		{
			this.$.clearInstapaperCredentialsButton.setDisabled(false);
		}
		else
		{
			this.$.clearInstapaperCredentialsButton.setDisabled(true);
		}
		
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
		if(FeedSpider2.Preferences.notificationInterval() === 0) {
		  this.$.notificationFeedsRow.hide();
		  this.$.notificationFeedsSelectionRow.hide();
		  this.$.notificationsBody.removeClass("feedspider-groupbox-body");
		  this.$.notificationsBody.addClass("feedspider-groupbox-body-single");
		}
		else {
		  this.$.notificationsBody.removeClass("feedspider-groupbox-body-single");
		  this.$.notificationsBody.addClass("feedspider-groupbox-body");
		  //this.$.notificationFeedsPickerHeader.addStyles({"width" : this.$.notificationIntervalPickerHeader.domStyles.width});
		  this.$.notificationFeedsRow.show();

		  if(FeedSpider2.Preferences.anyOrSelectedFeedsForNotifications() == "any") {
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
		FeedSpider2.Preferences.setShortenURLs(this.$.shortenURLs.checked);
	},

	setFeedlySortEngagement: function() {
		FeedSpider2.Preferences.setFeedlySortEngagement(this.$.feedlySortEngagement.checked);
	},

	setAllowLandscape: function() {
		FeedSpider2.Preferences.setAllowLandscape(this.$.allowLandscape.checked);
	},

	setAllowSwipeNav: function() {
		FeedSpider2.Preferences.setAllowSwipeNav(this.$.allowSwipeNav.checked);
	},

	setGestureScrolling: function() {
		FeedSpider2.Preferences.setGestureScrolling(this.$.gestureScrolling.checked);
	},

	setSortOrder: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentSortOrder)
		{
			this.currentSortOrder = inEvent.selected.value;
			FeedSpider2.Preferences.setOldestFirst(inEvent.selected.value == "oldest");
			this.$.sortOrderPickerHeader.content = inEvent.selected.content;
		}
	},

	setFontSize: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentFontSize)
		{
			this.currentFontSize = inEvent.selected.value;
			FeedSpider2.Preferences.setFontSize(inEvent.selected.value);
			this.$.fontSizePickerHeader.content = inEvent.selected.content;
		}	
		
	},

	setHideReadFeeds: function() {
		FeedSpider2.Preferences.setHideReadFeeds(this.$.hideReadFeeds.checked);
	},

	setHideReadArticles: function() {
		FeedSpider2.Preferences.setHideReadArticles(this.$.hideReadArticles.checked);
	},

	setBackAfterMarkRead: function() {
		FeedSpider2.Preferences.setBackAfterMarkAsRead(this.$.backAfterMarkRead.checked);
	},

	setCombineFolders: function() {
		FeedSpider2.Preferences.setCombineFolders(this.$.combineFolders.checked);
	},

	setFeedSortOrder: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentFeedSortOrder)
		{
			this.currentFeedSortOrder = inEvent.selected.value;
			FeedSpider2.Preferences.setManualFeedSort(inEvent.selected.value == "manual");
			this.$.feedSortOrderPickerHeader.content = inEvent.selected.content;
		}
	},

	setTheme: function(inSender, inEvent, $super) {
		if (inEvent.selected.value != this.currentTheme)
		{
			this.currentTheme = inEvent.selected.value;
			FeedSpider2.Preferences.setTheme(inEvent.selected.value);
			this.$.themePickerHeader.content = inEvent.selected.content;
			this.doSetTheme();
		}
	},

	setNotificationInterval: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentNotificationInterval)
		{
			this.currentNotificationInterval = inEvent.selected.value;
			FeedSpider2.Preferences.setNotificationInterval(inEvent.selected.value);
			this.showAndHideStuff();
			this.$.notificationIntervalPickerHeader.content = inEvent.selected.content;
		}
	},

	setNotificationFeeds: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentNotificationFeeds)
		{
			this.currentNotificationFeeds = inEvent.selected.value;
			FeedSpider2.Preferences.setAnyOrSelectedFeedsForNotification(inEvent.selected.value);
			this.showAndHideStuff();
			this.$.notificationFeedsPickerHeader.content = inEvent.selected.content;
		}
	},

	setDebugging: function() {
		FeedSpider2.Preferences.setDebugging(this.$.debug.checked);
	},

	setMarkReadScroll: function() {
		FeedSpider2.Preferences.setMarkReadAsScroll(this.$.markReadScroll.checked);
	},

	selectFeeds: function() {
		this.$.notificationFeedsDialog.setSources(this.sources);
		this.$.notificationFeedsDialog.show();
	},
	
	feedSelectionComplete: function() {
		this.$.notificationFeedsDialog.hide();
	},
	
	clearInstapaperCredentials: function(){
		FeedSpider2.Preferences.setInstapaperUsername(null);
		FeedSpider2.Preferences.setInstapaperPassword(null);
		this.$.clearInstapaperCredentialsButton.setDisabled(true);
		Feeder.notify($L("Instapaper Credentials Cleared"));
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
		if (this.$.notificationFeedsDialog.showing)
		{
			this.feedSelectionComplete();
		}
		else
		{
			if (this.originalNotificationInterval != FeedSpider2.Preferences.notificationInterval()) {
			  feedspider.setInterval({action: "notificationIntervalChange"});
			}

			changes = {};

			if (this.originalAllowLandscape != FeedSpider2.Preferences.allowLandscape()) changes.allowLandscapeChanged = true;
			if (this.originalAllowSwipeNav != FeedSpider2.Preferences.allowSwipeNav()) changes.allowSwipeNavChanged = true;
			if (this.originalSortOrder != FeedSpider2.Preferences.isOldestFirst()) changes.sortOrderChanged = true;
			if (this.originalHideReadFeeds != FeedSpider2.Preferences.hideReadFeeds()) changes.hideReadFeedsChanged = true;
			if (this.originalHideReadArticles != FeedSpider2.Preferences.hideReadArticles()) changes.hideReadArticlesChanged = true;
			if (this.originalFontSize != FeedSpider2.Preferences.fontSize()) changes.fontSizeChanged = true;
			if (this.originalFeedSortOrder != FeedSpider2.Preferences.isManualFeedSort()) changes.feedSortOrderChanged = true;
			if (this.originalTheme != FeedSpider2.Preferences.getTheme()) changes.themeChanged = true;
			if (this.originalFeedlySortEngagement != FeedSpider2.Preferences.isFeedlySortEngagement()) changes.sortOrderChanged = true;

			this.doGoBack({lastPage: this.previousPage, changes: changes});
		}
	},
});