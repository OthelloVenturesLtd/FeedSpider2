enyo.singleton({
	name: "FeedSpider2.Notifications",

	notify: function(message)
	{
		if (enyo.platform.webos)
		{
			enyo.webos.addBannerMessage(message, "{}");
		}
		else
		{
			feedspider.handlePopupMessage({title: message});
		}
	}
});