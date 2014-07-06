// For More Info, See: https://developer.mozilla.org/en-US/docs/Web/API/Using_the_Browser_API
enyo.kind({
	name: "FeedSpider2.OAuthIFrame",
	tag: "iframe",
	
	events: {
		onOAuthSuccess: "",
		onCodeGot: "",
		onOAuthFailure: ""
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
		
		this.inherited(arguments);
	},
	
	beginOAuth: function(settings){
		this.method = null
		this.requestTokenUrl = settings.requestTokenUrl
		this.authorizeUrl = settings.authorizeUrl
		this.accessTokenUrl = settings.accessTokenUrl
		this.client_id = settings.client_id
		this.client_secret = settings.client_secret
		if (settings.redirect_uri != undefined) {
			this.redirect_uri = settings.redirect_uri
		}
		else {
			this.redirect_uri = 'oob'
		}
		this.response_type = settings.response_type
		if (settings.accessTokenMethod != undefined) {
			this.accessTokenMethod = settings.accessTokenMethod
		}
		else {
			this.accessTokenMethod = 'GET'
		}
		this.scope = settings.scope
		this.url = ''
		this.requested_token = ''
		this.exchangingToken = false
		if (settings.additionalParameters != undefined) {
			this.additionalParameters = settings.additionalParameters
		}
		else {
			this.additionalParameters = null	
		}
		
		// Process the parameters and build the OAuth URL
		var scope = ''
		for(var now in this.scope) {
			if(typeof(this.scope[now]) == 'function')continue;
			if(scope != '') scope = scope + '+';
			scope = scope + this.scope[now];
		}
	
		var url = this.authorizeUrl + '?client_id=' + this.client_id + '&redirect_uri=' + this.redirect_uri + '&response_type=' + this.response_type
		if(scope != '') url = url + '&scope=' + scope
		if(this.additionalParameters) url = url + '&' + this.additionalParameters
		
		//Begin OAuth process
		this.setAttribute("src", url)
		this.node.purgeHistory()
	},
	
	locationChanged: function(inSender, inEvent) {
    	var callbackUrl = inEvent.detail;
		var responseVars = callbackUrl.split("?");
		if (!this.exchangingToken && (responseVars[0] == this.redirect_uri + '/' || responseVars[0] == this.redirect_uri)) {
			var response_param = responseVars[1];
			var result = response_param.match(/code=*/g);
			if (result != null) {
				// Raise an event so that the UI handler can deal with the element visibility
				this.doCodeGot();
				
				var params = response_param.split("&");
				var code = params[0].replace("code=", "");
				
				this.codeToken(code);
			}
		}
  	},
  	
  	codeToken: function(code) {
		this.exchangingToken = true;
		this.url = this.accessTokenUrl;
		this.code = code;
		this.method = this.accessTokenMethod;
		var postParams = {
			client_id: this.client_id,
			client_secret: this.client_secret,
			code: this.code,
			grant_type: 'authorization_code',
			redirect_uri: this.redirect_uri
		};
		var postBody = '';
		for (var name in postParams) {
			if (postBody == '') {
				postBody = name + '=' + postParams[name];
			}
			else {
				postBody = postBody + '&' + name + '=' + postParams[name];
			}
		}

		new Ajax.Request(this.url, {
			method: this.method,
			encoding: 'UTF-8',
			postBody: postBody,
			onComplete: function(response) {
				var response_text = response.responseText;

				if (response.status == 200)
				{
					var token = response.responseText.evalJSON();
					this.doOAuthSuccess(token);
				}
				else
				{
					this.doOAuthFailure();
				}
			}.bind(this)
		});
	}
});