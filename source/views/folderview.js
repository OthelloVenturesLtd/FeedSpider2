enyo.kind({
	name: "FeedSpider2.FolderView",
	kind: "FeedSpider2.BaseView",
	fit: true,
	
	published: {
		api: "",
		folder: "",
		subscriptions: {items: []}
	},
	
	components:[
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.MenuDecorator", ontap: "openHelp", components: [
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
			{kind: "onyx.IconButton", src: "assets/go-back.png", ontap: "handleGoBack"},
			{name: "title", tag: "span", style:"font-weight: bold; text-align: center", fit: true},
			{kind: "onyx.Icon"}, //This is here to keep the header centered.
			{name: "errorIcon", kind: "onyx.Icon", src: "assets/error.png", style: "display: none"},
			{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "display: none"},
			{name: "refreshButton", kind: "onyx.IconButton"}
		]},
		
		{name: "MainList", kind: "enyo.Scroller", fit: true, style: "background-color: #e6e3de; padding-top: 5px"},
	],
	
  	create: function() {
    	this.inherited(arguments);
    	//this.setupSearch()
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
	},

	activate: function(changes) {
		this.$.title.setContent(this.folder.title)
		this.filterAndRefresh()
		//this.listenForSearch()
	},

	filterAndRefresh: function() {
		this.filter()
		this.refreshList(this.$.MainList, this.folder.stickySubscriptions)
		this.refreshList(this.$.MainList, this.subscriptions.items)
		if(!this.subscriptions.items.length) {
			//TODO: Trigger goback
			//this.controller.stageController.popScene()
		}
		this.$.MainList.render()
	},

	filter: function() {
		this.subscriptions.items.clear()

		this.folder.subscriptions.items.each(function(subscription) {
			if(subscription.unreadCount || !Preferences.hideReadFeeds()) {
				this.subscriptions.items.push(subscription)
			}
		}.bind(this))
	},

	sourceTapped: function(inSender, inEvent) {
		//this.controller.stageController.pushScene("articles", this.api, event.item)
	},

//PORT FROM HERE
	folderRendered: function(listWidget, itemModel, itemNode) {
		if(itemModel.constructor == Folder) {
			itemNode.down(".folder-title").update($L("All"))
		}

		if(itemModel.unreadCount) {
			itemNode.addClassName("unread")
		}
	},

	sourcesReordered: function(event) {
		var beforeSubscription = null

		if(event.toIndex < this.subscriptions.items.length - 1) {
			var beforeIndex = event.toIndex

			if(event.fromIndex < event.toIndex) {
				beforeIndex += 1
			}

			beforeSubscription = this.subscriptions.items[beforeIndex]
		}

		this.folder.subscriptions.move(event.item, beforeSubscription)
	},

	sourceDeleted: function(event) {
		this.folder.subscriptions.remove(event.item)
	},

	doSearch: function(query) {
		if(this.api.supportsSearch())
		{
			this.controller.stageController.pushScene("articles", this.api, new Search(this.folder.api, query, this.folder.id))
		}
		else
		{
			Feeder.notify($L("Search Not Available"))
		}
	},

	refresh: function() {
		if(!self.refreshing) {
			this.refreshing = true
			this.smallSpinnerOn()
			Mojo.Event.send(document, Feeder.Event.refreshWanted, {})
		}
	},

	refreshComplete: function(event) {
		var self = this
		this.refreshing = false

		event.sources.subscriptions.items.each(function(subscription) {
			if(self.folder.id == subscription.id) {
				self.folder = subscription
				throw $break
			}
		})

		this.filterAndRefresh()
		this.smallSpinnerOff()
	},
	
	handleGoBack: function() {
		this.doGoBack(this.previousPage)
	},	
});