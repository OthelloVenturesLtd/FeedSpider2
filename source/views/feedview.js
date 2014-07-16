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
			{name: "markAllRead", kind: "onyx.IconButton", ontap: "switchPanels", src: "assets/mark-all-read.png"}
		]},
		
		{name: "MainList", kind: "List", fit: true, count: 0, style:"width: 100%;", enableSwipe: true, onSetupItem: "setupItem", onSetupSwipeItem: "setupSwipeItem", components: [
			{name: "source", layoutKind: enyo.FittableRowsLayout, noStretch: true, ontap: "articleTapped", components: [
				{name: "articleDivider", tag: "table", classes: "divider", style: "width: 100%", components: [
					{tag: "tr", components: [
						{name: "left", tag: "td", classes: "labeled-left"},
						{name: "dividerTitle", tag: "td", classes: "label", style:"white-space: nowrap; font-weight: bold; width: 1%; padding-left: 5px; padding-right: 5px"},
						{tag: "td", classes: "labeled-right"},
					]}
				]},	
				{name: "articleName", tag: "span", classes: "article-title"},
				{layoutKind: "FittableColumnsLayout", components: [
					{name: "starredIcon", tag: "div", showing: false, style:"background: url('assets/starred-grey.png') no-repeat left bottom; width: 16px; height: 24px; margin-left: 10px;"},
					{name: "articleOrigin", classes: "article-origin", style: "display:none;"},
				]},
				{name: "borderContainer"}
			]}
		],
		swipeableComponents: [
			{style: "height: 100%; background-color: darkgrey; text-align:center", components: [
				{kind: "onyx.Button", content: "Delete", style: "margin-top: 10px; margin-right: 10px;", classes:"onyx-negative", ontap: "deleteButtonTapped"},
				{kind: "onyx.Button", content: "Cancel", style: "margin-left: 10px;", ontap: "cancelButtonTapped"}
			]}
		]},
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.loaded = false;
    	this.reloading = false;
	},

	activate: function(changes_or_scroll) {
		//$super(changes_or_scroll)
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
		}

		if(Preferences.markReadAsScroll()) {
			if(!this.markingReadAsScroll) {
				this.scroller.observe(Mojo.Event.dragging, this.scrolling)
				this.markingReadAsScroll = true
			}
		}
		else {
			//this.scroller.stopObserving(Mojo.Event.dragging, this.scrolling)
		}*/

		//if(!this.subscription.disableSearch) {this.listenForSearch()}
	},

	findArticles: function(scrollToTop) {
		this.$.markAllRead.hide()
		this.$.errorIcon.hide()
		this.$.smallSpinner.show()	
		this.subscription.findArticles(this.foundArticles.bind(this, scrollToTop || false), this.showError.bind(this))	
	},

	foundArticles: function(scrollToTop) {
		//this.refreshList(this.$.MainList, this.subscription.items)
		this.$.MainList.setCount(this.subscription.items.length)
		this.$.MainList.refresh()
		if(scrollToTop) {
			this.$.MainList.scrollToStart()
		}

		this.$.smallSpinner.hide()
		this.$.errorIcon.hide()
		this.showMarkAllRead()
		//this.showMessageIfEmpty()
	},

	//TODO: Implement in an enyo-y manner
	showMessageIfEmpty: function() {
		if(this.subscription.items.length) {
			var noItems = this.controller.sceneElement.querySelector(".no-items")
			if(noItems) {noItems.remove()}
		}
		else {
			if(this.controller.sceneElement.select(".no-items").length == 0) {
				this.controller.sceneElement.insert("<div class=\"no-items\">" + $L("No articles were found") + "</div>")
			}
		}
	},

	showMarkAllRead: function() {
		//TODO: see about changing icon source instead of show/hide to preserve spacing
		if (this.subscription.canMarkAllRead) 
		{
			this.$.markAllRead.show()	
		}
		else
		{
			this.$.markAllRead.hide()
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

//TODO: Port from here
	articleTapped: function(inSender, inEvent) {
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

	divide: function(article) {
		return article.sortDate
	},

	itemRendered: function(listWidget, itemModel, itemNode) {
		this.subscription.highlight(itemNode.down(".article-title"))
		var origin
		itemModel._itemNode = itemNode

		if(itemModel.load_more) {
			this.findArticles()
		}
		else {
			if(!itemModel.isRead) {
				itemNode.addClassName("unread")
			}

			if(itemModel.isStarred) {
				itemNode.addClassName("starred")
				origin = itemNode.down(".article-origin")
				origin.update("&nbsp;")
				origin.show()
			}

			if(this.subscription.showOrigin) {
				origin = itemNode.down(".article-origin")
				origin.update(itemModel.origin)
				origin.show()
			}
		}
	},

	scrolling: function() {
		var scrollPosition = this.scroller.mojo.getScrollPosition()
		var theBottom = scrollPosition.top - this.scroller.offsetHeight
		var markAllRead = true
		var item, i

		for(i = 0; i < this.subscription.items.length; i++) {
			item = this.subscription.items[i]

			if(!item._itemNode) {
				markAllRead = false
				break
			}

			if(this.scroller.offsetTop - item._itemNode.offsetTop - item._itemNode.offsetHeight < theBottom) {
				markAllRead = false
				break
			}
		}

		for(i = 0; i < this.subscription.items.length; i++) {
			item = this.subscription.items[i]

			if(item._itemNode && (item._itemNode.offsetTop + scrollPosition.top < this.articlesTop || markAllRead) && !item.isRead && !item.keepUnread) {
				item.turnReadOn(function() {}, function() {})
				item._itemNode.removeClassName("unread")
			}
		}
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

	_getNodeFrom: function(event) {
		return event.target.up(".palm-row")
	},

	dragStart: function(event) {
		if(Math.abs(event.filteredDistance.x) > 2 * Math.abs(event.filteredDistance.y)) {
			var node = this._getNodeFrom(event)

			Mojo.Drag.setupDropContainer(node, this)

			node._dragger = Mojo.Drag.startDragging(
				this.controller,
				node,
				event.down,
				{
		  			preventVertical: true,
		  			draggingClass: "palm-delete-element",
		  			preventDropReset: false
				}
			)

			event.stop()
		}
	},

	dragEnter: function(item) {
		this.dragHeight = item.getHeight()
		this.dragAdjNode = undefined
		this.insertSpacer(item)
	},

	dragHover: function(element) {
		var spacer = element._spacer
		spacer.setAttribute("class", "palm-swipe-container");

		spacer.addClassName(element.offsetLeft > 0 ? "swipe-right" : "swipe-left")
		spacer.addClassName(element._mojoListItemModel.isRead ? "swipe-read" : "swipe-not-read")
		spacer.addClassName(element._mojoListItemModel.isStarred ? "swipe-starred" : "swipe-not-starred")

		element._toggleRead = element.offsetLeft > 50
		element._toggleStarred = element.offsetLeft < -50

		if(element._toggleRead) {
			spacer.toggleClassName("swipe-read")
			spacer.toggleClassName("swipe-not-read")
		}

		if(element._toggleStarred) {
			spacer.toggleClassName("swipe-starred")
			spacer.toggleClassName("swipe-not-starred")
		}
	},

	dragDrop: function(element) {
		element._dragger.resetElement()
		delete element._dragger

		element._spacer.remove()
		delete element._spacer

		if(element._toggleRead) {
			element._mojoListItemModel.toggleRead()
			this.refreshList(this.controller.get("articles"), this.subscription.items)
		}

		if(element._toggleStarred) {
			element._mojoListItemModel.toggleStarred()
			this.refreshList(this.controller.get("articles"), this.subscription.items)
		}
	},

	insertSpacer: function(itemNode) {
		var spacer = this.spacerTemplate.cloneNode(true)
		itemNode.insert({before: spacer})
		itemNode._spacer = spacer

		var height = Element.getHeight(itemNode) + 'px'
		spacer.style.height = height

		var heightNodes = spacer.querySelectorAll("div[x-mojo-set-height]")

		for(var i = 0; i < heightNodes.length; i++) {
			heightNodes[i].style.height = height
		}
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