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
			if (arguments[0].alarmId == Preferences.getExpectedNotificationEvent())
			{
				this.checkForUpdates();
				this.setInterval(false);
			}
			this.destroy();
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

	checkForUpdates: function() {
		var self = this
		var api = new Api()

		api.login(new Credentials(), function() {
			api.getUnreadCounts(function(counts) {
				var unreadCount = 0

				$A(counts).each(function(count) {
					if(count.count && Preferences.wantsNotificationFor(count.id)) {
						unreadCount += count.count
					}
				})

				if(unreadCount) {
					self.sendNotification(unreadCount)
				}
			})
		})
	},

	setInterval: function(changed) {
		var self = this

		if (Preferences.notificationInterval() == 0 || changed) {
			if (Preferences.getExpectedNotificationEvent() != 0)
			{
				navigator.mozAlarms.remove(Preferences.getExpectedNotificationEvent());
			}
		}

		if (Preferences.notificationInterval() != 0) {
			var notificationDate  = new Date();
			notificationDate.setSeconds(notificationDate.getSeconds() + Preferences.notificationInterval());

			var data = {
				source: "feedspider"
			}

			var request = navigator.mozAlarms.add(notificationDate, "honorTimezone", data);

			request.onsuccess = function () {
				Log.debug("The alarm has been scheduled: " + this.result);
				Preferences.setExpectedNotificationEvent(this.result)
			};

			request.onerror = function () { 
				Log.debug("An error occurred: " + this.error.name);
			};			
		}
	},
	
	sendNotification: function(unreadCount) {
		var notification = new Notification("You have " + unreadCount + " articles to read", {icon:"http://www.feedspider.net/assets/dashboard-icon-feedspider.png"});
	}
});

// Register notifications event handler for Firefox OS
if (enyo.platform.firefoxOS)
{
	navigator.mozSetMessageHandler("alarm", this.handleAlarm);
}

enyo.ready(function () {
	new FeedSpider2.Application({name: "feedspider"});
});

function handleAlarm(mozAlarm)
{
	if(mozAlarm.data && mozAlarm.data.source && mozAlarm.data.source === "feedspider")
	{ 
		new FeedSpider2.Application({name: "notificationfeedspider", action: "update", alarmId: mozAlarm.id});
	}
};