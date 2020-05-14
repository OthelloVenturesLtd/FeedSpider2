enyo.kind({
	name: "FeedSpider2.LoginDialog",
	kind: "onyx.Popup",
	modal: false,
	autoDismiss: false,
	floating: true,
	centered: true,
	scrim: true,
	
	style: "padding-top: 10px; padding-left: 20px; padding-right: 20px;  padding-bottom: 20px; width: 80%; max-width: 300px; ",
	
	published: {
		api: null,
		credentials: null
	},

	events: {
		onLoginSuccess: "",	
	},
	
	components: [
		{name: "loginWindow", style: "text-align: center", components: [
			{name: "dialogTitle", tag: "p", style: "text-align:center; font-weight: bold; font-size: 18px"},	
			{kind: "onyx.PickerDecorator", style: "width: 100%;", components: [
				{classes: "onyx-dark", style: "width: 90%"},
				{name: "servicePicker", onChange: "setService", kind: "onyx.Picker", components: [
					{name: "bqPickerItem", value: "bq"},
					{name: "feedlyPickerItem", value: "feedly"},
					{name: "inoPickerItem", value: "ino"},
					{name: "ocPickerItem", value: "oc"},
					{name: "torPickerItem", value: "tor", active: true},
					{name: "ttrssPickerItem", value: "ttrss"}
				]}
			]},
			{tag: "div", style: "margin: 10px"},
			{name: "usernameGroup", components: [
				{kind: "onyx.InputDecorator", style: "width: 80%", components: [
					{name: "usernameInput", style: "width: 100%; color: white", kind: "onyx.Input", onfocus: "checkFocus", onblur: "checkBlur"}
				]},
				{tag: "div", style: "margin: 10px"},
			]},
			{name: "passwordGroup", components: [
				{kind: "onyx.InputDecorator", style: "width: 80%", components: [
					{name: "passwordInput",  style: "width: 100%; color: white", kind: "onyx.Input", type: "password", onfocus: "checkFocus", onblur: "checkBlur"}
				]},
				{tag: "div", style: "margin: 10px"},
			]},
			{name: "serverURLGroup", components: [
				{kind: "onyx.InputDecorator", style: "width: 80%", components: [
					{name: "serverURLInput",  style: "width: 100%; color: white", kind: "onyx.Input", type: "url", oninput: "checkKeys", onfocus: "checkFocus", onblur: "checkBlur"}
				]},
				{tag: "div", style: "margin: 10px"},
			]},
			{name: "errorMessage", tag: "div", style: "color: red; font-size 14px; font-weight: bold; margin-bottom: 10px; display:none"},
			{name: "loginButton", kind: "onyx.Button", classes: "onyx-affirmative", style: "width: 60%", ontap: "checkCredentials"}
		]},
		{name: "loginSpinner", style: "text-align: center;", showing: false, components: [
			{kind: "onyx.Spinner", style: "background: url('assets/login-spinner.gif') no-repeat 0 0;width: 132px; height: 132px"},
			{name: "loginSpinnerLabel", tag: "p", style: "text-align:center; font-weight: bold; font-size: 20px"},
		]},
		{name: "oAuthBrowserWrapperFFOS", kind: "enyo.FittableRows", style: "width: 100%; text-align: left;", showing: false, components: [
			{name: "backButtonFFOS", kind: "onyx.IconButton", style: "margin-bottom: 5px;", ontap: "browserGoBack", src: "assets/go-back.png"},
			{name: "oAuthBrowserFFOS", kind: "FeedSpider2.OAuthIFrame", style: "height: 300px; width: 100%;", onOAuthSuccess: "oasuccess", onCodeGot: "codegot", onOAuthFailure: "oafailure"}
		]},
		{name: "oAuthBrowserWrapperWebOS", kind: "enyo.FittableRows", style: "width: 100%; text-align: left;", showing: false, components: [
			{components:[
				{name: "backButtonWebOS", kind: "onyx.IconButton", style: "margin-bottom: 5px;", ontap: "browserGoBack", src: "assets/go-back.png"},
				{name: "smallSpinnerWebOS", kind: "onyx.Icon", src: "assets/small-spinner.gif", style: "float: right;", showing: false},
			]},
			{name: "oAuthBrowserWebOS", kind: "FeedSpider2.OAuthWebView", style: "width: 100%;", onOAuthSuccess: "oasuccess", onCodeGot: "codegot", onOAuthFailure: "oafailure", onLoadStarted: "showOauthSpinner", onLoadStopped: "hideOauthSpinner", onLoadComplete: "hideOauthSpinner",}
		]}
	],
	
  	create: function() {
    	this.inherited(arguments);
		this.$.dialogTitle.setContent($L("Login"));
		this.$.bqPickerItem.setContent($L("BazQux Reader"));
		this.$.feedlyPickerItem.setContent($L("Feedly"));
		this.$.inoPickerItem.setContent($L("InoReader"));
		this.$.ocPickerItem.setContent($L("OwnCloud News"));
		this.$.torPickerItem.setContent($L("The Old Reader"));
		this.$.ttrssPickerItem.setContent($L("Tiny Tiny RSS"));
		this.$.errorMessage.setContent($L("Login Failed"));
		this.$.loginButton.setContent($L("Login"));
		this.$.loginSpinnerLabel.setContent($L("Logging In..."));
		this.$.usernameInput.setPlaceholder($L("Username"));
		this.$.passwordInput.setPlaceholder($L("Password"));
		this.$.serverURLInput.setPlaceholder($L("Server URL"));
		
		//LuneOS does not support enyo 1 webview at this point. May implement an iFrame based
		//system in the future.
		if (!enyo.platform.webos && window.PalmSystem)
		{
			this.$.aolPickerItem.hide();
			this.$.feedlyPickerItem.hide();
		}
		
		this.setService();
	},
	
	rendered: function() {
		this.inherited(arguments);
		this.activate();
		if(((this.get("credentials").get("service") !== "ttrss" || this.get("credentials").get("service") !== "oc") && this.get("credentials").get("email") && this.get("credentials").get("password")) || 
			((this.get("credentials").get("service") === "ttrss" || this.get("credentials").get("service") === "oc") && this.get("credentials").get("email") && this.get("credentials").get("password") && this.get("credentials").get("server")) || 
			this.get("credentials").get("service") === "feedly") {
			this.tryLoginWithSavedCredentials();
		}        
	},

	activate: function() {
		// Get credentials for login
		this.set("credentials", new FeedSpider2.Credentials());
	},
	
	setService: function() {
		//This method is called like this since it is the onchange handler for the servicePicker, so is initially called before
		//the groups are created - so we need to ignore it on the first run (ie. the groups don't yet exist)
		if(this.$.usernameGroup !== undefined){
			if (this.$.servicePicker.selected.value == "feedly")
			{
				this.$.usernameGroup.hide();
				this.$.passwordGroup.hide();
				this.$.serverURLGroup.hide();
			}
			else if (this.$.servicePicker.selected.value == "ttrss" || this.$.servicePicker.selected.value == "oc")
			{
				this.$.usernameGroup.show();
				this.$.passwordGroup.show();
				this.$.serverURLGroup.show();
			}
			else
			{
				this.$.usernameGroup.show();
				this.$.passwordGroup.show();
				this.$.serverURLGroup.hide();
			}
		}
	},
	
	checkCredentials: function() {
		this.get("credentials").set("service", this.$.servicePicker.selected.value);
		if (this.$.servicePicker.selected.value == "feedly")
		{
			this.tryLogin();
		}
		else
		{
			if (this.$.usernameInput.value === "" || this.$.passwordInput.value === "")
			{
				this.loginFailure();
				return;
			}
			
			if ((this.$.servicePicker.selected.value == "ttrss" || this.$.servicePicker.selected.value == "oc") && this.$.serverURLInput.value === "")
			{
				this.loginFailure();
				return;
			}
			else
			{
				this.get("credentials").set("server", this.$.serverURLInput.value);
			}
			
			this.get("credentials").set("email", this.$.usernameInput.value);
			this.get("credentials").set("password", this.$.passwordInput.value);
					
			this.tryLogin();
		}
	},
	
	tryLogin: function() {
		//Clear Fields
		this.$.usernameInput.setValue("");
		this.$.passwordInput.setValue("");
		this.$.serverURLInput.setValue("");
		
		// Hide the window and put up the spinner
		this.$.loginWindow.hide();
		if (this.get("credentials").get("service") == "feedly")
		{
			if(enyo.platform.firefoxOS)
			{
				this.$.oAuthBrowserWrapperFFOS.show();
			}
			
			if(enyo.platform.webos || window.PalmSystem)
			{
				this.$.oAuthBrowserWrapperWebOS.show();
			}
		}
		else
		{
			this.$.loginSpinner.show();
		}
		
		// Attempt login
		this.set("api", this.generateAPI(this.get("credentials")));
    	this.get("api").login(this.get("credentials"), this.loginSuccess.bind(this), this.loginFailure.bind(this), this);
	},

	tryLoginWithSavedCredentials: function() {
		//Clear Fields
		this.$.usernameInput.setValue("");
		this.$.passwordInput.setValue("");
		this.$.serverURLInput.setValue("");
		
		// Hide the window and put up the spinner
		this.$.loginWindow.hide();
		this.$.loginSpinner.show();
		this.resize();
		
		// Attempt login
		this.set("api", this.generateAPI(this.get("credentials")));
    	this.get("api").login(this.get("credentials"), this.loginSuccess.bind(this), this.loginFailure.bind(this), this);
	},
	
	codegot: function(inSender, inEvent) {
		this.$.oAuthBrowserWrapperFFOS.hide();
		this.$.oAuthBrowserWrapperWebOS.hide();
		this.$.loginSpinner.show();
	},
	
	oasuccess: function(inSender, inEvent) {
		//Set up the credentials object
		this.get("credentials").set("email", false);
		this.get("credentials").set("password", false);
		this.get("credentials").set("id", inEvent.id);
		this.get("credentials").set("refreshToken", inEvent.refresh_token);
		this.get("credentials").set("accessToken", inEvent.access_token);
		this.get("credentials").set("tokenType", inEvent.token_type);
		this.get("credentials").set("plan", inEvent.plan);
		
		var expiryDate = new Date();
		expiryDate.setSeconds(expiryDate.getSeconds() + inEvent.expires_in);
		this.get("credentials").set("tokenExpiry", expiryDate.getTime());
		
		this.get("api").login(this.get("credentials"), this.loginSuccess.bind(this), this.loginFailure.bind(this), this);
	},
	
	oafailure: function(inSender, inEvent) {
		this.loginFailure();
	},
	
	browserGoBack: function(inSender, inEvent)
	{	
		var self = this;
		
		if(enyo.platform.firefoxOS)
		{
			canGoBack = this.$.oAuthBrowserFFOS.eventNode.getCanGoBack();
		
			canGoBack.onsuccess = function(){
				if (this.result) {
					self.$.oAuthBrowserFFOS.eventNode.goBack();
				}
				else {
					self.$.oAuthBrowserWrapperFFOS.hide();
					self.$.loginWindow.show();
				}
			};
		}
		
		if(enyo.platform.webos || window.PalmSystem)
		{
			if (!this.$.oAuthBrowserWebOS.canGoBack) {
				this.$.oAuthBrowserWrapperWebOS.hide();
				this.$.loginWindow.show();
			}
			else {
				this.$.oAuthBrowserWebOS.goBack();
			}
		}
	},
	
	showOauthSpinner: function() {
		this.$.smallSpinnerWebOS.show();
	},
	
	hideOauthSpinner: function() {
		this.$.smallSpinnerWebOS.hide();
	},
	
	loginSuccess: function() {
		//On success, bubble up a success event, and pass the primed API
		this.get("credentials").save();

		//Reset the window for next time
		this.$.oAuthBrowserWrapperFFOS.hide();
		this.$.oAuthBrowserWrapperWebOS.hide();
		this.$.errorMessage.hide();
		this.$.loginSpinner.hide();
		this.$.loginWindow.show();
		
		this.doLoginSuccess(this.get("api"));
	},
	
	loginFailure: function() {
		//On failure, populate the fields
		for (var i = 0; i < this.$.servicePicker.controls.length; i++) {
        	if (this.$.servicePicker.controls[i].value === this.get("credentials").get("service")) {
            	this.$.servicePicker.setSelected(this.$.servicePicker.controls[i]);
        	}
    	}
		
		if (this.get("credentials").get("email"))
		{
			this.$.usernameInput.setValue(this.get("credentials").get("email"));
		}
		if (this.get("credentials").get("server"))
		{
			this.$.serverURLInput.setValue(this.get("credentials").get("server"));
		}
		
		//Next, hide the spinner and clear the window
		this.$.oAuthBrowserWrapperFFOS.hide();
		this.$.oAuthBrowserWrapperWebOS.hide();
		this.$.loginSpinner.hide();
		this.$.errorMessage.show();
		this.$.loginWindow.show();
	},

	checkFocus: function(source, event) {
		source.addStyles("color: black");
	},

	checkBlur: function(source, event) {
		source.addStyles("color: white");
	},

	generateAPI: function(credentials)
	{
		var api;

		switch(credentials.get("service"))
		{
			case "tor":
				api = new FeedSpider2.TorAPI();
				break;
			case "ino":
				api = new FeedSpider2.InoAPI();
				break;
			case "bq":
				api = new FeedSpider2.BQAPI();
				break;
			case "ttrss":
				api = new FeedSpider2.TTRSSAPI();
				break;
			case "feedly":
				api = new FeedSpider2.FeedlyAPI();
				break;
			case "oc":
				api = new FeedSpider2.OCAPI();
				break;
			default:
				api = new FeedSpider2.API();  		
		}

		return api;
	}
});