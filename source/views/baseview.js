enyo.kind({
	name: "FeedSpider2.BaseView",
	kind: "FittableRows",
	fit: true,

	published: {
		previousPage: "",
	},

	events: {
		onSwitchPanels: "switchPanels",
		onGoBack: "closePanel"
	},
	
	handlers: {
		onSourceTap: "sourceTapped",
	},
	
	openPreferences: function() {
		this.doSwitchPanels({target: "preferences", previousPage: this})
	},
	
	openHelp: function() {
		this.doSwitchPanels({target: "help", previousPage: this})
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

	toggleArticles: function() {
		Preferences.setHideReadArticles(!Preferences.hideReadArticles());
		this.activate({feedChanged: true})
	},

	addSubscription: function() {
		this.doSwitchPanels({target: "add", previousPage: this, api: this.api})
	},
	
	handleLogout: function() {
		//TODO: Implement
	},

  	refreshList: function(list, items) {
  	  	var listLength = list.controls.length
  	  	for (var i = 0; i < listLength; i++) { 
    		list.controls[0].last = false;
    		list.controls[0].setContainer(null);
    	}
  	    
  	    for (var i = 0; i < items.length; i++) { 
    		if(i == items.length - 1)
    		{
    			items[i].last = true;
    		}

    		items[i].setContainer(list);
    	}
  	},

	//TODO: BEGIN PORTING FROM HERE

	//TODO: Set up event handlers to trigger this when the top bar is tapped 
	scrollToTop: function() {
		this.controller.getSceneScroller().mojo.scrollTo(0, 0, true)
	},
	//TODO PORT TO HERE
})