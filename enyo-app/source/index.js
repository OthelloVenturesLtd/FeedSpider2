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