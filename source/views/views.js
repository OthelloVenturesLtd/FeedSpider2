/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/
enyo.kind({
	name: "FeedSpider2.BasePanels",
	kind: "Panels",
	draggable: false,
	arrangerKind: "CardSlideInArranger",

	components: [		
		{name: "main", kind: "FeedSpider2.MainView", onSwitchPanels: "switchPanels"},
		{name: "folder", kind: "FeedSpider2.FolderView", onSwitchPanels: "switchPanels", onGoBack: "closePanel"},
		{name: "feed", kind: "FeedSpider2.FeedView", onSwitchPanels: "switchPanels", onGoBack: "closePanel"},
		{name: "article", kind: "FeedSpider2.ArticleView", onSwitchPanels: "switchPanels", onGoBack: "closePanel"},
		{name: "preferences", kind: "FeedSpider2.PreferencesView", onGoBack: "closePreferences", onSetTheme: "handleThemeChanged"},
		{name: "help", kind: "FeedSpider2.HelpView", onGoBack: "closePanel"}
	],
	
	create: function(){
		this.inherited(arguments);
		this.handleThemeChanged();
	},
	
	switchPanels: function(inSender, inEvent) {
		switch(inEvent.target) {
			case "folder":
				this.$.folder.setApi(inEvent.api);
				this.$.folder.setFolder(inEvent.folder);
				this.$.folder.setPreviousPage(inEvent.previousPage);
				this.$.folder.activate()
				this.setIndex(this.selectPanelByName("folder"))
				break;
			case "feed":
				this.$.feed.setApi(inEvent.api);
				this.$.feed.setSubscription(inEvent.subscription);
				this.$.feed.setPreviousPage(inEvent.previousPage);
				this.$.feed.activate()
				this.setIndex(this.selectPanelByName("feed"))
				break;
			case "article":
				this.$.article.setArticle(inEvent.article);
				this.$.article.setScrollingIndex(inEvent.scrollingIndex);
				this.$.article.setArticleContainer(inEvent.articleContainer);
				this.$.article.setPreviousPage(inEvent.previousPage);
				this.$.article.activate()
				this.setIndex(this.selectPanelByName("article"))
				break;
		}
	},
	
	openPreferences: function(inSender, inEvent) {
		this.$.preferences.setSources(this.sources)
		this.$.preferences.setPreviousPage(inEvent)
		this.setIndex(this.selectPanelByName("preferences"))
	},
	
	openHelp: function(inSender, inEvent) {
		this.$.help.setPreviousPage(inEvent)
		this.setIndex(this.selectPanelByName("help"))
	},
	
	closePreferences: function(inSender, inEvent) {
		//TODO: Handle Changes
		if (inEvent.changes.themeChanged)
		{
			this.handleThemeChanged()
		}
		this.setIndex(this.selectPanelByName(inEvent.lastPage.name))
	},
	
	closePanel: function(inSender, inEvent) {
		//TODO: Consider refactoring this to handle an object like closePreferences
		inEvent.activate()
		this.setIndex(this.selectPanelByName(inEvent.name))
	},
	
	handleThemeChanged: function() {
		var theme = Preferences.getTheme()
		this.removeClass("theme-dark");
		this.removeClass("theme-grey");
		this.removeClass("theme-light");
		
		this.addClass("theme-" + theme);
		
		this.$.preferences.setDialogTheme(theme);
	}
});