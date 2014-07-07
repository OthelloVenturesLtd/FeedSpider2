/*
Version 1.0
oauthiframe.js - an Enyo kind for handling OAuth Authentication in Firefox OS
Inspired by the webOS OAuth library at https://github.com/ionull/webOS-OAuth2

In order to use this kind, your app will need to be a privileged app with permission to access the Browser API.
For More Info, See: https://developer.mozilla.org/en-US/docs/Web/API/Using_the_Browser_API

NOTE: You will need to supply your own UI Chrome (ie. buttons, etc.) these can be hooked into this kind by using the
this.$.oAuthIFrame.eventNode object.

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
	
	this.$.oAuthIFrame.beginOAuth(oauthConfig)
	
Don't forget to catch the events.

LICENSE:

The MIT License (MIT)

Copyright (c) 2014 Othello Ventures Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

enyo.kind({
	name: "FeedSpider2.OAuthIFrame",
	tag: "iframe",
	
	events: {
		onOAuthSuccess: "", // Called when the full OAuth operation has completed. Returns a javascript object with authentication info.
		onCodeGot: "", // Called when the access code has been received after a successful login to an oAuth Provider
		onOAuthFailure: "" // Called when something goes wrong
	},
	
	//Handle Browser events
	handlers: {
		onmozbrowserlocationchange: "locationChanged", 	
	},
	
	//Need to set these attributes to enable the iframe to work in Firefox OS
	attributes: {
		mozbrowser: true, 
		remote: true,
	},
	
	create: function() {
		//Enyo does not listen for Firefox OS browser events by default, so we have to specify them manually in the constructor.
		enyo.dispatcher.listen(document, "mozbrowserlocationchange")
		
		this.inherited(arguments)
	},
	
	beginOAuth: function(settings){
		// Set up the OAuth Session based on the settings object
		this.method = null
		this.logoutURL = undefined
		this.requestTokenUrl = settings.requestTokenUrl
		this.authorizeUrl = settings.authorizeUrl
		this.accessTokenUrl = settings.accessTokenUrl
		this.client_id = settings.client_id
		this.client_secret = settings.client_secret
		if (settings.redirect_uri != undefined) {
			this.redirect_uri = settings.redirect_uri
		}
		else {
			this.redirect_uri = "oob"
		}
		this.response_type = settings.response_type
		if (settings.accessTokenMethod != undefined) {
			this.accessTokenMethod = settings.accessTokenMethod
		}
		else {
			this.accessTokenMethod = "GET"
		}
		this.scope = settings.scope
		this.url = ""
		this.requested_token = ""
		this.exchangingToken = false
		if (settings.additionalParameters != undefined) {
			this.additionalParameters = settings.additionalParameters
		}
		else {
			this.additionalParameters = null	
		}
		
		// Process the parameters and build the OAuth URL
		var scope = ""
		for(var permission in this.scope) {
			if(typeof(this.scope[permission]) == 'function')continue;
			if(scope != "") scope = scope + "+"
			scope = scope + this.scope[permission]
		}
	
		var url = this.authorizeUrl + "?client_id=" + this.client_id + "&redirect_uri=" + this.redirect_uri + "&response_type=" + this.response_type
		if(scope != "") url = url + "&scope=" + scope
		if(this.additionalParameters) url = url + "&" + this.additionalParameters
		
		//Begin OAuth process
		this.setAttribute("src", url)
		this.node.purgeHistory()
	},
	
	locationChanged: function(inSender, inEvent) {
    	var callbackURL = inEvent.detail
		var responseVars = callbackURL.split("?")
		if (!this.exchangingToken && (responseVars[0] == this.redirect_uri + "/" || responseVars[0] == this.redirect_uri)) {
			var response_param = responseVars[1]
			var result = response_param.match(/code=*/g)
			if (result != null) {
				// Raise an event so that the UI handler can deal with the element visibility
				this.doCodeGot()
				
				// Try and logout from the oauth provider. (See method for more details).
				if (this.logoutURL != undefined)
				{
					this.setAttribute("src", this.logoutURL)
				} 
				
				var params = response_param.split("&")
				var code = params[0].replace("code=", "")
				
				this.codeToToken(code)
			}
		}
		else
		{
			this.logoutURL = this.getLogoutURL(callbackURL)
		}
  	},
  	
  	codeToToken: function(code) {
		this.exchangingToken = true
		this.url = this.accessTokenUrl
		this.code = code
		this.method = this.accessTokenMethod
		
		var postParams = {
			client_id: this.client_id,
			client_secret: this.client_secret,
			code: this.code,
			grant_type: "authorization_code",
			redirect_uri: this.redirect_uri
		}
		
		var postBody = ""
		for (var name in postParams) {
			if (postBody == "") {
				postBody = name + "=" + postParams[name]
			}
			else {
				postBody = postBody + "&" + name + "=" + postParams[name]
			}
		}

		var xhr = new XMLHttpRequest({mozSystem: true})
		xhr.timeout = 30000
		xhr.open(this.method, this.url, true)
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xhr.addEventListener("load", enyo.bind(this, this.processResponse), false)
		xhr.addEventListener("error", enyo.bind(this, this.processFailure), false)
		xhr.send(postBody)
	},
	
	processResponse: function(inEvent) {
		if (inEvent.target.status == 200 && inEvent.target.readyState == 4 && inEvent.target.responseText != "") {		
			try {
				var responseJSON = JSON.parse(inEvent.target.responseText)
				this.doOAuthSuccess(responseJSON)
			}
			catch (e) {
				this.doOAuthFailure()
			}
		}
		else {
			this.doOAuthFailure()
		}
	},
	
	processFailure: function(inEvent) {
		this.doOAuthFailure()
	},
	
	// Due to the way that Firefox OS browser sessions handle credentials, simply calling purgeHistory() on the
	// iframe will not clear logged on sessions. So we need to clear the logged on session manually. We don't need
	// it after we've received the OAuth code anyways, and if we don't, there is no way to log in using a different
	// account of the same type.
	getLogoutURL: function(url) {
		if (url.indexOf("accounts.google.com") !== -1){
			return "https://accounts.google.com/logout"
		}
		else if (url.indexOf("public-api.wordpress.com") !== -1) {
			return "https://wordpress.com/wp-login.php?action=logout"
		}
		else if (url.indexOf("twitter.com") !== -1) {
			return "https://twitter.com/logout"
		}
		else if (url.indexOf("api.screenname.aol.com") !== -1) {
			return "https://api.screenname.aol.com/auth/logout"
		}
		else if (url.indexOf("facebook.com") !== -1) {
			// Facebook does not appear to define a global logout URL at this time.
			return undefined
		}
		else if (url.indexOf("live.com") !== -1) {
			return "https://login.live.com/logout.srf"
		}
		else if (url.indexOf("evernote.com") !== -1) {
			return "https://www.evernote.com/Logout.action"
		}
		else {
			return undefined
		}
	}
});