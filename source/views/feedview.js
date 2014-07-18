enyo.kind({
	name: "FeedSpider2.FeedView",
	kind: "FeedSpider2.BaseView",
	fit: true,

	published: {
		api: "",
		subscription: "",
	},
	
	handlers: {
		onArticleTap: "articleTapped",
	},
	
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.MenuDecorator", components: [
				{kind: "onyx.IconButton", src: "assets/menu-icon.png"},
			    {kind: "onyx.Menu", floating: true, components: [
        			{name: "showHideArticlesMenuItem", onSelect: "toggleArticles"},
        			{classes: "onyx-menu-divider"},
        			{content: "Preferences", onSelect: "openPreferences"},
        			{content: "Help", onSelect: "openHelp"},
        			{classes: "onyx-menu-divider"},
        			{content: "Logout", onSelect: "handleLogout"},
    			]}
			]},
			{kind: "onyx.IconButton", src: "assets/go-back.png", ontap: "handleGoBack"},
			{name: "title", tag: "span", style:"font-weight: bold; text-align: center", fit: true},
			{kind: "onyx.Icon"}, //This is here to keep the header centered.
			{name: "errorIcon", kind: "onyx.Icon", src: "assets/error.png", style: "display: none"},
			{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "display: none"},
			{name: "markAllRead", kind: "onyx.IconButton", ontap: "switchPanels", src: "assets/mark-all-read.png"},
			{name: "placeholderIcon", kind: "onyx.Icon", showing: false}
		]},
		
		{name: "noArticles", content: "No articles were found", style: "padding-top: 10px; padding-left: 10px; font-size 14px; font-weight: bold", showing: false},
		
		{name: "MainList", kind: "enyo.List", fit: true, count: 0, style:"width: 100%;", enableSwipe: true, onSetupItem: "setupItem", onSetupSwipeItem: "setupSwipeItem", onSwipeComplete: "completeSwipeItem", components: [
			{name: "source", layoutKind: enyo.FittableRowsLayout, ontap: "articleTapped", components: [
				{name: "articleDivider", tag: "table", classes: "divider", style: "width: 100%", components: [
					{tag: "tr", components: [
						{name: "left", tag: "td", classes: "labeled-left"},
						{name: "dividerTitle", tag: "td", classes: "label", style:"white-space: nowrap; font-weight: bold; width: 1%; padding-left: 5px; padding-right: 5px"},
						{tag: "td", classes: "labeled-right"},
					]}
				]},	
				{style: "padding-top: 10px; padding-left: 10px", components: [
					{name: "articleName", tag: "span", classes: "article-title"},
					{layoutKind: "FittableColumnsLayout", components: [
						{name: "starredIcon", tag: "div", showing: false, style:"background: url('assets/starred-grey.png') no-repeat left bottom; width: 16px; height: 24px; margin-right: 10px;"},
						{name: "articleOrigin", classes: "article-origin", style: "display:none;"},
					]},
				]},
				{name: "borderContainer"}
			]}
		],
		swipeableComponents: [
			{name: "swipeContainer", layoutKind: "enyo.FittableColumnsLayout", style: "background-color: darkgrey; height: 100%", components: [
				{name: "articleStarredIcon", style: "height: 100%; width: 30px; margin-left: 10px; background: url(assets/swipe-starred-on.png) center center no-repeat;"},
				{name: "swipeSpacer"},
				{name: "articleReadIcon", style: "height: 100%; width: 30px; margin-right: 10px; background: url(assets/swipe-read-on.png) center center no-repeat;"},
			]}
		]}
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.loaded = false;
    	this.reloading = false;
    	this.swiping = false;
	},

	activate: function(changes_or_scroll) {
		if (Preferences.hideReadArticles()){
			this.$.showHideArticlesMenuItem.setContent("Show Read Articles")
		}
		else
		{
			this.$.showHideArticlesMenuItem.setContent("Hide Read Articles")
		}

		this.$.title.setContent(this.subscription.title)
		this.subscription.reset()
		this.previousDate = "";
		this.findArticles()

		/*if(changes_or_scroll && (changes_or_scroll.sortOrderChanged || changes_or_scroll.hideReadArticlesChanged)) {
			this.subscription.reset()
			this.findArticles(true)
		}
		else {
			this.refreshList(this.$.MainList, this.subscription.items)

			if("top" == changes_or_scroll) {
				this.controller.getSceneScroller().mojo.revealTop()
			}
			else if("bottom" == changes_or_scroll) {
				this.controller.getSceneScroller().mojo.revealBottom()
			}
			else if(parseInt(changes_or_scroll, 10)) {
				this.tappedIndex = this.tappedIndex + parseInt(changes_or_scroll, 10)
				this.controller.get("articles").mojo.revealItem(this.tappedIndex, true)
			}
		}*/
	},

	findArticles: function(scrollToTop) {
		this.$.markAllRead.hide()
		this.$.errorIcon.hide()
		this.$.smallSpinner.show()	
		this.subscription.findArticles(this.foundArticles.bind(this, scrollToTop || false), this.showError.bind(this))	
	},

	foundArticles: function(scrollToTop) {
		this.$.MainList.setCount(this.subscription.items.length)
		this.$.MainList.refresh()
		this.resized();
		if(scrollToTop) {
			this.$.MainList.scrollToStart()
		}

		this.$.smallSpinner.hide()
		this.$.errorIcon.hide()
		this.showMarkAllRead()
		this.showMessageIfEmpty()
	},

	showMessageIfEmpty: function() {
		if(this.subscription.items.length) {
			this.$.noArticles.hide()
		}
		else {
			this.$.noArticles.show()
		}
	},

	showMarkAllRead: function() {
		if (this.subscription.canMarkAllRead) 
		{
			this.$.markAllRead.show();
			this.$.placeholderIcon.hide();
		}
		else
		{
			this.$.markAllRead.hide();
			this.$.placeholderIcon.show();
		}
	},

	handleGoBack: function() {
		this.$.MainList.setCount(0)
		this.doGoBack({lastPage: this.previousPage})
	},	

	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.subscription.items[i];

		this.$.articleName.setContent(item.title);
		this.$.articleOrigin.setContent(item.origin);
				
		if (!item.isRead)
    	{
    		this.$.articleName.setStyle("font-weight: bold");	
    	}
    	else
    	{
    		this.$.articleName.setStyle("");
    	}
    	
    	if (item.isStarred)
    	{
    		this.$.starredIcon.show()
    	}
    	else
    	{
    		this.$.starredIcon.hide()
    	}
		
		if (item.subscription.showOrigin)
    	{
    		if (!item.isRead)
    		{
    			this.$.articleOrigin.setStyle("font-weight: bold");
    		}
    		else
    		{
    			this.$.articleOrigin.setStyle("");
    		}
    	}
    	else
    	{
    		this.$.articleOrigin.setStyle("display:none;");
    	}
		
		if (item.sortDate == this.previousDate)
		{
			this.$.articleDivider.hide()
		}
		else
		{
			this.$.dividerTitle.content = item.displayDate
			this.$.articleDivider.show()
		}
		
		this.previousDate = item.sortDate
		
		var nextItem = this.subscription.items[i+1];
		if (nextItem != undefined)
		{
			if (item.sortDate == nextItem.sortDate)
			{
				this.$.borderContainer.setStyle("padding-top: 12px; width: 100%; border-bottom-width: 1px; border-bottom-style: groove");
			}
			else
			{
				this.$.borderContainer.setStyle("padding-top: 12px; width: 100%;")
			}
		}
		else
		{
			this.$.borderContainer.setStyle("padding-top: 12px; width: 100%; border-bottom-width: 1px; border-bottom-style: groove");
		}
		
		return true;
	},

	setupSwipeItem: function(inSender, inEvent) {
        var i = inEvent.index;
		var item = this.subscription.items[i];
        
        if (inEvent.xDirection == 1)
        {
        	var remainder = window.innerWidth - 50;
        	this.$.swipeSpacer.setStyle("width: " + remainder + "px");
        	
        	if (item.isRead) 
        	{
        		this.$.articleReadIcon.setStyle("height: 100%; width: 30px; margin-right: 10px; background: url(assets/swipe-read.png) center center no-repeat;");
        	}
        	else 
        	{
        		this.$.articleReadIcon.setStyle("height: 100%; width: 30px; margin-right: 10px; background: url(assets/swipe-read-on.png) center center no-repeat;");
        	}
        	
        	this.$.articleStarredIcon.hide();
        	this.$.articleReadIcon.show();
        }
        if (inEvent.xDirection == -1)
        {
           	if (item.isStarred) 
        	{
        		this.$.articleStarredIcon.setStyle("height: 100%; width: 30px; margin-left: 10px; background: url(assets/swipe-starred.png) center center no-repeat;");
        	}
        	else 
        	{
        		this.$.articleStarredIcon.setStyle("height: 100%; width: 30px; margin-left: 10px; background: url(assets/swipe-starred-on.png) center center no-repeat;");
        	}
        	
        	this.$.articleReadIcon.hide();
        	this.$.articleStarredIcon.show();      
        } 
    },

	completeSwipeItem: function(inSender, inEvent) {
        var i = inEvent.index;
		var item = this.subscription.items[i];
		
        if (inEvent.xDirection == 1)
        {
           	item.toggleRead();
        }        
        else if (inEvent.xDirection == -1)
        {
        	item.toggleStarred();
        }
        this.$.MainList.refresh();
    },
	
//TODO: Port from here
	articleTapped: function(inSender, inEvent) {
		if (this.$.MainList.isSwiping)
		{
			return true;
		}
		var i = inEvent.index;
		var item = this.subscription.items[i];
		
		this.tappedIndex = i
		this.doSwitchPanels({target: "article", article: item, scrollingIndex: 0, articleContainer: this.subscription, previousPage: this})
		/*if(!event.item.load_more) {
			event.item.index = event.index
			this.tappedIndex = event.index
			this.controller.stageController.pushScene("article", event.item, 0, this.subscription)
		}*/
	},

	markAllRead: function() {
		this.controller.get("mark-all-read").hide()
		this.smallSpinnerOn()
		var count = this.subscription.getUnreadCount()

		this.subscription.markAllRead(
			function() {
				this.smallSpinnerOff()
				this.showMarkAllRead()
				this.refreshList(this.controller.get("articles"), this.subscription.items)
				Mojo.Event.send(document, "MassMarkAsRead", {id: this.subscription.id, count: count})

				if(Preferences.goBackAfterMarkAsRead()) {
	 				this.controller.stageController.popScene()
				}
			}.bind(this),

			this.showError.bind(this)
		)
	},

	showError: function() {
		this.$.markAllRead.hide()
		this.$.smallSpinner.hide()
		this.$.errorIcon.show()
	},

	refresh: function() {
		if(!self.refreshing) {
			this.subscription.reset()
			this.controller.modelChanged(this.subscription)
			this.refreshing = true
			this.controller.get("mark-all-read").hide()
			this.controller.get("error-header").hide()
			this.smallSpinnerOn()
			Mojo.Event.send(document, Feeder.Event.refreshWanted, {})
		}
	},

	refreshComplete: function() {
		this.refreshing = false
		this.reload()
	}
});