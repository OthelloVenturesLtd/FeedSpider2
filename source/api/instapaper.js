var Instapaper = {
  send: function(url, title, success, badCredentials, failure) {
    var username = FeedSpider2.Preferences.getInstapaperUsername();
    var password = FeedSpider2.Preferences.getInstapaperPassword();

    if(username) {
      var request = new enyo.Ajax({
        url: "https://www.instapaper.com/api/add",
        xhrFields: {mozSystem: true},
        cacheBust: false
      });

      request.error(failure);

      request.response(function (inRequest, inResponse){
          if (inRequest.xhrResponse.status == 403)
          {
            badCredentials();
          }
          else
          {
            success(inResponse.tags);
          }
      }, this);

      request.go({output: "json"});
    }
    else {
      badCredentials();
    }
  }
};
