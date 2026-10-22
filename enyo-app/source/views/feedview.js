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

	events: {
		onMassMarkAsRead: ""
	},
	
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.MenuDecorator", components: [
				{kind: "onyx.IconButton", src: "assets/menu-icon.png"},
				{kind: "onyx.Menu", floating: true, components: [
					{name: "showHideArticlesMenuItem", onSelect: "toggleArticles"},
					{classes: "onyx-menu-divider"},
					{name: "preferencesMenuItem", onSelect: "openPreferences"},
					{name: "helpMenuItem", onSelect: "openHelp"},
					{classes: "onyx-menu-divider"},
					{name: "logoutMenuItem", onSelect: "handleLogout"},
				]}
			]},
			{kind: "onyx.IconButton", src: "assets/go-back.png", ontap: "handleGoBack"},
			{name: "title", tag: "span", style:"font-weight: bold; text-align: center", fit: true, ontap: "scrollToTop"},
			{kind: "onyx.Icon"}, //This is here to keep the header centered.
			{name: "errorIcon", kind: "onyx.Icon", src: "assets/error.png", showing: false},
			{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", showing: false},
			{name: "markAllRead", kind: "onyx.IconButton", ontap: "markAllRead", src: "assets/mark-all-read.png"},
			{name: "placeholderIcon", kind: "onyx.Icon", showing: false}
		]},
		
		{name: "loadingSpinnerContainer", style: "width: 100%; margin-top: 15px; text-align: center;", showing: false, components: [
			{style: "display: inline-block;", components: [
				{name: "loadingSpinner", kind: "onyx.Spinner"},
			]}
		]},
		
		{name: "noArticles", style: "padding-top: 10px; padding-left: 10px; font-size 14px; font-weight: bold", showing: false},
		
		{name: "MainList", kind: "FeedSpider2.EventList", fit: true, count: 0, style:"width: 100%;", enableSwipe: true, percentageDraggedThreshold: 1.50, onSetupItem: "setupItem", onSetupSwipeItem: "setupSwipeItem", onSwipeAnimationComplete: "listItemRendered", onScroll: "scrollEvent", components: [
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
		]},
		{kind: enyo.Signals, onkeyup: "handleKeyUp"}
	],
	
	create: function() {
		this.inherited(arguments);
		this.loaded = false;
		this.reloading = false;
		this.swiping = false;
		this.loadingArticles = false;
		this.previousDate = "";
		this.$.preferencesMenuItem.setContent($L("Preferences"));
		this.$.helpMenuItem.setContent($L("Help"));
		this.$.logoutMenuItem.setContent($L("Logout"));
		this.$.noArticles.setContent($L("No articles were found"));
	},

	activate: function(changes_or_scroll) {
		if (FeedSpider2.Preferences.hideReadArticles()){
			this.$.showHideArticlesMenuItem.setContent($L("Show Read Articles"));
		}
		else
		{
			this.$.showHideArticlesMenuItem.setContent($L("Hide Read Articles"));
		}

		this.$.loadingSpinner.addRemoveClass("onyx-light", FeedSpider2.Preferences.getTheme() !== "dark");

		this.$.title.setContent(this.subscription.title);
		this.previousDate = "";
		this.$.placeholderIcon.hide();
		
		if(changes_or_scroll && (changes_or_scroll.sortOrderChanged || changes_or_scroll.hideReadArticlesChanged || changes_or_scroll.feedChanged)) {
			this.subscription.reset();
			this.$.MainList.setCount(0);
			this.$.MainList.refresh();
			this.findArticles(true);
			this.$.noArticles.set("showing", false);
			this.$.loadingSpinnerContainer.set("showing", true);
		}
		else {
			this.$.MainList.refresh();

			if("top" == changes_or_scroll) {
				this.$.MainList.scrollToTop();
			}
			else if("bottom" == changes_or_scroll) {
				this.$.MainList.scrollToBottom();
			}
			else if(parseInt(changes_or_scroll, 10)) {
				this.tappedIndex = this.tappedIndex + parseInt(changes_or_scroll, 10);
				this.$.MainList.scrollToRow(this.tappedIndex);
			}
		}
	},

	listItemRendered: function() {
		this.swiping = false;
		this.previousDate = "";
		this.$.MainList.refresh();
	},
	
	scrollEvent: function(inSender, inEvent) {
		if(this.subscription.continuation !== undefined && this.subscription.continuation !== false && (inEvent.scrollBounds.top >= inEvent.scrollBounds.maxTop - inEvent.scrollBounds.clientHeight) && this.loadingArticles === false)
		{
			this.findArticles();
		}
	},

	findArticles: function(scrollToTop) {
		this.$.markAllRead.hide();
		this.$.errorIcon.hide();
		this.$.smallSpinner.show();
		this.loadingArticles = true;
		this.subscription.findArticles(this.foundArticles.bind(this, scrollToTop || false), this.showError.bind(this));
	},

	foundArticles: function(scrollToTop) {
		if (this.subscription.continuation !== undefined && this.subscription.continuation !== false)
		{
			this.$.MainList.setCount(this.subscription.items.length + 1);
		}
		else
		{
			this.$.MainList.setCount(this.subscription.items.length);
		}

		if(scrollToTop) {
			this.$.MainList.scrollToStart();
		}

		this.loadingArticles = false;
		this.$.loadingSpinnerContainer.set("showing", false);
		this.$.smallSpinner.hide();
		this.$.errorIcon.hide();
		this.showMarkAllRead();
		this.showMessageIfEmpty();
		this.resize();
	},

	showMessageIfEmpty: function() {
		if(this.subscription.items.length) {
			this.$.noArticles.hide();
		}
		else {
			this.$.noArticles.show();
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

	handleKeyUp: function(inSender, inEvent) {
        if (this.showing && inEvent.keyCode === 27)
        {
        	this.handleGoBack();
        	if (enyo.platform.webos || window.PalmSystem)
        	{
        		inEvent.stopPropagation();
        		inEvent.preventDefault();
       			return -1;
       		}
        }
    },

	handleGoBack: function() {
		this.$.MainList.setCount(0);
		this.doGoBack({lastPage: this.previousPage});
	},	

	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.subscription.items[i];

		if(i == this.subscription.items.length)
		{
			this.$.articleName.setContent($L("Loading More Articles..."));
			this.$.articleName.setStyle("");
			this.$.articleOrigin.setStyle("display:none;");
			this.$.articleDivider.hide();
			return true;
		}
		
		this.$.articleName.setContent(Utils.decodeHtmlEntities(item.title));
		this.$.articleOrigin.setContent(Utils.decodeHtmlEntities(item.origin));
				
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
			this.$.starredIcon.show();
		}
		else
		{
			this.$.starredIcon.hide();
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
			this.$.articleDivider.hide();
		}
		else
		{
			this.$.dividerTitle.content = item.displayDate;
			this.$.articleDivider.show();
		}
		
		this.previousDate = item.sortDate;
		
		var nextItem = this.subscription.items[i+1];
		if (nextItem !== undefined)
		{
			if (item.sortDate == nextItem.sortDate)
			{
				this.$.borderContainer.setStyle("padding-top: 12px; width: 100%; border-bottom-width: 1px; border-bottom-style: groove");
			}
			else
			{
				this.$.borderContainer.setStyle("padding-top: 12px; width: 100%;");
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

		if(i == this.subscription.items.length)
		{
			this.$.MainList.swipeDragFinish();
			return true;
		}

		this.swiping = true;
        
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
			item.toggleRead();
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
			item.toggleStarred();   
		} 
	},
	
	articleTapped: function(inSender, inEvent) {
		if (this.swiping || inEvent.index == this.subscription.items.length)
		{
			return true;
		}
		var i = inEvent.index;
		var item = this.subscription.items[i];
		item.index = inEvent.index;
		
		this.tappedIndex = i;
		this.doSwitchPanels({target: "article", article: item, scrollingIndex: 0, articleContainer: this.subscription, previousPage: this});
		inEvent.preventDefault();
		return false;
	},

	showError: function() {
		this.$.loadingSpinnerContainer.set("showing", false);
		this.$.markAllRead.hide();
		this.$.smallSpinner.hide();
		this.$.placeholderIcon.hide();
		this.$.errorIcon.show();
	},

	markAllRead: function() {
		this.$.markAllRead.hide();
		this.$.errorIcon.hide();
		this.$.smallSpinner.show();
		var count = this.subscription.getUnreadCount();

		this.subscription.markSourceRead(
			function() {
				this.$.errorIcon.hide();
				this.$.smallSpinner.hide();
				this.showMarkAllRead();
				this.previousDate = "";
				this.$.MainList.refresh();

				this.doMassMarkAsRead({id: this.subscription.id, count: count});

				if(FeedSpider2.Preferences.goBackAfterMarkAsRead()) {
					this.handleGoBack();
				}
			}.bind(this),

			this.showError.bind(this)
		);
	},
});