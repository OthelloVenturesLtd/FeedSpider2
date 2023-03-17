/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.Sharing",
	kind: "enyo.Component",
	
	events: {
		onShowInstapaperDialog: ""
	},

	published: {
		items: null
	},

	//variables in use up to ax
	webOSItems: [
		//TODO: Add SimpleChat and ShareSpace
		//{id: "sharing-aa", label: $L("Reader"), defaultEnabled: true},
		//{id: "sharing-ab", label: $L("Share"), command: "share-with-google", defaultEnabled: false},
		//{id: "sharing-at", label: $L("Clipboard"), defaultEnabled: true},
		//{id: "sharing-au", label: $L("Copy URL"), command: "send-to-clipboard", defaultEnabled: true},
		//{id: "sharing-ac", label: $L("Twitter"), defaultEnabled: true},
		{id: "sharing-ad", label: $L("Project Macaw"), command: "send-to-project-macaw", defaultEnabled: true},
		//{id: "sharing-aw", label: $L("Spaz HD"), command: "send-to-spaz-hd", defaultEnabled: false},
		//{id: "sharing-ax", label: $L("Spaz Beta"), command: "send-to-spaz-beta", defaultEnabled: false},
		//{id: "sharing-ae", label: $L("Glimpse"), command: "send-to-glimpse", defaultEnabled: true},
		{id: "sharing-av", label: $L("Browser"), command: "send-to-browser", defaultEnabled: true},
		//{id: "sharing-aq", label: $L("Quick Post"), defaultEnabled: true},
		//{id: "sharing-ar", label: $L("Default Accounts"), command: "send-to-qp-default", defaultEnabled: true},
		//{id: "sharing-as", label: $L("All Accounts"), command: "send-to-qp-all", defaultEnabled: true},
		//{id: "sharing-af", label: $L("Share"), defaultEnabled: true},
		//{id: "sharing-ag", label: $L("Facebook"), command: "send-to-facebook", defaultEnabled: true},
		{id: "sharing-ah", label: $L("Email"), command: "send-to-email", defaultEnabled: true},
		{id: "sharing-ai", label: $L("SMS"), command: "send-to-sms", defaultEnabled: true},
		{id: "sharing-ss", label: $L("Share Space"), command: "send-to-sharespace", defaultEnabled: true},
		//{id: "sharing-ap", label: $L("neato!"), command: "send-to-neato", defaultEnabled: false},
		//{id: "sharing-aj", label: $L("Read Later"), defaultEnabled: true},
		//{id: "sharing-ak", label: $L("Relego"), command: "send-to-relego", defaultEnabled: true},
		//{id: "sharing-al", label: $L("Spare Time"), command: "send-to-spare-time", defaultEnabled: false},
		//{id: "sharing-am", label: $L("Instapaper"), command: "send-to-instapaper", defaultEnabled: true},
		//{id: "sharing-an", label: $L("ReadOnTouch PHONE"), command: "send-to-readontouch-phone", defaultEnabled: false},
		//{id: "sharing-ao", label: $L("ReadOnTouch PRO"), command: "send-to-readontouch-pro", defaultEnabled: false}
	],
	
	firefoxOSItems: [
		{id: "sharing-ab", label: $L("Share"), command: "share-with-google", defaultEnabled: true},
		{id: "sharing-ah", label: $L("Email"), command: "send-to-email", defaultEnabled: true},
		{id: "sharing-av", label: $L("Twitter"), command: "send-to-browser", defaultEnabled: true},
		{id: "sharing-am", label: $L("Instapaper"), command: "send-to-instapaper", defaultEnabled: true},
	],
	
	luneOSItems: [
		//{id: "sharing-aa", label: $L("Reader"), defaultEnabled: true},
		//{id: "sharing-ab", label: $L("Share"), command: "share-with-google", defaultEnabled: true},
		//{id: "sharing-ac", label: $L("Twitter"), defaultEnabled: true},
		{id: "sharing-ad", label: $L("Project Macaw"), command: "send-to-project-macaw", defaultEnabled: true},
		//{id: "sharing-aw", label: $L("Spaz HD"), command: "send-to-spaz-hd", defaultEnabled: true},
		//{id: "sharing-ax", label: $L("Spaz Beta"), command: "send-to-spaz-beta", defaultEnabled: true},
		//{id: "sharing-ae", label: $L("Glimpse"), command: "send-to-glimpse", defaultEnabled: true},
		{id: "sharing-av", label: $L("Browser"), command: "send-to-browser", defaultEnabled: true},
		//{id: "sharing-aq", label: $L("Quick Post"), defaultEnabled: true},
		//{id: "sharing-ar", label: $L("Default Accounts"), command: "send-to-qp-default", defaultEnabled: true},
		//{id: "sharing-as", label: $L("All Accounts"), command: "send-to-qp-all", defaultEnabled: true},
		//{id: "sharing-af", label: $L("Share"), defaultEnabled: true},
		{id: "sharing-ah", label: $L("Email"), command: "send-to-email", defaultEnabled: true},
		//{id: "sharing-ap", label: $L("neato!"), command: "send-to-neato", defaultEnabled: true},
		//{id: "sharing-aj", label: $L("Read Later"), defaultEnabled: true},
		//{id: "sharing-ak", label: $L("Relego"), command: "send-to-relego", defaultEnabled: true},
		//{id: "sharing-al", label: $L("Spare Time"), command: "send-to-spare-time", defaultEnabled: true},
		//{id: "sharing-am", label: $L("Instapaper"), command: "send-to-instapaper", defaultEnabled: true},
		//{id: "sharing-an", label: $L("ReadOnTouch PHONE"), command: "send-to-readontouch-phone", defaultEnabled: true},
		//{id: "sharing-ao", label: $L("ReadOnTouch PRO"), command: "send-to-readontouch-pro", defaultEnabled: true}
	],

	pwaItems: [
		{id: "sharing-mt", label: $L("Email"), command: "send-to-mailto", defaultEnabled: true},
	],

	idToNameMapping: {
		"com.funkatron.app.spaz-beta": "Spaz Beta",
		"com.funkatron.app.spaz-hd": "Spaz HD",
		"com.hedami.quickpost": "Quick Post",
		"com.ingloriousapps.glimpse": "Glimpse",
		"com.palm.app.browser": "Browser",
		"com.palm.app.email": "Email",
		"com.palm.app.facebook": "Facebook",
		"com.palm.app.messaging": "Messaging",
		"com.semicolonapps.sparetime": "Spare Time",
		"com.sven-ziegler.readontouch": "ReadOnTouch PRO",
		"com.sven-ziegler.readontouch-phone": "ReadOnTouch PHONE",
		"com.webosroundup.relego": "Relego",
		"com.zhephree.neato": "neato!",
		"net.minego.phnx": "Project Macaw",
	},

	getPopupFor: function(article) {
		if (enyo.platform.firefoxOS)
		{
			this.set("items", this.firefoxOSItems);
		}
		else if (enyo.platform.webos)
		{
			this.set("items", this.webOSItems);
		}
		else if (!enyo.platform.webos && window.PalmSystem)
		{
			this.set("items", this.luneOSItems);
		}
		else 
		{
			this.set("items", this.pwaItems);
		}
		enyo.log("using items: " + JSON.stringify(this.get("items")));
    
		var sortOrder = FeedSpider2.Preferences.getSharingOptionsSortOrder();

		if(sortOrder.length) {
			sortOrder.forEach(function(id, i) {
				for (var j = 0; j < this.get("items").length; j++)
				{
					if (this.get("items")[j].id == id)
					{
						this.get("items")[j].set("sortKey", i);
						break;
					}
				}
			});

			this.set("items", this.get("items").sort(function(a, b) {return a.sortKey - b.sortKey;}));
		}

		var popupItems = [];
		var parentGroup;

		var addGroup = function(group) {
			if(parentGroup && parentGroup.items > 0) {
				popupItems.push(parentGroup);
			}

			group = new onyx.Submenu({id: group.id, content: group.label, defaultEnabled: group.defaultEnabled, items: 0});
			parentGroup = group;
		};

		var addItem = function(item) {
			item = new onyx.MenuItem({id: item.id, content: item.label, command: item.command, defaultEnabled: item.defaultEnabled, onSelect: "sendTo"});
			
			if(parentGroup) {
				item.setContainer(parentGroup);
				parentGroup.items = parentGroup.items + 1; // || []
				//parentGroup.items.push(item)
			}
			else {
				popupItems.push(item);
			}
		};

		if (this.get("items"))
		{
			this.get("items").forEach(function(item) {
				if(FeedSpider2.Preferences.isSharingOptionEnabled(item.id, item.defaultEnabled)) {
				//item = Object.clone(item);

					if(item.command) {
						if(article.api.supportsShared() === true && item.command == "share-with-google") {
							if(item.command == "share-with-google" && article.isShared) {
								item.command = "unshare-with-google";
								item.label = "Unshare";
							}
							
							addItem(item);
						}
						else if (item.command != "share-with-google"){
							addItem(item);
						}
					}
					else {
						addGroup(item);
					}
				}
			});
		}

		if(parentGroup && parentGroup.items > 0) {
			popupItems.push(parentGroup);
		}

		if (enyo.platform.webos) {
			//TODO: this dialog has all sorts of problems -- but there are so few working options that it might not be needed
			//popupItems.push(new onyx.MenuItem({content: "Configure...", command: "configure"}));
		}

		return popupItems;
	},

	handleSelection: function(article, command, view) {
		this.articleView = view;
		switch(command) {
			case "share-with-google":   this.shareWithGoogle(article); break;
			case "unshare-with-google": this.unshareWithGoogle(article); break;
			case "send-to-instapaper":  this.sendToInstapaper(article); break;
			case "send-to-readontouch-phone": this.sendToReadontouchPhone(article); break;
			case "send-to-readontouch-pro": this.sendToReadontouchPro(article); break;
			case "send-to-spare-time":  this.sendToSpareTime(article); break;
			case "send-to-relego":      this.sendToRelego(article); break;
			case "send-to-project-macaw":   this.sendToProjectMacaw(article); break;
			case "send-to-glimpse":        this.sendToGlimpse(article); break;
			case "send-to-qp-default":       this.sendToQPDefault(article); break;
			case "send-to-qp-all":      this.sendToQPAll(article); break;
			case "send-to-email":       this.sendToEmail(article); break;
			case "send-to-sms":         this.sendToSms(article); break;
			case "send-to-neato":       this.sendToNeato(article); break;
			case "send-to-facebook":    this.sendToFacebook(article); break;
			case "send-to-clipboard":   this.sendToClipboard(article); break;
			case "send-to-browser":     this.sendToBrowser(article); break;
			case "send-to-spaz-hd":     this.sendToSpazHD(article); break;
			case "send-to-spaz-beta":   this.sendToSpazBeta(article); break;
			case "send-to-sharespace":  this.sendToShareSpace(article); break;
			case "send-to-mailto":		this.sendToMailto(article); break;
		}
	},

	shareWithGoogle: function(article) {
		article.turnShareOn(function() {
			Feeder.notify($L("Article shared"));
		});
	},

	unshareWithGoogle: function(article) {
		article.turnShareOff(function() {
			Feeder.notify($L("Article unshared"));
		});
	},

	sendToFacebook: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToFacebook");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		this.sendToApp("Facebook", "com.palm.app.facebook", {status: article.title + "\n\n" + url});
	},

	sendToProjectMacaw: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToProjectMacaw");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		this.sendToApp("Project Macaw", "net.minego.phnx", {action: "tweet", msg: article.title + "\n\n" + url});
	},

	sendToGlimpse: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToGlimpse");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		this.sendToApp("Glimpse", "com.ingloriousapps.glimpse", {query: "tweet/" + article.title + "\n\n" + url});
	},

	sendToQPDefault: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToQPDefault");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		this.sendToApp("Default Accounts", "com.hedami.quickpost", {quickPost: article.title + "\n\n" + url});
	},

	sendToQPAll: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToQPAll");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		this.sendToApp("All Accounts", "com.hedami.quickpost", {quickPost: "z " + article.title + "\n\n" + url});
	},

	sendToInstapaper: function(article) {
		var self = this;
		
		var success = function() {
			Feeder.notify($L("Article saved to Instapaper"));
		};

		var credentials = function() {
			self.doShowInstapaperDialog();
		};

		var failure = function() {
			Feeder.notify($L("Unable to save article"));
		};

		var instapaper = new FeedSpider2.InstapaperAPI();

		instapaper.send(article.url, article.title, success, credentials, failure);
	},

	sendToSpareTime: function(article) {
		this.sendToApp("Spare Time", "com.semicolonapps.sparetime", {action: "add_url", url: article.url, title: article.title});
	},

	sendToRelego: function(article) {
		this.sendToApp("Relego", "com.webosroundup.relego", {action: 'addtorelego', url: article.url, title: article.title});
	},

	sendToEmail: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToEmail");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		if (enyo.platform.webos || window.PalmSystem) {
			this.sendToApp("Email", "com.palm.app.email", {summary: article.title, text: article.title + "\n\n" + url});
		}
		else if (enyo.platform.firefoxOS)
		{
			this.sendToApp("Email", "new", {type: "mail", url: "mailto:?subject=" + encodeURIComponent(article.title) + "&body=" + encodeURIComponent(article.title + "\n\n") + encodeURI(url)});
		}
	},

	sendToSms: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToSms");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		this.sendToApp("Messaging", "com.palm.app.messaging", {messageText: article.title + "\n\n" + url});
	},

	sendToNeato: function(article) {
		this.sendToApp("neato!", "com.zhephree.neato", {send: '{"a":"url","c":"'+article.url+'"}'});
	},

	sendToReadontouchPhone: function(article) {
		this.sendToApp("ReadOnTouch PHONE", "com.sven-ziegler.readontouch-phone", {action: 'addLink', url: article.url, title: article.title});
	},

	sendToReadontouchPro: function(article) {
		this.sendToApp("ReadOnTouch PRO", "com.sven-ziegler.readontouch", {action: 'addLink', url: article.url, title: article.title});
	},
	
	sendToClipboard: function(article) {
		//TODO: Figure out how to make this work in enyo2
		controller.stageController.setClipboard(article.url);
		Feeder.notify($L("URL Copied"));
	},
  
	sendToBrowser: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToBrowser");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		if (enyo.platform.webos) {
			this.sendToApp("Browser", "com.palm.app.browser", {target: "https://twitter.com/intent/tweet?text=" + encodeURIComponent(article.title) + "&url=" + encodeURI(url)});
		}
		else if (!enyo.platform.webos && window.PalmSystem) {
			this.sendToApp("Browser", "org.webosports.app.browser", {target: "https://twitter.com/intent/tweet?text=" + encodeURIComponent(article.title) + "&url=" + encodeURI(url)});
		}
		else if (enyo.platform.firefoxOS)
		{
			this.sendToApp("Browser", "view", {type: "url", url: "https://twitter.com/intent/tweet?text=" + encodeURIComponent(article.title) + "&url=" + encodeURI(url)});
		}
	},
  
	sendToSpazHD: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToSpazHD");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		this.sendToApp("Spaz HD", "com.funkatron.app.spaz-hd", {action: "prepPost", tweet: article.title + "\n\n" + url});
	},
  
	sendToSpazBeta: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToSpazBeta");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		this.sendToApp("Spaz Beta", "com.funkatron.app.spaz-beta", {action: "prepPost", tweet: article.title + "\n\n" + url});
	},

	sendToShareSpace: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToSms");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		this.sendToApp("ShareSpace", "com.palm.webos.sharespace", {newshare: article.title + "\n\n" + url});
	},

	sendToMailto: function(article, shorturl) {
		if(FeedSpider2.Preferences.isShortenURLs() && !shorturl)
		{
			this.getShortURL(article, article.url, "sendToEmail");
			return;
		}
		
		var url = shorturl ? shorturl : article.url;
		var mailBody = encodeURIComponent(article.title + "\n\n") + encodeURI(url);
		document.location.href = "mailto:?subject="
			+ encodeURIComponent(article.title)
			+ "&body=" + mailBody;
	},
  
	getShortURL: function(article, url, method)
	{
		var request = new enyo.Ajax({
			url: "http://is.gd/create.php",
			method: "GET",
			xhrFields: {mozSystem: true},
			cacheBust: false
		});

		request.error(function(){this[method](article, url);}, this);
		request.response(function(inRequest, inResponse) {
			this[method](article, inResponse.shorturl);
		}, this);
		request.go({format: "json", url: encodeURI(url)});
	},

	sendToApp: function(appName, id, params) {
		if (enyo.platform.webos || window.PalmSystem) {
			var request = new enyo.ServiceRequest({
				service: "palm://com.palm.applicationManager",
				method: "open"
			});
			request.error(this, "offerToInstallApp");
			request.go({id: id, params: params});
		}
		else if (enyo.platform.firefoxOS) {
			var newActivity = new MozActivity({name: id, data: params});
		}
	},

	offerToInstallApp: function(inSender, inResponse) {
		//NOTE: errorText gives us the ID of the missing package - we just need to parse it out.
		var appID = inResponse.errorText.match(/"([^"]+)"/)[1];
		if (appID !== null || appID !== undefined)
		{
			var name = this.idToNameMapping[appID];
			this.articleView.$.installAppDialog.show($L("{app} is not installed", {app: name}), $L("{app} is not installed. Would you like to install it?", {app: name}), appID);
		}
	}
});