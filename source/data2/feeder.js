var Feeder = new enyo.Component({
	name: "Feeder",

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