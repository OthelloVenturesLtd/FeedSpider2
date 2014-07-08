var Sharing = {
  
  //variables in use up to ax
  webOSItems: [
    {id: "sharing-aa", label: "Reader", defaultEnabled: true},
    {id: "sharing-ab", label: "Share", command: "share-with-google", defaultEnabled: false},
    {id: "sharing-at", label: "Clipboard", defaultEnabled: true},
    {id: "sharing-au", label: "Copy URL", command: "send-to-clipboard", defaultEnabled: true},
    {id: "sharing-ac", label: "Twitter", defaultEnabled: true},
    {id: "sharing-ad", label: "Project Macaw", command: "send-to-project-macaw", defaultEnabled: true},
    {id: "sharing-aw", label: "Spaz HD", command: "send-to-spaz-hd", defaultEnabled: false},
    {id: "sharing-ax", label: "Spaz Beta", command: "send-to-spaz-beta", defaultEnabled: false},
    {id: "sharing-ae", label: "Glimpse", command: "send-to-glimpse", defaultEnabled: true},
    {id: "sharing-av", label: "Browser", command: "send-to-browser", defaultEnabled: true},
    {id: "sharing-aq", label: "Quick Post", defaultEnabled: true},
    {id: "sharing-ar", label: "Default Accounts", command: "send-to-qp-default", defaultEnabled: true},
    {id: "sharing-as", label: "All Accounts", command: "send-to-qp-all", defaultEnabled: true},
    {id: "sharing-af", label: "Share", defaultEnabled: true},
    {id: "sharing-ag", label: "Facebook", command: "send-to-facebook", defaultEnabled: true},
    {id: "sharing-ah", label: "Email", command: "send-to-email", defaultEnabled: true},
    {id: "sharing-ai", label: "SMS", command: "send-to-sms", defaultEnabled: true},
    {id: "sharing-ap", label: "neato!", command: "send-to-neato", defaultEnabled: false},
    {id: "sharing-aj", label: "Read Later", defaultEnabled: true},
    {id: "sharing-ak", label: "Relego", command: "send-to-relego", defaultEnabled: true},
    {id: "sharing-al", label: "Spare Time", command: "send-to-spare-time", defaultEnabled: false},
    {id: "sharing-am", label: "Instapaper", command: "send-to-instapaper", defaultEnabled: true},
    {id: "sharing-an", label: "ReadOnTouch PHONE", command: "send-to-readontouch-phone", defaultEnabled: false},
    {id: "sharing-ao", label: "ReadOnTouch PRO", command: "send-to-readontouch-pro", defaultEnabled: false}
  ],
  
  firefoxOSItems: [
  	{id: "sharing-ab", label: "Share", command: "share-with-google", defaultEnabled: true},
  	{id: "sharing-ah", label: "Email", command: "send-to-email", defaultEnabled: true},
	{id: "sharing-av", label: "Twitter", command: "send-to-browser", defaultEnabled: true},
  ],
  
  getPopupFor: function(article) {
    if (enyo.platform.firefoxOS)
    {
    	Sharing.items = Sharing.firefoxOSItems
    }
    else if (enyo.platform.webos)
    {
    	Sharing.items = Sharing.webOSItems
    }
    
    var sortOrder = Preferences.getSharingOptionsSortOrder()

    if(sortOrder.length) {
      sortOrder.each(function(id, i) {
        Sharing.items.each(function(item) {
          if(item.id == id) {
            item.sortKey = i
            throw $break
          }
        })
      })

      Sharing.items = Sharing.items.sortBy(function(i) {return i.sortKey})
    }

    var popupItems = []
    var parentGroup

    var addGroup = function(group) {
      if(parentGroup && parentGroup.items > 0) {
        popupItems.push(parentGroup)
      }

      group = new onyx.Submenu({id: group.id, content: group.label, defaultEnabled: group.defaultEnabled, items: 0})
      parentGroup = group
    }

    var addItem = function(item) {
      item = new onyx.MenuItem({id: item.id, content: item.label, command: item.command, defaultEnabled: item.defaultEnabled, onSelect: "sendTo"})
      
      if(parentGroup) {
        item.setContainer(parentGroup)
		parentGroup.items = parentGroup.items + 1 // || []
        //parentGroup.items.push(item)
      }
      else {
        popupItems.push(item)
      }
    }

    Sharing.items.each(function(item) {
      if(Preferences.isSharingOptionEnabled(item.id, item.defaultEnabled)) {
        item = Object.clone(item)

        if(item.command) {
          if(article.api.supportsShared() == true && item.command == "share-with-google") {
			if(item.command == "share-with-google" && article.isShared) {
				item.command = "unshare-with-google"
				item.label = "Unshare"
			}
          	
          	addItem(item)
          }
          else if (item.command != "share-with-google"){
          	addItem(item)
          }
        }
        else {
          addGroup(item)
        }
      }
    })

    if(parentGroup && parentGroup.items > 0) {
      popupItems.push(parentGroup)
    }

    if (enyo.platform.webos) {
    	popupItems.push(new onyx.MenuItem({content: "Configure...", command: "configure"}))
    }

    return popupItems
  },

  handleSelection: function(article, command) {
    switch(command) {
      case "share-with-google":   Sharing.shareWithGoogle(article); break;
      case "unshare-with-google": Sharing.unshareWithGoogle(article); break;
      case "send-to-instapaper":  Sharing.sendToInstapaper(article); break;
      case "send-to-readontouch-phone": Sharing.sendToReadontouchPhone(article); break;
      case "send-to-readontouch-pro": Sharing.sendToReadontouchPro(article); break;
      case "send-to-spare-time":  Sharing.sendToSpareTime(article); break;
      case "send-to-relego":      Sharing.sendToRelego(article); break;
      case "send-to-project-macaw":   Sharing.sendToProjectMacaw(article); break;
      case "send-to-glimpse":        Sharing.sendToGlimpse(article); break;
      case "send-to-qp-default":       Sharing.sendToQPDefault(article); break;
      case "send-to-qp-all":      Sharing.sendToQPAll(article); break;
      case "send-to-email":       Sharing.sendToEmail(article); break;
      case "send-to-sms":         Sharing.sendToSms(article); break;
      case "send-to-neato":       Sharing.sendToNeato(article); break;
      case "send-to-facebook":    Sharing.sendToFacebook(article); break;
      case "send-to-clipboard":   Sharing.sendToClipboard(article); break;
      case "send-to-browser":     Sharing.sendToBrowser(article); break;
      case "send-to-spaz-hd":     Sharing.sendToSpazHD(article); break;
      case "send-to-spaz-beta":     Sharing.sendToSpazBeta(article); break;
    }
  },

  shareWithGoogle: function(article) {
    article.turnShareOn(function() {
      console.log("Article shared")
      //Feeder.notify($L("Article shared"))
    })
  },

  unshareWithGoogle: function(article) {
    article.turnShareOff(function() {
      //Feeder.notify($L("Article unshared"))
      console.log("Article unshared")
    })
  },

  sendToFacebook: function(article, shorturl) {
  	if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToFacebook")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url
    Sharing.sendToApp("Facebook", "com.palm.app.facebook", {status: article.title + "\n\n" + url})
  },

  sendToProjectMacaw: function(article, shorturl) {
  	if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToProjectMacaw")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url
    Sharing.sendToApp("Project Macaw", "net.minego.phnx", {action: "tweet", msg: article.title + "\n\n" + url})
  },

  sendToGlimpse: function(article, shorturl) {
    if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToGlimpse")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url
    Sharing.sendToApp("Glimpse", "com.ingloriousapps.glimpse", {query: "tweet/" + article.title + "\n\n" + url})
  },

  sendToQPDefault: function(article, shorturl) {
    if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToQPDefault")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url
    Sharing.sendToApp("Default Accounts", "com.hedami.quickpost", {quickPost: article.title + "\n\n" + url})
  },

  sendToQPAll: function(article, shorturl) {
    if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToQPAll")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url
    Sharing.sendToApp("All Accounts", "com.hedami.quickpost", {quickPost: "z " + article.title + "\n\n" + url})
  },

  sendToInstapaper: function(article) {
    var success = function() {
      Feeder.notify($L("Article saved to Instapaper"))
    }

    var credentials = function() {
      //TODO: Implement
      controller.stageController.pushScene("instapaper-credentials", Sharing.sendToInstapaper.curry(article, controller))
    }

    var failure = function() {
      Feeder.notify($L("Unable to save article"))
    }

    Instapaper.send(article.url, article.title, success, credentials, failure)
  },

  sendToSpareTime: function(article) {
    Sharing.sendToApp("Spare Time", "com.semicolonapps.sparetime", {action: "add_url", url: article.url, title: article.title})
  },

  sendToRelego: function(article) {
    Sharing.sendToApp("Relego", "com.webosroundup.relego", {action: 'addtorelego', url: article.url, title: article.title})
  },

  sendToEmail: function(article, shorturl) {
  	if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToEmail")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url
   	if (enyo.platform.webos) {
  		 Sharing.sendToApp("Email", "com.palm.app.email", {summary: article.title, text: article.title + "\n\n" + url})
  	}
  	else if (enyo.platform.firefoxOS)
  	{
  		Sharing.sendToApp("Email", "new", {type: "mail", url: "mailto:?subject=" + encodeURIComponent(article.title) + "&body=" + encodeURIComponent(article.title + "\n\n") + encodeURI(url)})
  	}
  },

  sendToSms: function(article, shorturl) {
   	if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToSms")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url   
    Sharing.sendToApp("Messaging", "com.palm.app.messaging", {messageText: article.title + "\n\n" + url})
  },

  sendToNeato: function(article) {
    Sharing.sendToApp("neato!", "com.zhephree.neato", {send: '{"a":"url","c":"'+article.url+'"}'})
  },

  sendToReadontouchPhone: function(article) {
    Sharing.sendToApp("ReadOnTouch PHONE", "com.sven-ziegler.readontouch-phone", {action: 'addLink', url: article.url, title: article.title})
  },

  sendToReadontouchPro: function(article) {
    Sharing.sendToApp("ReadOnTouch PRO", "com.sven-ziegler.readontouch", {action: 'addLink', url: article.url, title: article.title})
  },
  
  sendToClipboard: function(article) {
    //TODO: Figure out how to make this work in enyo2
    controller.stageController.setClipboard(article.url)
    Feeder.notify("URL Copied")
  },
  
  sendToBrowser: function(article, shorturl) {
  	if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToBrowser")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url
  	if (enyo.platform.webos) {
  		Sharing.sendToApp("Browser", "com.palm.app.browser", {target: "https://twitter.com/intent/tweet?text=" + encodeURIComponent(article.title) + "&url=" + encodeURI(url)})
  	}
  	else if (enyo.platform.firefoxOS)
  	{
  		Sharing.sendToApp("Browser", "view", {type: "url", url: "https://twitter.com/intent/tweet?text=" + encodeURIComponent(article.title) + "&url=" + encodeURI(url)})
  	}
  },
  
  sendToSpazHD: function(article, shorturl) {
  	if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToSpazHD")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url
    Sharing.sendToApp("Spaz HD", "com.funkatron.app.spaz-hd", {action: "prepPost", tweet: article.title + "\n\n" + url})
  },
  
  sendToSpazBeta: function(article, shorturl) {
  	if(Preferences.isShortenURLs() && !shorturl)
  	{
  		Sharing.getShortURL(article, article.url, "sendToSpazBeta")
  		return
  	}
  	
  	var url = shorturl ? shorturl : article.url
    Sharing.sendToApp("Spaz Beta", "com.funkatron.app.spaz-beta", {action: "prepPost", tweet: article.title + "\n\n" + url})
  },
  
  getShortURL: function(article, url, method)
  {
	new Ajax.Request("http://is.gd/create.php", {
	method: "get",
	parameters: {format: "json", url: encodeURI(url)},
	onSuccess: function(response){
		shorturl = response.responseText.evalJSON().shorturl
		Sharing[method](article, shorturl)
	},
		onFailure: function(){Sharing[method](article, url)}
	})
  },

  sendToApp: function(appName, id, params) {
    if (enyo.platform.webos) {
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

  offerToInstallApp: function(name, id) {
    //TODO: Implement
    controller.showAlertDialog({
      title:$L("#{app} is not installed").interpolate({app: name}),
      message: $L("#{app} is not installed. Would you like to install it?").interpolate({app: name}),

      choices:[
        {label:$L("Yes"), value:"yes", type:"affirmative"},
        {label:$L("No"), value:"no", type:"dismissal"}
      ],

      onChoose: function(value){
        if("yes" == value){
          controller.serviceRequest("palm://com.palm.applicationManager", {
            method:"open",
            parameters:{target: "http://developer.palm.com/appredirect/?packageid=" + id}
          })
        }
      }
    })
  }
}

