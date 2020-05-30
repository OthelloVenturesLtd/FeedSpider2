enyo.kind({
	name: "FeedSpider2.BaseView",
	kind: "FittableRows",
	fit: true,

	style: "width: 100%;",

	published: {
		previousPage: "",
	},

	events: {
		onSwitchPanels: "switchPanels",
		onGoBack: "closePanel",
		onLogout: "logout",
	},
	
	handlers: {
		onSourceTap: "sourceTapped",
	},
	
	openPreferences: function() {
		this.doSwitchPanels({target: "preferences", previousPage: this});
	},
	
	openHelp: function() {
		this.doSwitchPanels({target: "help", previousPage: this});
	},
	
	toggleFeeds: function() {
		FeedSpider2.Preferences.setHideReadFeeds(!FeedSpider2.Preferences.hideReadFeeds());
		this.activate();
	},

	toggleArticles: function() {
		FeedSpider2.Preferences.setHideReadArticles(!FeedSpider2.Preferences.hideReadArticles());
		this.activate({feedChanged: true});
	},

	addSubscription: function() {
		this.doSwitchPanels({target: "add", previousPage: this, api: this.api});
	},
	
	handleLogout: function() {
		this.doLogout();
	},

	refreshList: function(list, items) {
		var listLength = list.controls.length;
		for (var i = 0; i < listLength; i++) { 
			list.controls[0].set("last", false);
			list.controls[0].setContainer(null);
		}
		
		for (var j = 0; j < items.length; j++) { 
			if(j == items.length - 1)
			{
				items[j].set("last", true);
			}

			items[j].setContainer(list);
		}
	},

	scrollToTop: function() {
		this.$.MainList.scrollToStart();
	}
});