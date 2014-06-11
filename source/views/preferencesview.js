enyo.kind({
	name: "FeedSpider2.PreferencesView",
	kind: "FittableRows",
	fit: true,
	
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.IconButton", src: "assets/go-back.png"},
			{tag: "span", content: "Preferences", style:"font-weight: bold; text-align: center", fit: true},
			{kind: "onyx.Icon"}, //This is here to keep the header centered.
		]},
		{kind: "enyo.Scroller", fit: true, style: "background-color: #e6e3de; padding: 10px", components: [
			{tag: "div", classes: "feedspider-groupbox", components: [
				{tag: "div", classes: "feedspider-groupbox-header", content: "General"},
				{tag: "div", classes: "feedspider-groupbox-body", components:[
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Allow landscape"},
						{name: "allowLandscape", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setAllowLandscape"}
					]},
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Landscape gesture scrolling"},
						{name: "gestureScrolling", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setGestureScrolling"}
					]},
					{kind: "enyo.FittableColumns", style: "padding: 0px", noStretch: true, components: [
						{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
							{layoutKind: "FittableColumnsLayout", noStretch: true, style: "padding-left: 10px; width:100%; background-color: #e6e3de; border-width: 0px; border-radius: 0px; background: none", components: [
								{name: "themePickerHeader", tag: "span", fit: true, style: "text-align: left; width: 100%; color: black"},
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
								{name: "feedSortOrderPickerHeader", tag: "span", fit: true, style: "text-align: left; width: 100%; color: black"},
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
								{name: "sortOrderPickerHeader", tag: "span", fit: true, style: "text-align: left; width: 100%; color: black"},
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
								{name: "fontSizePickerHeader", tag: "span", fit: true, style: "text-align: left; width: 100%; color: black"},
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
					{kind: "enyo.FittableColumns", noStretch: true, classes: "feedspider-preference-item", components: [
						{tag: "span", fit: true, classes: "feedspider-preference-title", content: "Mark read as you scroll"},
						{name: "markReadScroll", kind: "onyx.Checkbox", classes: "feedspider-preference-checkbox", onchange: "setMarkReadScroll"}
					]}
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
				{tag: "div", classes: "feedspider-groupbox-body-single", components:[
					{content: "Hello World"},
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
	],
	
	create: function() {
    	this.inherited(arguments);

		this.intervalChoices = {choices: [
		  {label: "Off", value: "00:00:00"},
		  //{label: "30 Seconds", value: "00:00:30"},
		  {label: "5 Minutes", value: "00:05:00"},
		  {label: "15 Minutes", value: "00:15:00"},
		  {label: "30 Minutes", value: "00:30:00"},
		  {label: "1 Hour", value: "01:00:00"},
		  {label: "4 Hours", value: "04:00:00"},
		  {label: "8 Hours", value: "08:00:00"}
		]}

		this.notificationFeedsChoices = {choices: [
		  {label: "Any feed", value: "any"},
		  {label: "Selected feeds", value: "selected"}
		]}

		this.$.allowLandscape.checked = Preferences.allowLandscape()
		this.$.gestureScrolling.checked = Preferences.gestureScrolling()
		this.sortOrder = (Preferences.isOldestFirst() ? "oldest": "newest")
		this.$.hideReadFeeds.checked = Preferences.hideReadFeeds()
		this.$.hideReadArticles.checked = Preferences.hideReadArticles()
		this.$.backAfterMarkRead.checked = Preferences.goBackAfterMarkAsRead()
		this.fontSize = Preferences.fontSize()
		this.$.combineFolders.checked = Preferences.combineFolders()
		this.feedSortOrder = (Preferences.isManualFeedSort() ? "manual": "alphabetical")
		this.theme = Preferences.getTheme()
		this.debug = {value: Preferences.isDebugging()} //TODO: Decide whether to eliminate debugging or not.
		this.$.markReadScroll.value = Preferences.markReadAsScroll()
		this.notificationInterval = {value: Preferences.notificationInterval()}
		this.notificationFeeds = {value: Preferences.anyOrSelectedFeedsForNotifications()}
		this.notificationFeedSelection = {buttonLabel: "Select Feeds"} // ?? Double-check and see if this is necessary.
		this.$.feedlySortEngagement.checked = Preferences.isFeedlySortEngagement()
		this.$.shortenURLs = Preferences.isShortenURLs()

		this.originalAllowLandscape = Preferences.allowLandscape()
		this.originalSortOrder = Preferences.isOldestFirst()
		this.originalHideReadFeeds = Preferences.hideReadFeeds()
		this.originalHideReadArticles = Preferences.hideReadArticles()
		this.originalFontSize = Preferences.fontSize()
		this.originalFeedSortOrder = Preferences.isManualFeedSort()
		this.originalTheme = Preferences.getTheme()
		this.originalNotificationInterval = Preferences.notificationInterval()
		this.originalFeedlySortEngagement = Preferences.isFeedlySortEngagement()
		
		this.currentTheme = Preferences.getTheme()
		this.currentFeedSortOrder = (Preferences.isManualFeedSort() ? "manual": "alphabetical")
		this.currentSortOrder = (Preferences.isOldestFirst() ? "oldest": "newest")
		this.currentFontSize = Preferences.fontSize()
		
		//Set Pickers
		this.setPickers(this.$.themePicker, this.$.themePickerHeader, this.theme)
		this.setPickers(this.$.feedSortOrderPicker, this.$.feedSortOrderPickerHeader, this.feedSortOrder)
		this.setPickers(this.$.sortOrderPicker, this.$.sortOrderPickerHeader, this.sortOrder)
		this.setPickers(this.$.fontSizePicker, this.$.fontSizePickerHeader, this.fontSize)
	},
	
	setPickers: function(picker, header, pref) {
		for (var i = 0; i < picker.controls.length; i++) {
        	if (picker.controls[i].value === pref) {
            	picker.setSelected(picker.controls[i]);
        	}
    	}
    	header.content = picker.selected.content	
	},
	
	showAndHideStuff: function() {
		if(Preferences.notificationInterval() == "00:00:00") {
		  this.controller.get("notification-feeds-row").hide()
		  this.controller.get("notification-feed-selection-row").hide()
		  this.controller.get("notifications-row").addClassName("last")
		}
		else {
		  this.controller.get("notification-feeds-row").show()
		  this.controller.get("notifications-row").removeClassName("last")
		  this.controller.get("notification-feeds-row").addClassName("last")

		  if(Preferences.anyOrSelectedFeedsForNotifications() == "any") {
			this.controller.get("notification-feeds-row").addClassName("last")
			this.controller.get("notification-feed-selection-row").hide()
		  }
		  else {
			this.controller.get("notification-feeds-row").removeClassName("last")
			this.controller.get("notification-feed-selection-row").show()
			this.controller.get("notification-feed-selection-row").addClassName("last")
		  }
		}
	},

	setShortenURLs: function() {
		Preferences.setShortenURLs(this.$.shortenURLs.checked)
	},

	setFeedlySortEngagement: function() {
		Preferences.setFeedlySortEngagement(this.$.feedlySortEngagement.checked)
	},

	setAllowLandscape: function() {
		Preferences.setAllowLandscape(this.$.allowLandscape.checked)
	},

	setGestureScrolling: function() {
		Preferences.setGestureScrolling(this.$.gestureScrolling.checked)
	},

	setSortOrder: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentSortOrder)
		{
			this.currentSortOrder = inEvent.selected.value
			Preferences.setOldestFirst(inEvent.selected.value == "oldest")
			this.$.sortOrderPickerHeader.content = inEvent.selected.content
		}
	},

	setFontSize: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentFontSize)
		{
			this.currentFontSize = inEvent.selected.value
			Preferences.setFontSize(inEvent.selected.value)
			this.$.fontSizePickerHeader.content = inEvent.selected.content
		}	
		
	},

	setHideReadFeeds: function() {
		Preferences.setHideReadFeeds(this.$.hideReadFeeds.checked)
	},

	setHideReadArticles: function() {
		Preferences.setHideReadArticles(this.$.hideReadArticles.checked)
	},

	setBackAfterMarkRead: function() {
		Preferences.setBackAfterMarkAsRead(this.$.backAfterMarkRead.checked)
	},

	setCombineFolders: function() {
		Preferences.setCombineFolders(this.$.combineFolders.checked)
	},

	setFeedSortOrder: function(inSender, inEvent) {
		if (inEvent.selected.value != this.currentFeedSortOrder)
		{
			console.log(inEvent)
			this.currentFeedSortOrder = inEvent.selected.value
			Preferences.setManualFeedSort(inEvent.selected.value == "manual")
			this.$.feedSortOrderPickerHeader.content = inEvent.selected.content
		}
	},

	setTheme: function(inSender, inEvent, $super) {
		if (inEvent.selected.value != this.currentTheme)
		{
			this.currentTheme = inEvent.selected.value
			Preferences.setTheme(inEvent.selected.value)
			this.$.themePickerHeader.content = inEvent.selected.content
			//TODO: Theme Handling
			//$super()
		}
	},

	setNotificationInterval: function() {
		Preferences.setNotificationInterval(this.notificationInterval.value)
		this.showAndHideStuff()
		this.controller.getSceneScroller().mojo.revealBottom()
	},

	setNotificationFeeds: function() {
		Preferences.setAnyOrSelectedFeedsForNotification(this.notificationFeeds.value)
		this.showAndHideStuff()
		this.controller.getSceneScroller().mojo.revealBottom()
	},

	setDebugging: function() {
		Preferences.setDebugging(this.$.debug.checked)
	},

	setMarkReadScroll: function() {
		Preferences.setMarkReadAsScroll(this.$.markReadScroll.checked)
	},

	selectFeeds: function() {
		this.controller.stageController.pushScene("notification-feeds")
	},

	weLoveLefties: function() {
		Preferences.setLeftyFriendly(Preferences.isLeftyFriendly() ? false : true)
		this.setLeftyClass()
	},

	handleGoBack: function() {
		if (this.originalNotificationInterval != Preferences.notificationInterval()) {
		  Mojo.Controller.getAppController().assistant.handleLaunch({action: "notificationIntervalChange"})
		}

		changes = {}

		if (this.originalAllowLandscape != Preferences.allowLandscape()) changes.allowLandscapeChanged = true
		if (this.originalSortOrder != Preferences.isOldestFirst()) changes.sortOrderChanged = true
		if (this.originalHideReadFeeds != Preferences.hideReadFeeds()) changes.hideReadFeedsChanged = true
		if (this.originalHideReadArticles != Preferences.hideReadArticles()) changes.hideReadArticlesChanged = true
		if (this.originalFontSize != Preferences.fontSize()) changes.fontSizeChanged = true
		if (this.originalFeedSortOrder != Preferences.isManualFeedSort()) changes.feedSortOrderChanged = true
		if (this.originalTheme != Preferences.getTheme()) changes.themeChanged = true
		if (this.originalFeedlySortEngagement != Preferences.isFeedlySortEngagement()) changes.sortOrderChanged = true

		this.controller.stageController.popScene(changes)
	},
});