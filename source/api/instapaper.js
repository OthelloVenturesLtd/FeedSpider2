/* eslint-disable no-var */
enyo.kind({
	name: "FeedSpider2.InstapaperAPI",
	
	send: function(url, title, success, badCredentials, failure) {
		var username = FeedSpider2.Preferences.getInstapaperUsername();
		var password = FeedSpider2.Preferences.getInstapaperPassword();

		if(username) {
			var request = new enyo.Ajax({
				url: "https://www.instapaper.com/api/add",
				xhrFields: {mozSystem: true},
				cacheBust: false
			});

			request.error(function(inRequest, inResponse) {
				if (inResponse == 403)
				{
					badCredentials();
				}
				else
				{
					failure();
				}
			});

			request.response(function (inRequest, inResponse){
				success(inResponse.tags);
			}, this);

			request.go({username: username, password: password, url: url, title: title});
		}
		else {
			badCredentials();
		}
	}
});
