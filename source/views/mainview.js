//TODO: handle activate/deactivate
enyo.kind({
	name: "FeedSpider2.MainView",
	kind: "FeedSpider2.BaseView",
	fit: true,
	
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.MenuDecorator", components: [
				{kind: "onyx.IconButton", src: "assets/menu-icon.png"},
			    {kind: "onyx.Menu", floating: true, components: [
        			{content: "Add Subscription", onSelect: "addSubscription"},
        			{name: "showHideFeedsMenuItem", onSelect: "toggleFeeds"},
        			{classes: "onyx-menu-divider"},
        			{content: "Preferences", onSelect: "openPreferences"},
        			{content: "Help", onSelect: "openHelp"},
        			{classes: "onyx-menu-divider"},
        			{content: "Logout", onSelect: "handleLogout"},
    			]}
			]},
			{tag: "span", content: "FeedSpider 2", style:"font-weight: bold; text-align: center", fit: true},
			{name: "errorIcon", kind: "onyx.Icon", src: "assets/error.png", style: "display: none", ontap: "reload"},
			{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "display: none"},
			{name: "refreshButton", kind: "onyx.IconButton", ontap: "switchPanels", src: "assets/refresh.png", ontap: "reload"}
		]},
		
		{name: "MainList", kind: "AroundList", fit: true, count: 0, style:"width: 100%;", reorderable: true, centerReorderContainer: false, enableSwipe: true, persistSwipeableItem: true, onSetupItem: "setupItem", onSetupReorderComponents: "setupReorderComponents", onSetupSwipeItem: "setupSwipeItem", onReorder: "sourcesReordered", aboveComponents: [
			{name: "stickySources", kind: "enyo.FittableRows"},
			{name: "subscriptionsDivider", kind: "FeedSpider2.Divider", title: "Subscriptions", showing: false}	
		], components: [
			{name: "source", style: "width: 100%; border-bottom-width: 1px; border-bottom-style: groove", ontap: "listSourceTapped" , layoutKind: "enyo.FittableColumnsLayout", components: [
				{name: "sourceIcon", style: "height: 50px; width: 30px;"},
				{name: "sourceName", classes: "subscription-title", tag: "span", fit: true},
				{name: "sourceUnreadCount", classes: "subscription-count", tag: "span"}
			]}
		],
		reorderComponents: [
			{name: "reorderContent", classes: "enyo-fit", layoutKind: "enyo.FittableColumnsLayout", style: "background:lightgrey;", components: [
				{name: "reorderIcon", style: "height: 50px; width: 30px;"},
				{name: "reorderName", classes: "subscription-title", style:"color: white;", tag: "span", fit: true},
				{name: "reorderUnreadCount", classes: "subscription-count", tag: "span"}
			]}
		],
		swipeableComponents: [
			{style: "height: 100%; background-color: darkgrey; text-align:center", components: [
				{kind: "onyx.Button", content: "Delete", style: "margin-top: 10px; margin-right: 10px;", classes:"onyx-negative", ontap: "deleteButtonTapped"},
				{kind: "onyx.Button", content: "Cancel", style: "margin-left: 10px;", ontap: "cancelButtonTapped"}
			]}
		]},
		{name: "LoginDialog", kind: "FeedSpider2.LoginDialog", onLoginSuccess: "loginSuccess"},
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.credentials = new Credentials();
    	this.loaded = false;
    	this.reloading = false;
	},
	
	rendered: function() {
		this.inherited(arguments);
		this.$.LoginDialog.show();
	},

	activate: function(changes) {
		if (Preferences.isManualFeedSort())
		{
			this.$.MainList.setReorderable(true)
		}
		else
		{
			this.$.MainList.setReorderable(false)
		}
		
		if (Preferences.hideReadFeeds()){
			this.$.showHideFeedsMenuItem.setContent("Show Read Feeds")
		}
		else
		{
			this.$.showHideFeedsMenuItem.setContent("Hide Read Feeds")
		}
		
		this.filterAndRefresh()
	},
	
	loginSuccess: function(inSender, inEvent) {
    	this.$.LoginDialog.hide();
    	this.api = inEvent;
    	this.sources = new AllSources(this.api);
    	this.parent.sources = this.sources
    	this.loaded = false;
    	this.showAddSubscription = true;
    	
    	this.reload()
    	this.activate()
    	return true;
  	},

	setupItem: function(inSender, inEvent) {
		console.log(this.$.stickySources)
		var i = inEvent.index;
		var item = this.sources.subscriptionSources.items[i];
		
		this.$.sourceName.setContent(item.title);
		
		this.$.sourceIcon.addRemoveClass("subscription-folder", item.isFolder);
		this.$.sourceIcon.addRemoveClass("subscription-rss", !item.isFolder);

		if (item.unreadCount > 0)
    	{
    		//The reason for this ugly hack on FirefoxOS is because using float:right will cause the count to be displayed
    		//on the next line of the list. We know that this will work because sticky sources is rendered first, and at 
    		//this point, we can guarantee the presence of at least one source.
    		if (enyo.platform.firefoxOS)
    		{
    			var width = this.$.stickySources.controls[0].controls[0].controls[1].domStyles.width;
    			var remainder = window.innerWidth - parseInt(width) - 70; //This is calculated by taking window width less width of the all items title column, less 30px for the icon and 40px for the margins.
    			this.$.sourceName.setStyle("width:" + width + "; font-weight: bold");
    			this.$.sourceUnreadCount.setStyle("width:" + remainder + "px; text-align: right; font-weight: bold");
    		}
    		else
    		{
    			this.$.sourceName.setStyle("font-weight: bold");
    			this.$.sourceUnreadCount.setStyle("float: right; font-weight: bold");
    		}
    		this.$.sourceUnreadCount.setContent(item.unreadCount); 		
    	} 
		else
		{
    		this.$.sourceName.setStyle("");
    		this.$.sourceUnreadCount.setStyle("");
			this.$.sourceUnreadCount.setContent("");
			this.$.sourceUnreadCount.hide();
		}
		
		return true;
	},

	setupReorderComponents: function(inSender, inEvent) {
		var i = inEvent.index;
		if(!this.sources.subscriptionSources.items[i]) {
			return;
		}

		var item = this.sources.subscriptionSources.items[i];
		this.$.reorderName.setContent(item.title);
		
		this.$.reorderIcon.addRemoveClass("subscription-folder", item.isFolder);
		this.$.reorderIcon.addRemoveClass("subscription-rss", !item.isFolder);

		if (item.unreadCount > 0)
    	{
    		//The reason for this ugly hack on FirefoxOS is because using float:right will cause the count to be displayed
    		//on the next line of the list. We know that this will work because sticky sources is rendered first, and at 
    		//this point, we can guarantee the presence of at least one source.
    		if (enyo.platform.firefoxOS)
    		{
    			var width = this.$.stickySources.controls[0].controls[0].controls[1].domStyles.width;
    			var remainder = window.innerWidth - parseInt(width) - 70; //This is calculated by taking window width less width of the all items title column, less 30px for the icon and 40px for the margins.
    			this.$.reorderName.setStyle("width:" + width + "; font-weight: bold");
    			this.$.reorderUnreadCount.setStyle("width:" + remainder + "px; text-align: right; font-weight: bold");
    		}
    		else
    		{
    			this.$.reorderName.setStyle("font-weight: bold");
    			this.$.reorderUnreadCount.setStyle("float: right; font-weight: bold");
    		}
    		this.$.reorderUnreadCount.setContent(item.unreadCount); 		
    	} 
		else
		{
    		this.$.reorderName.setStyle("");
    		this.$.reorderUnreadCount.setStyle("");
			this.$.reorderUnreadCount.setContent("");
			this.$.reorderUnreadCount.hide();
		}
		
		return true;
	},

	setupSwipeItem: function(inSender, inEvent) {
        // because setting it on the list itself fails:
        this.$.MainList.setPersistSwipeableItem(true);
        this.activeItem = inEvent.index;
    },

	reload: function() {
		var self = this

		if(!self.reloading) {
			self.reloading = true
			this.$.refreshButton.hide()
			this.$.errorIcon.hide()
			this.$.smallSpinner.show()

			self.sources.findAll(
				function() {
					self.reloading = false
					self.loaded = true
					self.filterAndRefresh()
				}.bind(this),

				function() {
					this.showError()
				}.bind(this)
			)
		}
	},

	filterAndRefresh: function() {
		var self = this
		if(self.loaded) {
			self.sources.sortAndFilter(
				function() {
					self.refreshList(self.$.stickySources, self.sources.stickySources.items)
					self.$.subscriptionsDivider.show()
					self.$.MainList.setCount(self.sources.subscriptionSources.items.length);
					
			   		self.$.stickySources.render();
					self.$.MainList.render()
					self.$.smallSpinner.hide()
					self.$.refreshButton.show()
				},

				this.showError.bind(this)
			)
		}
	},

	showError: function() {
		this.reloading = false
		this.loaded = false
		this.$.refreshButton.hide()
		this.$.errorIcon.show()
		this.$.smallSpinner.hide()
	},
	
	switchPanels: function() {
		this.doSwitchPanels(this)
	},
	
	sourceTapped: function(inSender, inEvent) {
		if(inEvent.isFolder && !Preferences.combineFolders()) {
			this.doSwitchPanels({target: "folder", api: this.api, folder: inEvent, previousPage: this})
		}
		else {
			this.doSwitchPanels({target: "feed", api: this.api, subscription: inEvent, previousPage: this})
		}
		return true
	},
	
	listSourceTapped: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.sources.subscriptionSources.items[i];
		if(item.isFolder && !Preferences.combineFolders()) {
			this.doSwitchPanels({target: "folder", api: this.api, folder: item, previousPage: this})
		}
		else {
			this.doSwitchPanels({target: "feed", api: this.api, subscription: item, previousPage: this})
		}
		return true
	},

    deleteButtonTapped: function(inSender, inEvent) {
        this.$.MainList.setPersistSwipeableItem(false);
        this.sourceDeleted(this.activeItem); 
        this.$.MainList.completeSwipe();
   		this.$.MainList.setCount(this.sources.subscriptionSources.items.length);
   		this.$.stickySources.render();
   		this.$.MainList.refresh();
    },

    cancelButtonTapped: function(inSender, inEvent) {
        this.$.MainList.setPersistSwipeableItem(false);
        this.$.MainList.completeSwipe()
    },

	sourceDeleted: function(event) {
		var unreadCount = (this.sources.subscriptionSources.items[event].unreadCount)
		this.sources.subscriptions.remove(this.sources.subscriptionSources.items[event])
		this.sources.subscriptionSources.items = enyo.clone(this.sources.subscriptions.items)
		this.sources.all.decrementUnreadCountBy(unreadCount)
	},

	sourcesReordered: function(inSender, inEvent) {
		var beforeSubscription = null

		if(inEvent.reorderTo < this.sources.subscriptionSources.items.length - 1) {
			var beforeIndex = inEvent.reorderTo

			if(inEvent.reorderFrom < inEvent.reorderTo) {
				beforeIndex += 1
			}

			beforeSubscription = this.sources.subscriptionSources.items[beforeIndex]
		}

		this.sources.subscriptions.move(this.sources.subscriptionSources.items[inEvent.reorderFrom], beforeSubscription)
		this.sources.subscriptionSources.items = enyo.clone(this.sources.subscriptions.items)
		this.$.MainList.refresh()
	},

	//BEGIN CODE TO BE PORTED
	articleRead: function(event) {
		Log.debug("1 item marked read in " + event.subscriptionId)
		this.sources.articleRead(event.subscriptionId)
		//TODO: Check Active Panel
		if(this.active) this.filterAndRefresh()
	},

	articleNotRead: function(event) {
		Log.debug("1 item marked not read in " + event.subscriptionId)
		this.sources.articleNotRead(event.subscriptionId)
		//TODO: Check Active Panel
		if(this.active) this.filterAndRefresh()
	},

	markedAllRead: function(event) {
		Log.debug(event.count + " items marked read in " + event.id)

		if(event.id == "user/-/state/com.google/reading-list") {
			this.sources.nukedEmAll()
		}
		else {
			this.sources.markedAllRead(event.count)
		}

		this.filterAndRefresh()
	},

	folderDeleted: function() {
		this.reload()
	},

	//END CODE TO BE PORTED
});