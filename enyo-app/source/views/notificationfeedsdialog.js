enyo.kind({
	name: "FeedSpider2.NotificationFeedsDialog",
	kind: "onyx.Popup",
	modal: false,
	autoDismiss: false,
	floating: true,
	centered: true,
	scrim: true,
	
	style: "padding-top: 20px; padding-left: 20px; padding-right: 20px;  padding-bottom: 20px; height: 60%; width: 80%;  max-width: 300px; text-align: center;",
	
	published: {
		sources: "",
	},
	
	events: {
		onComplete: "",	
	},
	
	components: [
		{layoutKind: "FittableRowsLayout", style: "height: 100%", components: [
			{name: "FeedsList", classes: "feeds-list", kind: "enyo.Scroller", style: "border-radius: 5px;", fit: true},
			{name: "FeedsListButton", kind: "onyx.Button", classes: "onyx-affirmative", style: "width:50%; margin-top: 5px;", ontap: "closeDialog"},
		]}
	],
	
  	create: function() {
    	this.inherited(arguments);
    	this.$.FeedsListButton.setContent($L("Done"));
	},
	
	closeDialog: function(){
		this.doComplete();
	},
	
	show: function(){
    	var watchedFeeds = FeedSpider2.Preferences.getWatchedFeeds();
		var self = this;
		
		this.get("sources").get("subscriptions").get("items").forEach(function(subscription) {
      		subscription.set("feedWatched", watchedFeeds.indexOf(subscription.id) !== -1);
      		self.$.FeedsList.createComponent({kind: "FeedSpider2.NotificationFeed", checked: subscription.get("feedWatched"), title: subscription.get("title"), feedId: subscription.get("id")});
    	});
		
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
	
	style: "padding: 5px 8px; border-color: #aaaaaa; border-style: solid; border-width: 0 0 1px 0",
	
	components: [
		{name: "notificationFeedCheckbox", kind: "onyx.Checkbox", onchange: "addRemoveFeed"},
		{name: "notificationFeedTitle", style: "padding-left: 10px; padding-top: 6px; font-weight: bold", fit:true}
	],
	
	create: function() {
		this.inherited(arguments);
		
		this.$.notificationFeedCheckbox.checked = this.checked;
		this.$.notificationFeedTitle.content = this.title;
	},
	
	addRemoveFeed: function(inSender, inEvent) {
		if (inEvent.originator.checked === true)
		{
			FeedSpider2.Preferences.addNotificationFeed(this.feedId);
		}
		else
		{
			FeedSpider2.Preferences.removeNotificationFeed(this.feedId);
		}
	}
});