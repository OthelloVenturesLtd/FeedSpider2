enyo.kind({
	name: "FeedSpider2.AddView",
	kind: "FeedSpider2.BaseView",
	fit: true,

	published: {
		api: "",
	},
	
	components: [
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", noStretch: true, components: [
			{kind: "onyx.IconButton", src: "assets/go-back.png", ontap: "handleGoBack"},
			{tag: "span", content: "Add Subscription", style:"font-weight: bold; text-align: center", fit: true},
			{name: "blankIcon", kind: "onyx.Icon"}, //This is here to keep the header centered.
			{name: "errorIcon", kind: "onyx.Icon", src: "assets/error.png", style: "display: none"},
			{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "display: none"},
		]},
		{kind: "enyo.FittableRows", style: "width: 100%; padding-bottom: 1px; border-bottom: black 1px solid", components: [
			{kind: "onyx.InputDecorator", style: "background-color: white; width: 100%", components: [
    			{name: "query", kind: "onyx.Input", style: "width: 100%", placeholder: "Enter URL or Search Query"}
			]},
			{kind: "onyx.Button", style: "width: 100%;", content: "Search", classes: "onyx-affirmative", ontap: "search"},
			{name: "feedDetail", style: "width: 100%;", components: [
				{name: "feedUrl"},
				{name: "feedContent"},
				{kind: "onyx.Button", style: "width: 95%; margin:auto;", content: "Add", classes: "onyx-affirmative", ontap: "add"},
			]},
		//{kind: "onyx.Button", style: "width: 95%; margin:auto;", content: "Add", classes: "onyx-affirmative", ontap: "add"},
			//{fit: true, components: [
				{name: "list", kind: "List", style:"width: 100%;", count: 0, multiSelect: false, onSetupItem: "setupItem", ontap: "itemTapped", components: [
					{name: "item", style: "	border: 1px solid silver; padding: 14px; font-size: 14px;", components: [
						{name: "title"}
					]}
				]},
			//]},
		]},
		//{kind: "onyx.Button", style: "width: 95%; margin:auto;", content: "Add", classes: "onyx-affirmative", ontap: "add"},
],
	
	activate: function() {
		this.$.smallSpinner.hide()
		this.$.errorIcon.hide()
		this.$.blankIcon.show()
		this.$.query.value = ""
		this.$.list.count = 0
		this.$.feedDetail.hide()
	},
	
	handleGoBack: function() {
		this.doGoBack({lastPage: this.previousPage})
	},
	
	search: function() {
		this.$.blankIcon.hide()
		this.$.errorIcon.hide()
		this.$.smallSpinner.show()
		this.$.list.count = 0
		this.$.feedDetail.hide()
		this.api.addSubscription(this.$.query.value, this.subscriptionAdded.bind(this), this.subscriptionAddFailure.bind(this))
	},

	subscriptionAdded: function() {
		this.$.smallSpinner.hide()
		this.$.errorIcon.hide()
		this.$.blankIcon.show()
		Feeder.notify($L("Subscription added"))
		this.handleGoBack();
	},

	subscriptionAddFailure: function() {
		this.api.searchSubscriptions(this.$.query.value, this.subscriptionsFound.bind(this), this.subscriptionSearchFailure.bind(this))
	},

	subscriptionsFound: function(subscriptions) {
		this.subscriptions = {items:[]};

		this.$.smallSpinner.hide()
		this.$.errorIcon.hide()
		this.$.blankIcon.show()
				
		subscriptions.each(function(subscription) {
			this.subscriptions.items.push(this.buildSubscription(subscription))
		}.bind(this))

		if(this.subscriptions.items.length === 0) {
			this.$.smallSpinner.hide()
			this.$.errorIcon.show()
			this.$.blankIcon.hide()			
			Feeder.notify($L("No subscriptions found"))
		}
		else {
			this.$.list.setCount(this.subscriptions.items.length);
			this.$.list.reset();
		}
	},

	subscriptionSearchFailure: function() {
		this.$.smallSpinner.hide()
		this.$.blankIcon.hide()
		this.$.errorIcon.show()
		Feeder.notify($L("Unable to add subscription"))
	},

	showSubscription: function(event) {
		this.controller.stageController.pushScene("add-detail", this.api, event.item)
	},

	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.subscriptions.items[i];
		this.$.title.setContent(item.title);
		this.$.item.addRemoveClass("list-add-selected", inSender.isSelected(i));
		return true;
	},

	itemTapped: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.subscriptions.items[i];
		this.$.feedUrl.setContent(item.url);
		this.$.feedContent.setContent(item.content);
		this.$.feedDetail.show()
	},

	buildSubscription: function(json) {
		var subscription = {}
		subscription.title = json.title

		if(json.content && json.content.content) {
			subscription.content = json.content.content
		}

		if(json.feed && json.feed.length && json.feed[0].href) {
			subscription.url = json.feed[0].href
		}

		return subscription
	}
})