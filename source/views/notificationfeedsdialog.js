enyo.kind({
	name: "FeedSpider2.NotificationFeedsDialog",
	kind: "onyx.Popup",
	modal: false,
	autoDismiss: false,
	floating: true,
	centered: true,
	scrim: true,
	
	style: "padding-top: 20px; padding-left: 20px; padding-right: 20px;  padding-bottom: 20px; height: 60%; width: 60%; text-align: center;",
	
	published: {
		sources: "",
	},
	
	events: {
		onComplete: "",	
	},
	
	components: [
		{layoutKind: "FittableRowsLayout", style: "height: 100%", components: [
			{name: "FeedsList", kind: "enyo.Scroller", style: "background-color: #e6e3de; border-radius: 5px;", fit: true},
			{name: "FeedsListButton", kind: "onyx.Button", content: "Done", classes: "onyx-affirmative", style: "width:50%; margin-top: 5px;", ontap: "closeDialog"},
		]}
	],
	
  	create: function() {
    	this.inherited(arguments);
	},
	
	closeDialog: function(){
		this.doComplete();
	},
	
	show: function(){
    	var watchedFeeds = Preferences.getWatchedFeeds()
		var self = this
		
		this.sources.subscriptions.items.each(function(subscription) {
      		subscription.feedWatched = watchedFeeds.any(function(n) {return n == subscription.id})
      		self.$.FeedsList.createComponent({kind: "FeedSpider2.NotificationFeed", checked: subscription.feedWatched, title: subscription.title, feedId: subscription.id})
    	})
		
		this.inherited(arguments);
	},
});

enyo.kind({
	name: "FeedSpider2.NotificationFeed",
	kind: "enyo.FittableColumns",
	noStretch: true,
	
	published: {
		checked: "",
		title: "",
		feedId: ""
	},
	
	style: "padding: 5px 8px; color: black; border-color: #aaaaaa; border-style: solid; border-width: 0 0 1px 0",
	
	components: [
		{name: "notificationFeedCheckbox", kind: "onyx.Checkbox", onchange: "addRemoveFeed"},
		{name: "notificationFeedTitle", style: "padding-left: 10px; padding-top: 6px; font-weight: bold", fit:true}
	],
	
	create: function() {
		this.inherited(arguments);
		
		this.$.notificationFeedCheckbox.checked = this.checked
		this.$.notificationFeedTitle.content = this.title
	},
	
	addRemoveFeed: function(inSender, inEvent) {
		if (inEvent.originator.checked === true)
		{
			Preferences.addNotificationFeed(this.feedId)
		}
		else
		{
			Preferences.removeNotificationFeed(this.feedId)
		}
	}
});