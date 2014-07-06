/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/
//TODO: Handle oauth provider logouts on "logout" capture the oauth provider used in the onpagechanged method of the oauth iframe
enyo.kind({
	name: "FeedSpider2.BasePanels",
	kind: "Panels",
	draggable: false,
	arrangerKind: "CardSlideInArranger",

	components: [		
		{name: "main", kind: "FeedSpider2.MainView"},
		{name: "folder", kind: "FeedSpider2.FolderView"},
		{name: "feed", kind: "FeedSpider2.FeedView"},
		{name: "article", kind: "FeedSpider2.ArticleView"},
		{name: "preferences", kind: "FeedSpider2.PreferencesView", onSetTheme: "handleThemeChanged"},
		{name: "help", kind: "FeedSpider2.HelpView"}
	],
	
	create: function(){
		this.inherited(arguments);
		this.handleThemeChanged();
		this.handleFontSizeChanged();
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
			case "preferences":
				this.$.preferences.setSources(this.sources)
				this.$.preferences.setPreviousPage(inEvent.previousPage)
				this.setIndex(this.selectPanelByName("preferences"))
				break;
			case "help":
				this.$.help.setPreviousPage(inEvent.previousPage)
				this.setIndex(this.selectPanelByName("help"))
				break;
		}
	},
	
	closePanel: function(inSender, inEvent) {
		if(inSender.name === "preferences")
		{
			if (inEvent.changes.themeChanged)
			{
				this.handleThemeChanged()
			}
		
			if (inEvent.changes.fontSizeChanged)
			{
				this.handleFontSizeChanged()
			}
		}

		inEvent.lastPage.activate()
		this.setIndex(this.selectPanelByName(inEvent.lastPage.name))
	},
	
	handleThemeChanged: function() {
		var theme = Preferences.getTheme()
		this.removeClass("theme-dark");
		this.removeClass("theme-grey");
		this.removeClass("theme-light");
		
		this.addClass("theme-" + theme);
		
		this.$.preferences.setDialogTheme(theme);
	},
	
	handleFontSizeChanged: function() {
		this.$.article.setFontSize(Preferences.fontSize());
	}
	
});