/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "FeedSpider2.Application",
	kind: "enyo.Application",
	
	create: function() {
		if (arguments[0].action === "update")
		{
			if(!enyo.platform.webos)
			{
				if (arguments[0].alarmId == FeedSpider2.Preferences.getExpectedNotificationEvent())
				{
					this.checkForUpdates();
					this.setInterval(false);
				}
				this.destroy();
			}
		}
		else
		{
			this.view = "FeedSpider2.Home";
			this.inherited(arguments);
		}
	},
	
	handlePopupMessage: function(message) {
		this.waterfallDown("onPopupMessage", message, this);
	},
	
	handleApiStateChanged: function(change) {
		this.waterfallDown("onApiStateChanged", change, this);
	},

	checkForUpdates: function(callback) {
		var self = this
		var api = new Api()

		api.login(new FeedSpider2.Credentials(), function() {
			api.getUnreadCounts(function(counts) {
				var unreadCount = 0

				$A(counts).each(function(count) {
					if(count.count && FeedSpider2.Preferences.wantsNotificationFor(count.id)) {
						unreadCount += count.count
					}
				})

				if(unreadCount) {
					if (callback)
					{
						callback(unreadCount)
					}
					else
					{
						self.sendNotification(unreadCount)
					}
				}
			})
		})
	},

	setInterval: function(changed) {
		var self = this

		if (enyo.platform.webos)
		{	
			if (FeedSpider2.Preferences.notificationInterval() == 0 || changed) {
				var clearRequest = new enyo.ServiceRequest({
			  		service: "palm://com.palm.power/timeout",
					method: "clear",
				});
				clearRequest.go({"key": webos.identifier().appID + ".timer"});
			}

			if (FeedSpider2.Preferences.notificationInterval() != 0) {
				var wakeupRequest = new enyo.ServiceRequest({
					service: "palm://com.palm.power/timeout",
					method: "set"
				});
				
				var totalSec = FeedSpider2.Preferences.notificationInterval()
				var hours = parseInt( totalSec / 3600 ) % 24;
				var minutes = parseInt( totalSec / 60 ) % 60;
				var seconds = totalSec % 60;

				var notificationInterval = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

				var parameters = {
					"key": webos.identifier().appID + ".timer",
					"in": notificationInterval,
				  	"wakeup": true,
				  	"uri": "palm://com.palm.applicationManager/open",
				  	"params": {
						"id": webos.identifier().appID,
						"params": {
					  		"action": "update"
						}
					}
				}

				wakeupRequest.go(parameters);
			}
		}
		else if (enyo.platform.firefoxOS)
		{
			if (FeedSpider2.Preferences.notificationInterval() == 0 || changed) {
				if (FeedSpider2.Preferences.getExpectedNotificationEvent() != 0)
				{
					navigator.mozAlarms.remove(FeedSpider2.Preferences.getExpectedNotificationEvent());
				}
			}

			if (FeedSpider2.Preferences.notificationInterval() != 0) {
				var notificationDate  = new Date();
				notificationDate.setSeconds(notificationDate.getSeconds() + FeedSpider2.Preferences.notificationInterval());

				var data = {
					source: "feedspider"
				}

				var request = navigator.mozAlarms.add(notificationDate, "honorTimezone", data);

				request.onsuccess = function () {
					Log.debug("The alarm has been scheduled: " + this.result);
					FeedSpider2.Preferences.setExpectedNotificationEvent(this.result)
				};

				request.onerror = function () { 
					Log.debug("An error occurred: " + this.error.name);
				};			
			}
		}
	},
	
	sendNotification: function(unreadCount) {
		var notification = new Notification($L("You have {unread} articles to read", {unread: unreadCount}), {icon:"http://www.feedspider.net/assets/dashboard-icon-feedspider.png"});
	}
});

enyo.kind({
	name: "FeedSpider2.webOSWindowManager",
	kind: "enyo.Component",
 
	components: [	
		// Application events handlers
		{kind: "enyo.ApplicationEvents", onrelaunch: "launch"}
	],
 
 	handlers: {
		onUnreadCountUpdated: "notifyUnreadCount" 		
 	},
 	
    constructor: function() {
      // These track our currently open windows
      this.appWindow = null;
      this.dashboardWindow = null;
      this.inherited(arguments);
   	},
 
	launch: function () {
		var params = webos.launchParams();
 
		if (params.action) {
			switch (params.action) {
				case "update":
					var updateApp = new FeedSpider2.Application({name: "notificationfeedspider", action: "update"});
					updateApp.checkForUpdates(this.notifyUnreadCount);
					updateApp.setInterval(false);
					updateApp.destroy();
					break;
			}
		}
		else {
			if (this.appWindow == null || this.appWindow == undefined)
			{
				this.appWindow = window.open(webos.fetchAppRootPath() + 'index.html', 'feedspiderAppWindow', 'attributes={"window": "card"}');	
			}
			else
			{
				//TODO: webOS has some lifecycle state where this doesn't work, fix it
				webos.activate(this.appWindow);
			}
		}
	},
 
 	notifyUnreadCount: function(count) {
 		if (this.dashboardWindow != null && this.dashboardWindow != undefined)
		{
 			this.dashboardWindow.close();
 		}
		
		this.dashboardWindow = window.open(webos.fetchAppRootPath() + "webos-dashboard.html?count=" + count, "feedspiderDashboardWindow", 'attributes={"window": "dashboard"}'); 	
 	}
});