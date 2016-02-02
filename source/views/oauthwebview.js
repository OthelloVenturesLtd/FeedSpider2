/*
Version 1.0
oauthwebview.js - an Enyo kind for handling OAuth Authentication in webOS.
Inspired by the webOS OAuth library at https://github.com/ionull/webOS-OAuth2

NOTE: You will need to supply your own UI Chrome (ie. buttons, etc.) these can be hooked into this kind.

USAGE:
	var oauthConfig={
		authorizeUrl: "url", // Your provider's Authorize URL
		accessTokenUrl: "url", // Your provider's Access Token URL
		accessTokenMethod: "POST", // Optional - "GET" by default if not specified
		client_id: "ID", // The Client ID assigned to you by your provider
		client_secret: "SECRET", // The Client Secret assigned to you by your provider
		redirect_uri: "http://localhost", // Optional - The redirect URL registered with your provider. "oob" by default if not specified
		response_type:"code", // One of code or token. Right now, only code is supported.
		scope: ["scope"], // An array of scope names that you are requesting permission to access.
		additionalParameters: "params" // Optional - Any additional parameters required by your provider. IE. AOL Reader requires "&supportedIdType=facebook,google,twitter" to enable all auth types.
	}
	
	this.$.oAuthWebView.beginOAuth(oauthConfig)
*/

enyo.kind({
	name: "FeedSpider2.OAuthWebView",
	kind: "enyo.WebView",
	
	events: {
		onOAuthSuccess: "", // Called when the full OAuth operation has completed. Returns a javascript object with authentication info.
		onCodeGot: "", // Called when the access code has been received after a successful login to an oAuth Provider
		onOAuthFailure: "" // Called when something goes wrong
	},
	
	handlers: {
		onError: "navigationError",
		onPageTitleChanged: "locationChanged"
	},
	
	published: {
		canGoBack: false,
	},
	
	create: function() {
		this.inherited(arguments);
	},
	
	beginOAuth: function(settings){
		// Set up the OAuth Session based on the settings object
		this.method = null;
		this.logoutURL = undefined;
		this.requestTokenUrl = settings.requestTokenUrl;
		this.authorizeUrl = settings.authorizeUrl;
		this.accessTokenUrl = settings.accessTokenUrl;
		this.client_id = settings.client_id;
		this.client_secret = settings.client_secret;
		if (settings.redirect_uri !== undefined) {
			this.redirect_uri = settings.redirect_uri;
		}
		else {
			this.redirect_uri = "oob";
		}
		this.response_type = settings.response_type;
		if (settings.accessTokenMethod !== undefined) {
			this.accessTokenMethod = settings.accessTokenMethod;
		}
		else {
			this.accessTokenMethod = "GET";
		}
		this.scope = settings.scope;
		this.fullurl = "";
		this.requested_token = "";
		this.exchangingToken = false;
		if (settings.additionalParameters !== undefined) {
			this.additionalParameters = settings.additionalParameters;
		}
		else {
			this.additionalParameters = null;
		}
		
		// Process the parameters and build the OAuth URL
		var scope = "";
		for(var permission in this.scope) {
			if(typeof(this.scope[permission]) == 'function')continue;
			if(scope !== "") scope = scope + "+";
			scope = scope + this.scope[permission];
		}
	
		var fullurl = this.authorizeUrl + "?client_id=" + this.client_id + "&redirect_uri=" + this.redirect_uri + "&response_type=" + this.response_type;
		if(scope !== "") fullurl = fullurl + "&scope=" + scope;
		if(this.additionalParameters) fullurl = fullurl + "&" + this.additionalParameters;
		
		//Begin OAuth process
		this.setUrl(fullurl);
	},
	
	navigationError: function(inSender, inEvent) {
    	var callbackURL = inEvent.url;
		var responseVars = callbackURL.split("?");
		if (!this.exchangingToken && (responseVars[0] == this.redirect_uri + "/" || responseVars[0] == this.redirect_uri)) {
			var response_param = responseVars[1];
			var result = response_param.match(/code=*/g);
			if (result !== null) {
				// Raise an event so that the UI handler can deal with the element visibility
				this.doCodeGot();
				
				// Try and logout from the oauth provider. (See method for more details).
				if (this.logoutURL !== undefined)
				{
					this.setUrl(this.logoutURL);
				} 
				
				var params = response_param.split("&");
				var code = params[0].replace("code=", "");
				
				this.codeToToken(code);
			}
		}
  	},

	locationChanged: function(inSender, inEvent) {
		this.logoutURL = this.getLogoutURL(inEvent.inUrl);
		this.setCanGoBack(inEvent.inCanGoBack);
  	},
  	
  	codeToToken: function(code) {
		this.exchangingToken = true;
		this.code = code;
		this.method = this.accessTokenMethod;
		
		var postParams = {
			client_id: this.client_id,
			client_secret: this.client_secret,
			code: this.code,
			grant_type: "authorization_code",
			redirect_uri: this.redirect_uri
		};
		
		var postBody = "";
		for (var name in postParams) {
			if (postBody === "") {
				postBody = name + "=" + postParams[name];
			}
			else {
				postBody = postBody + "&" + name + "=" + postParams[name];
			}
		}

		new Ajax.Request(this.accessTokenUrl, {
			method: this.method,
			encoding: 'UTF-8',
			postBody: postBody,
			onComplete: function(response) {
				var response_text = response.responseText;
				//Log.debug(this.TAG + ': accesstoken: ' + response.status + response_text);

				if (response.status == 200)
				{
					try {
						var responseJSON = JSON.parse(response_text);
						this.doOAuthSuccess(responseJSON);
					}
					catch (e) {
						this.doOAuthFailure();
					}
				}
				else
				{
					this.doOAuthFailure();
				}
			}.bind(this)
		});
	},
	
	// Due to a bug in the way that webOS 3.0.4+ handles clearing webView cookies, simply calling clearCookies() on the
	// webview will not clear logged on sessions. So we need to clear the logged on session manually. We don't need
	// it after we've received the OAuth code anyways, and if we don't, there is no way to log in using a different
	// account of the same type.
	getLogoutURL: function(url) {
		if (url.indexOf("accounts.google.com") !== -1){
			return "https://accounts.google.com/logout";
		}
		else if (url.indexOf("public-api.wordpress.com") !== -1) {
			return "https://wordpress.com/wp-login.php?action=logout";
		}
		else if (url.indexOf("twitter.com") !== -1) {
			return "https://twitter.com/logout";
		}
		else if (url.indexOf("api.screenname.aol.com") !== -1) {
			return "https://api.screenname.aol.com/auth/logout";
		}
		else if (url.indexOf("facebook.com") !== -1) {
			// Facebook does not appear to define a global logout URL at this time.
			return undefined;
		}
		else if (url.indexOf("live.com") !== -1) {
			return "https://login.live.com/logout.srf";
		}
		else if (url.indexOf("evernote.com") !== -1) {
			return "https://www.evernote.com/Logout.action";
		}
		else {
			return undefined;
		}
	}
});