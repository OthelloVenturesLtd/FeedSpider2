var Feeder = new enyo.Component({
	name: "Feeder",

	notify: function(message)
	{
		feedspider.handlePopupMessage({title: message});
	}
});