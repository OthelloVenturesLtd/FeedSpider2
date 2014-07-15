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
			{name: "errorIcon", kind: "onyx.Icon", src: "assets/error.png", style: "display: none"},
			{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "display: none"},
			{name: "refreshButton", kind: "onyx.IconButton", ontap: "switchPanels", src: "assets/refresh.png"}
		]},
		
		{name: "MainList", kind: "AroundList", fit: true, count: 0, style:"width: 100%;", onSetupItem: "setupItem", aboveComponents: [
			{name: "stickySources", kind: "enyo.FittableRows"},
			{name: "subscriptionsDivider", kind: "FeedSpider2.Divider", title: "Subscriptions", showing: false}	
		], components: [
			{name: "source", style: "width: 100%; border-bottom-width: 1px; border-bottom-style: groove", layoutKind: "enyo.FittableColumnsLayout", components: [
				{name: "sourceIcon", style: "height: 50px; width: 30px;"},
				{name: "sourceName", classes: "subscription-title", tag: "span", fit: true},
				{name: "sourceUnreadCount", classes: "subscription-count", tag: "span"}
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
    	this.api = inEvent; // Put this back when reinstating the login window.
    	this.sources = new AllSources(this.api);
    	this.parent.sources = this.sources
    	this.loaded = false;
    	this.showAddSubscription = true;
    	
    	this.reload()
    	return true;
  	},

	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.sources.subscriptionSources.items[i];
		
		this.$.sourceName.setContent(item.title);
		
		this.$.sourceIcon.addRemoveClass("subscription-folder", item.isFolder);
		this.$.sourceIcon.addRemoveClass("subscription-rss", !item.isFolder);

		if (item.unreadCount > 0)
    	{
    		this.$.sourceName.setStyle("font-weight: bold");
    		this.$.sourceUnreadCount.setStyle("float: right; font-weight: bold");
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

	refresh: function() {
		var self = this

		var refreshComplete = function() {
			self.refreshing = false
			//TODO: Event handling
			//Mojo.Event.send(document, Feeder.Event.refreshComplete, {sources: self.sources})
		}

		if(!self.refreshing) {
			self.refreshing = true
			self.sources.findAll(refreshComplete, refreshComplete)
		}
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
					//TODO: Causes Replication. Figure out better way of handling this behaviour.
					self.refreshList(self.$.stickySources, self.sources.stickySources.items)
					self.$.subscriptionsDivider.show()
					self.$.MainList.setCount(self.sources.subscriptionSources.items.length);
					//self.refreshList(self.$.MainList, self.sources.subscriptionSources.items)
					
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

	//BEGIN CODE TO BE PORTED
	sourcesReordered: function(event) {
		var beforeSubscription = null

		if(event.toIndex < this.sources.subscriptionSources.items.length - 1) {
			var beforeIndex = event.toIndex

			if(event.fromIndex < event.toIndex) {
				beforeIndex += 1
			}

			beforeSubscription = this.sources.subscriptionSources.items[beforeIndex]
		}

		this.sources.subscriptions.move(event.item, beforeSubscription)
	},

	sourceDeleted: function(event) {
		this.sources.subscriptions.remove(event.item)
	},

	divide: function(source) {
		return source.divideBy
	},	

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