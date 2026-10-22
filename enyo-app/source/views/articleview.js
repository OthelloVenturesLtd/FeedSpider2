enyo.kind({
	name: "FeedSpider2.ArticleView",
	kind: "FeedSpider2.BaseView",
	published: {
		article: "",
		scrollingIndex: "",
		articleContainer: ""
	},
	
	handlers: {
		onSelect: "sendTo",
		onShowInstapaperDialog: "handleShowInstapaperDialog",
	},
	
	components:[
		{name: "mainScroller", kind: "enyo.Scroller", fit: true, vertical:"scroll", touchOverscroll: true, touch: true, strategyKind:"TouchScrollStrategy", ondragfinish: "dragSwitchArticle", components: [
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
					{name: "sharingMenu", kind: "onyx.Menu", floating: true}
				]},
			]},
			{style: "width: 18%; text-align:center; margin-left: 0px; margin-right: 0px;", components: [
				{name: "nextButton", kind: "onyx.IconButton", ontap: "nextArticle", src: "assets/next-article.png"},
				{name: "smallSpinner", kind: "onyx.Icon", src: "assets/small-spinner.gif", showing: false},
			]},
		]},
		{name: "installAppDialog", kind: FeedSpider2.ChoiceDialog, onAction: "openAppStore", onDismiss: "closeDialog"},
		{name: "configureDialog", kind: FeedSpider2.ConfigureSharingDialog, onDismiss: "refreshSharingMenu"},
		{kind: "FeedSpider2.Sharing"},
		{kind: enyo.Signals, onkeyup: "handleKeyUp"}
	],
	rendered: function() {
		this.inherited(arguments);
	},
	catchLinkTap: function(inSender, inEvent)
	{
		inEvent.preventDefault();
		inEvent = inEvent || window.event;
		var el = inEvent.target || inEvent.srcElement;
		var href = "";
		if (el instanceof HTMLImageElement)
		{
			href = el.parentNode.getAttribute('href');
			el.parentNode.setAttribute('rel', 'external');
			el.parentNode.setAttribute('target', '_system');
		}
		else if (el instanceof HTMLAnchorElement)
		{
			href = el.getAttribute('href');
			el.setAttribute('rel', 'external');
			el.setAttribute('target', '_system');
		}
		if (href != "" && (!enyo.platform || !enyo.platform.webos)) {
			window.open(href, '_system');
		}
		return false;
	},
	
	dragSwitchArticle: function(inSender, inEvent) {
		if (this.allowSwipeNav) {
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

		this.$.title.setContent(Utils.decodeHtmlEntities(this.article.title));
		this.$.subscription.setContent(Utils.decodeHtmlEntities(this.articleContainer.api.titleFor(this.article.subscriptionId)));
		this.$.author.setContent(this.article.author ? "by " + Utils.decodeHtmlEntities(this.article.author) : "");

		var summaryContent = this.article.summary;
		if (FeedSpider2.Preferences.isStripImages()) {
			summaryContent = this.stripImages(summaryContent);
		}
		this.$.summary.setContent(summaryContent);

		this.$.nextButton.show();
		this.$.smallSpinner.hide();

		this.setIcons();
		
		if(!this.article.isRead && !this.article.keepUnread) {
			this.toggleState(this.$.readButton, "Read");
		}

		this.refreshSharingMenu();
		this.allowSwipeNav = FeedSpider2.Preferences.allowSwipeNav();
	},

	stripImages: function(html) {
		if (!html) {
			return html;
		}
		// Remove all img tags from the HTML content
		// This regex matches img tags with any attributes
		return html.replace(/<img[^>]*>/gi, '');
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
			};

			this.article["turn" + state + (target.hasClass("on") ? "Off" : "On")](onComplete, function() {}, sticky);
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
		if (this.$.installAppDialog.showing || this.$.configureDialog.showing)
		{
			this.closeDialog();
		}
		else
		{
			this.doGoBack({lastPage: this.previousPage, scrollingIndex: this.scrollingIndex});
		}
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
			else if (!enyo.platform.webos && window.PalmSystem)
			{
				var luneOSRequest = new enyo.ServiceRequest({
					service: "palm://com.palm.applicationManager",
					method: "open"
				});
				luneOSRequest.go({id: "org.webosports.app.browser", params: { target: this.article.url } }); //any params would go in here
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
				var browserRef = window.open(this.article.url, "_blank");
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
			this.$.configureDialog.show(this.$.sharing.webOSItems);
		}
		else
		{
			this.$.sharing.handleSelection(this.article, inEvent.originator.command, this);
		}
		
		//Refresh Sharing Menu (Unless running webOS)
		if(!(enyo.platform.webos || window.PalmSystem))
	 	{
			this.refreshSharingMenu();
		}
	},
	
	sendToInstapaper: function(inSender, inEvent) {
		this.closeDialog();
		this.$.sharing.handleSelection(this.article, "send-to-instapaper", this);
	},
	
	handleShowInstapaperDialog: function(inSender, inEvent)
	{
		//Set this on a small timeout to make sure that the menu disappears before showing the dialog.
		setTimeout(enyo.bind(this, function(){
			if (this.$.instapaperDialog) this.$.instapaperDialog.hide();
			if (this.$.instapaperDialog) this.$.instapaperDialog.destroy();		
			this.createComponent({name: "instapaperDialog", kind: FeedSpider2.InstapaperLoginDialog, onCredentialsSaved: "sendToInstapaper", onDismiss: "closeDialog"}, {owner:this});
			this.$.instapaperDialog.show();
		}), 100);
		return true;
	},

	openAppStore: function(inSender, inEvent)
	{
		var request = new enyo.ServiceRequest({
			service: "palm://com.palm.applicationManager",
			method: "open"
		});
	
		request.go({target: "http://developer.palm.com/appredirect/?packageid=" + inEvent.data});
		this.closeDialog();
	},
	
	closeDialog: function(inSender, inEvent)
	{
		if (this.$.instapaperDialog) this.$.instapaperDialog.hide();
		this.$.installAppDialog.hide();
		this.$.configureDialog.hide();
		this.resize();
	},

	refreshSharingMenu: function(inSender, inEvent)
	{
		var self = this;
		this.closeDialog();
		
		this.$.sharingMenu.destroyClientControls();
		
		sharingMenu = this.$.sharing.getPopupFor(this.article);
		sharingMenu.forEach(function(item){
			item.setContainer(self.$.sharingMenu);
		});
		this.$.sharingMenu.render();
	},

	setDialogTheme: function(theme) {
		this.$.configureDialog.removeClass("theme-dark-dialog");
		this.$.configureDialog.removeClass("theme-grey-dialog");
		this.$.configureDialog.removeClass("theme-light-dialog");
		
		this.$.configureDialog.addClass("theme-" + theme + "-dialog");		
	},

	loadingMoreArticles: function() {
		this.$.nextButton.hide();
		this.$.smallSpinner.show();
	},
});
