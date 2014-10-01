enyo.kind({
	name: "FeedSpider2.DashboardNotification",
	style: "color:white;",
	
	handlers: {
		ontap: "handleTap"
	},
	
	components:[
		{kind: "enyo.FittableColumns", components: [
			{style: "width: 50px; margin-right: 4px; margin-left: 6px; margin-top: 2px; position: relative;", components: [
				{style: "width: 48px; height: 48px; background: url(assets/dashboard-icon-feedspider.png) center center no-repeat;" },
			]},
			{kind: "enyo.FittableRows", style: "color: #FFF;margin-top: -1px;margin-left: 10px;border: none;overflow: hidden;font-size: 16px;width: 270px;min-height: 53px;", components: [
				{name: "notificationTitle", style: "white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-weight: bold;padding-top:6px"},
				{name: "notificationMessage", style: "white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; margin-top: -2px;"}
			]}
		]}
	],
	
	create: function() {
		this.inherited(arguments);
		this.$.notificationTitle.setContent($L("New Articles"));
		if (arguments[0].count)
		{
			this.$.notificationMessage.setContent($L("You have {unread} articles to read", {unread: arguments[0].count}));
		}
		else
		{
			this.$.notificationMessage.setContent($L("You have {unread} articles to read", {unread: 0}));
		}
	},
	
	rendered: function() {
		
		this.inherited(arguments);
	},
	
	handleTap: function() {
		var request = new enyo.ServiceRequest({
    		service: "palm://com.palm.applicationManager",
    		method: "open"
		});
		request.go({id: webos.identifier().appID});
		
		window.close();		
	},
});