/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/
enyo.kind({
	name: "FeedSpider2.Home",
	kind: "FittableRows",
	
	handlers: {
		onPopupMessage: "handlePopupMessage"
	},
	
	components: [
		{kind: "FeedSpider2.BasePanels", fit: true},
		{kind: "Notification", name: "notif"}
	],
	
	rendered: function(){
		this.inherited(arguments);
	},
	
	handlePopupMessage: function(inSender, inEvent) {
		this.$.notif.sendNotification({
			title: inEvent.title,
			theme: "notification.Firefox",
			stay: false,
			duration: 1
		})
		return true
	}
});

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
		{name: "help", kind: "FeedSpider2.HelpView"},
		{name: "add", kind: "FeedSpider2.AddView"}		
	],
	
	create: function(){
		this.inherited(arguments);
		this.handleThemeChanged();
		this.handleFontSizeChanged();
		this.handleOrientationChanged();
	},

	rendered: function(){
		this.inherited(arguments);
	},
	
	switchPanels: function(inSender, inEvent) {
		switch(inEvent.target) {
			case "folder":
				this.$.folder.setApi(inEvent.api);
				this.$.folder.setFolder(inEvent.folder);
				this.$.folder.setPreviousPage(inEvent.previousPage);
				this.setIndex(this.selectPanelByName("folder"));
				this.$.folder.activate();
				break;
			case "feed":
				this.$.feed.setApi(inEvent.api);
				this.$.feed.setSubscription(inEvent.subscription);
				this.$.feed.setPreviousPage(inEvent.previousPage);
				this.$.feed.activate({feedChanged: true});
				this.setIndex(this.selectPanelByName("feed"));
				break;
			case "article":
				this.$.article.setArticle(inEvent.article);
				this.$.article.setScrollingIndex(inEvent.scrollingIndex);
				this.$.article.setArticleContainer(inEvent.articleContainer);
				this.$.article.setPreviousPage(inEvent.previousPage);
				this.$.article.activate();
				this.setIndex(this.selectPanelByName("article"));
				break;
			case "preferences":
				this.$.preferences.setSources(this.sources);
				this.$.preferences.setPreviousPage(inEvent.previousPage);
				this.$.preferences.activate();
				this.setIndex(this.selectPanelByName("preferences"));
				break;
			case "help":
				this.$.help.setPreviousPage(inEvent.previousPage);
				this.setIndex(this.selectPanelByName("help"));
				break;
			case "add":
				this.$.add.setApi(inEvent.api);
				this.$.add.setPreviousPage(inEvent.previousPage);
				this.$.add.activate();
				this.setIndex(this.selectPanelByName("add"));
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
			
			if (inEvent.changes.allowLandscapeChanged)
			{
				this.handleOrientationChanged()
			}		
		}
		
		if(inSender.name === "add")
		{
			inEvent.lastPage.reload()
		}
		
		if(inSender.name === "preferences" && inEvent.lastPage.name === "feed")
		{
			this.setIndex(this.selectPanelByName(inEvent.lastPage.name))
			inEvent.lastPage.activate(inEvent.changes)
		}
		if(inSender.name === "article" && inEvent.lastPage.name === "feed")
		{
			this.setIndex(this.selectPanelByName(inEvent.lastPage.name))
			inEvent.lastPage.activate(inEvent.scrollingIndex)
		}
		else
		{
			this.setIndex(this.selectPanelByName(inEvent.lastPage.name))
			inEvent.lastPage.activate()
		}
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
	},
	
	handleOrientationChanged: function() {
		//Handle orientation for webOS Devices
		//TODO: Figure out how to handle orientation for other devices
		if (window.PalmSystem) {
			PalmSystem.setWindowOrientation(Preferences.allowLandscape() ? "free" : "up");
		}

		if (enyo.platform.firefoxOS) {
			if(Preferences.allowLandscape())
			{
				result = screen.mozUnlockOrientation();
			}
			else
			{
				result = screen.mozLockOrientation("portrait")
			}
		}
	}
	
});