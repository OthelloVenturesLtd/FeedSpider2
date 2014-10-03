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
			{name: "viewTitle", tag: "span", style:"font-weight: bold; text-align: center", fit: true},
			{name: "blankIcon", kind: "onyx.Icon"}, //This is here to keep the header centered.
			{name: "errorIcon", kind: "onyx.Icon", src: "assets/error.png", style: "display: none"},
			{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "display: none"},
		]},
		{kind: "enyo.FittableRows", style: "width: 100%; padding-bottom: 1px; border-bottom: black 1px solid", components: [
			{kind: "onyx.InputDecorator", style: "background-color: white; width: 100%", components: [
    			{name: "query", kind: "onyx.Input", style: "width: 100%"}
			]},
			{name: "searchButton", kind: "onyx.Button", style: "width: 100%;", classes: "onyx-affirmative", ontap: "search"},
			{name: "list", kind: "List", style:"width: 100%;", count: 0, multiSelect: false, onSetupItem: "setupItem", ontap: "itemTapped", components: [
				{name: "item", style: "	border: 1px solid silver; padding: 14px; font-size: 14px;", components: [
					{kind: "enyo.FittableColumns", components: [
						{kind: "enyo.FittableRows", style: "width: 80%", components: [
							{name: "title"},
							{name: "feedUrl"},
						]},	
						{name: "addButton", kind: "onyx.Button", style: "width: 40px; margin:auto;", showing:false, classes: "onyx-affirmative", ontap: "add"}
					]}
				]}
			]},
		]},
		{kind: enyo.Signals, onkeyup: "handleKeyUp"}
	],
	
	create: function() {
    	this.inherited(arguments);
    	this.$.viewTitle.setContent($L("Add Subscription"));
    	this.$.query.setPlaceholder($L("Enter URL or Search Query"));
    	this.$.searchButton.setContent($L("Search"));
    	this.$.addButton.setContent($L("Add"));
    },
	
	activate: function() {
		this.$.smallSpinner.hide()
		this.$.errorIcon.hide()
		this.$.blankIcon.show()
		this.$.query.setValue("")
		this.$.list.count = 0
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
		this.doGoBack({lastPage: this.previousPage})
	},
	
	search: function() {
		this.$.blankIcon.hide()
		this.$.errorIcon.hide()
		this.$.smallSpinner.show()
		this.$.list.count = 0
		this.api.addSubscription(this.$.query.value, this.subscriptionAdded.bind(this), this.subscriptionAddFailure.bind(this))
	},

	add: function() {
		this.$.blankIcon.hide()
		this.$.errorIcon.hide()
		this.$.smallSpinner.show()
		var item = this.subscriptions.items[this.selectedIndex];
		this.api.addSubscription(item.url, this.subscriptionAdded.bind(this), this.subscriptionAddFailure.bind(this))
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

	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.subscriptions.items[i];
		this.$.title.setContent(item.title);
		this.$.feedUrl.setContent(item.url);
		this.$.item.addRemoveClass("list-add-selected", inSender.isSelected(i));
		if (inSender.isSelected(i))
		{
			this.$.addButton.show()
		}
		else
		{
			this.$.addButton.hide()
		}
		return true;
	},

	itemTapped: function(inSender, inEvent) {
		this.selectedIndex = inEvent.index;		
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