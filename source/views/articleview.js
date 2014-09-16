enyo.kind({
	name: "FeedSpider2.ArticleView",
	kind: "FeedSpider2.BaseView",

	published: {
		article: "",
		scrollingIndex: "",
		articleContainer: ""
	},
	
	handlers: {
        onSelect: "sendTo"
    },
	
	components:[
		{name: "mainScroller", kind: "enyo.Scroller", fit: true, ondragfinish: "dragSwitchArticle", components: [
			{name: "articleHeader", kind: "FittableColumns", classes: "article-header", components: [
				{fit: true, components: [
					{name: "title", classes: "article-title", style: "font-weight: bold;"},
					{name: "subscription", classes: "article-subscription"},
					{name: "author", classes: "article-author"}
				]},
				{tag: "div", style:"background: url('assets/rightarrow.png') no-repeat center; width: 20px; height: 56px"},
			], ontap: "openInBrowser"},
			{name: "summary", allowHtml: true, classes: "article-summary", ontap: "catchLinkTap"},
		]},
		{kind: "onyx.Toolbar", style: "padding-left: 0px; padding-right: 0px", components: [
			{style: "width: 18%; text-align:center; margin-left: 0px; margin-right: 0px;", components: [
				{name: "previousButton", kind: "onyx.IconButton", ontap: "previousArticle", src: "assets/previous-article.png"},
			]},
			{style: "width: 16%; text-align:center; margin-left: 0px; margin-right: 0px;", components: [
				{name: "goBackButton", kind: "onyx.IconButton", ontap: "handleGoBack", src: "assets/go-back-footer.png"},
			]},
			{style: "width: 16%; text-align:center; margin-left: 0px; margin-right: 0px;", components: [
				{name: "readButton", kind: "onyx.IconButton", ontap: "setRead", src: "assets/read-footer.png"},
			]},
			{style: "width: 16%; text-align:center; margin-left: 0px; margin-right: 0px;", components: [
				{name: "starredButton", kind: "onyx.IconButton", ontap: "setStarred", src: "assets/starred-footer.png"},
			]},
			{style: "width: 16%; text-align:center; margin-left: 0px; margin-right: 0px;", components: [
				{kind: "onyx.MenuDecorator", components: [
					{name: "sendToButton", kind: "onyx.IconButton", src: "assets/sendto-footer.png"},
					{name: "sharingMenu", kind: "onyx.Menu", floating: true, components: [
        				//{name: "configureItem", content: "Configure...", onTap: "configureSharing"},
    				]}
				]},
			]},
			{style: "width: 18%; text-align:center; margin-left: 0px; margin-right: 0px;", components: [
				{name: "nextButton", kind: "onyx.IconButton", ontap: "nextArticle", src: "assets/next-article.png"},
				{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "display: none"},
			]},
		]},
		{kind: enyo.Signals, onkeyup: "handleKeyUp"}
	],
	
	rendered: function() {
		this.inherited(arguments);
	},

	catchLinkTap: function(inSender, inEvent)
	{
		//TODO: deal with for other OSes
		if (inEvent.target.href != undefined) {
			inEvent.target.target = "_blank"
		}
		
		//Catch images. These will be wrapped in an <a> tag.
		if (inEvent.target.parentElement.href != undefined)
		{
			inEvent.target.parentElement.target = "_blank"
		}
	},
	
	dragSwitchArticle: function(inSender, inEvent) {
		if(inEvent.horizontal) {
			if (inEvent.xDirection == -1)
			{
				this.nextArticle();
			}
			if (inEvent.xDirection == 1)
			{
				this.previousArticle();
			}
		}
	},

	activate: function(changes) {
		var self = this;
		
		//Reset the window to flush any old content.
		this.$.title.setContent("");
		this.$.subscription.setContent("");
		this.$.author.setContent("");
		this.$.summary.setContent("");
		this.$.mainScroller.scrollToTop();
		
		this.$.title.setContent(this.article.title);
		this.$.subscription.setContent(this.articleContainer.api.titleFor(this.article.subscriptionId));
		this.$.author.setContent(this.article.author ? "by " + this.article.author : "");
		this.$.summary.setContent(this.article.summary);

		this.$.nextButton.show();
		this.$.smallSpinner.hide();

		this.setIcons();
		
		if(!this.article.isRead && !this.article.keepUnread) {
			this.toggleState(this.$.readButton, "Read");
		}
		if (enyo.platform.webos || enyo.platform.firefoxOS)
		{
			sharingMenu = Sharing.getPopupFor(this.article);
			sharingMenu.each(function(item){
				item.setContainer(self.$.sharingMenu);
			})
		}
	},

	setFontSize: function(fontSize) {
		this.$.summary.removeClass("tiny");
		this.$.summary.removeClass("small");
		this.$.summary.removeClass("medium");
		this.$.summary.removeClass("large");
		this.$.summary.addClass(fontSize);
	},
	
	setIcons: function(){
		if (this.article.isRead)
		{
			this.$.readButton.setSrc("assets/read-footer-on.png");
			this.$.readButton.addClass("on");
		}
		
		if (!this.article.isRead)
		{
			this.$.readButton.setSrc("assets/read-footer.png");
			this.$.readButton.removeClass("on");
		}
		
		if (this.article.isStarred)
		{
			this.$.starredButton.setSrc("assets/starred-footer-on.png");
			this.$.starredButton.addClass("on");
		}
		
		if (!this.article.isStarred)
		{
			this.$.starredButton.setSrc("assets/starred-footer.png");
			this.$.starredButton.removeClass("on");
		}
	},

	setStarred: function(inSender, inEvent) {
		this.toggleState(inSender, "Star");
	},

	setRead: function(inSender, inEvent) {
		this.toggleState(inSender, "Read", true);
	},

	toggleState: function(target, state, sticky) {
		var self = this;
		
		if(!target.hasClass("working")) {
			target.addClass("working");

			var onComplete = function(success) {
				target.removeClass("working");
				
				if(success) {
					self.setIcons();
				}
			}

			this.article["turn" + state + (target.hasClass("on") ? "Off" : "On")](onComplete, function() {}, sticky);
		}
	},

	handleKeyUp: function(inSender, inEvent) {
        if (this.showing && inEvent.keyCode === 27)
        {
        	this.handleGoBack();
        	if (enyo.platform.webos)
        	{
        		inEvent.stopPropagation();
        		inEvent.preventDefault();
       			return -1;
       		}
        }
    },

	handleGoBack: function() {
		this.doGoBack({lastPage: this.previousPage, scrollingIndex: this.scrollingIndex});
	},

	previousArticle: function() {
		this.scrollingIndex = this.scrollingIndex - 1;
		this.article.getPrevious(this.gotAnotherArticle.bind(this));
	},

	nextArticle: function() {
		this.scrollingIndex = this.scrollingIndex + 1;
		this.article.getNext(this.gotAnotherArticle.bind(this), this.loadingMoreArticles.bind(this));
	},

	gotAnotherArticle: function(article) {
		if(article) {
			this.doSwitchPanels({target: "article", article: article, scrollingIndex: this.scrollingIndex, articleContainer: this.articleContainer, previousPage: this.previousPage});
		}
		else {
			this.doGoBack({lastPage: this.previousPage, scrollTarget: this.scrollingIndex < 0 ? "top" : "bottom"});
		}
	},

	openInBrowser: function() {
		if(this.article.url) {
			if (enyo.platform.webos)
			{
				var request = new enyo.ServiceRequest({
					service: "palm://com.palm.applicationManager",
					method: "open"
				});
				request.go({id: "com.palm.app.browser", params: { target: this.article.url } }); //any params would go in here
			}
			else if (enyo.platform.firefoxOS)
			{
				var openURL = new MozActivity({
					name: "view",
					data: {
						type: "url", // Possibly text/html in future versions
						url: this.article.url
					}
				});
			}
			else if (enyo.platform.ie || enyo.platform.safari || enyo.platform.chrome || enyo.platform.firefox)
			{
				var ref = window.open(this.article.url, "_blank");
			}
			else
			{
				var ref = window.open(this.article.url, "_system", "location=yes");	
			}
		}
	},

	sendTo: function(inSender, inEvent) {
		var self = this;
				
		if (inEvent.originator.command == "configure")
		{
			//TODO: Port Configuration dialog
			//case "configure":           controller.stageController.pushScene("configure-sharing", Sharing.items)
		}
		else
		{
			Sharing.handleSelection(this.article, inEvent.originator.command);
		}
		
		//Refresh Sharing Menu
		this.$.sharingMenu = new onyx.Menu();
		sharingMenu = Sharing.getPopupFor(this.article);
		sharingMenu.each(function(item){
			item.setContainer(self.$.sharingMenu);
		})
		this.$.sharingMenu.render();
	},

	loadingMoreArticles: function() {
		this.$.nextButton.hide();
		this.$.smallSpinner.show();
	},
});
