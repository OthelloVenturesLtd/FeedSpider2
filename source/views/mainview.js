enyo.kind({
	name: "FeedSpider2.MainView",
	kind: "FittableRows",
	fit: true,
	
	events: {
		onSwitchPanels: "",
	},
	
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.MenuDecorator", components: [
				{kind: "onyx.IconButton", src: "assets/menu-icon.png"},
			    {kind: "onyx.Menu", components: [
        			//{kind: "onyx.MenuItem", content: "Add Subscription"},
        			//{name: "showHideFeedsMenuItem", kind: "onyx.MenuItem", ontap: "toggleFeeds"},
        			//{classes: "onyx-menu-divider"},
        			//{name: "preferencesMenuItem", kind: "onyx.MenuItem", ontap: "openPreferences", content: "Preferences"},
        			//{content: "Help"},
        			//{classes: "onyx-menu-divider"},
        			{content: "Logout"},
    			]}
			]},
			{tag: "span", content: "FeedSpider 2", style:"font-weight: bold; text-align: center", fit: true},
			{name: "errorIcon", kind: "onyx.Icon", src: "assets/error.png", style: "display: none"},
			{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "display: none"},
			{name: "refreshButton", kind: "onyx.IconButton", ontap: "switchPanels", src: "assets/refresh.png"}
		]},
		
		{name: "MainList", kind: "enyo.Scroller", fit: true, style: "background-color: #e6e3de; padding-top: 5px"},
		{name: "LoginDialog", kind: "FeedSpider2.LoginDialog", onLoginSuccess: "loginSuccess"}
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.credentials = new Credentials();
    	this.loaded = false;
    	this.reloading = false;
	},
	
	rendered: function() {
		this.inherited(arguments);
		if (Preferences.hideReadFeeds()){
			//this.$.showHideFeedsMenuItem.setContent("Show Read Feeds")
		}
		else
		{
			//this.$.showHideFeedsMenuItem.setContent("Hide Read Feeds")
		}
		//this.$.LoginDialog.show();
		this.checkCredentials();
	},
	
	loginSuccess: function(inSender, inEvent) {
    	this.$.LoginDialog.hide();
    	//this.api = inEvent; // Put this back when reinstating the login window.
    	this.sources = new AllSources(this.api);
    	this.loaded = false;
    	this.showAddSubscription = true;
    	
    	this.reload()
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
					//NOTE TO SELF: This will likely cause replication. Find a better way to structure and update the list.
					//TODO: Causes Replication. Figure out better way of handling this behaviour.
					self.refreshList(self.$.MainList, self.sources.stickySources.items)
			    	self.$.MainList.createComponent({kind: "FeedSpider2.Divider", title: "Subscriptions"})
					self.refreshList(self.$.MainList, self.sources.subscriptionSources.items)
					
					self.$.MainList.render()
					self.$.smallSpinner.hide()
					self.$.refreshButton.show()
				},

				this.showError.bind(this)
			)
		}
	},

  	refreshList: function(list, items) {
  	    for (var i = 0; i < items.length; i++) { 
    		if(i == items.length - 1)
    		{
    			items[i].last = true;
    		}
    		items[i].setContainer(list)	
    	}
    	//list.mojo.noticeUpdatedItems(0, items)
    	//list.mojo.setLength(items.length)
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

	toggleFeeds: function() {
		if (Preferences.hideReadFeeds()){
			this.$.showHideFeedsMenuItem.setContent("Hide Read Feeds")
			Preferences.setHideReadFeeds(false);
          	//this.reload();
          	this.filterAndRefresh();
		}
		else
		{
			this.$.showHideFeedsMenuItem.setContent("Show Read Feeds")
			Preferences.setHideReadFeeds(true);
          	//this.reload();
          	this.filterAndRefresh();
		}
	},

  	/* Begin TEMP Troubleshooting code */
  	checkCredentials: function() {
		this.credentials.service = "tor"
		this.credentials.email = "aressel@gmail.com"
		this.credentials.password = "BenchMonk3y"
					
		this.tryLogin();
	},
	
	tryLogin: function() {
		// Attempt login
    	this.api = new Api();
    	this.api.login(this.credentials, this.loginSuccess.bind(this), function(){});
	}
	/* End TEMP Troubleshooting Code */
  	
});