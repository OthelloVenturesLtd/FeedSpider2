enyo.kind({
	name: "FeedSpider2.LoginDialog",
	kind: "onyx.Popup",
	modal: false,
	autoDismiss: false,
	floating: true,
	centered: true,
	scrim: true,
	
	style: "padding-top: 10px; padding-left: 20px; padding-right: 20px;  padding-bottom: 20px; width: 80%; max-width: 300px",
	
	events: {
		onLoginSuccess: "",	
	},
	
	components: [
		{name: "loginWindow", style: "text-align: center", components: [
			{name: "dialogTitle", tag: "p", style: "text-align:center; font-weight: bold; font-size: 18px"},	
			{kind: "onyx.PickerDecorator", style: "width: 100%;", components: [
				{classes: "onyx-dark", style: "width: 90%"},
				{name: "servicePicker", onChange: "setService", kind: "onyx.Picker", components: [
					{name: "aolPickerItem", value: "aol"},
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
		{name: "loginSpinner", style: "text-align: center; display: none", components: [
			{kind: "onyx.Spinner", style: "background: url('assets/login-spinner.gif') no-repeat 0 0;width: 132px; height: 132px"},
			{name: "loginSpinnerLabel", tag: "p", style: "text-align:center; font-weight: bold; font-size: 20px"},
		]},
		{name: "oAuthBrowserWrapper", kind: "enyo.FittableRows", style: "width: 100%; text-align: left; display: none", components: [
			{name: "backButton", kind: "onyx.IconButton", style: "margin-bottom: 5px;", ontap: "browserGoBack", src: "assets/go-back.png"},
			{name: "oAuthBrowser", kind: "FeedSpider2.OAuthIFrame", style: "height: 300px; width: 100%;", onOAuthSuccess: "oasuccess", onCodeGot: "codegot", onOAuthFailure: "oafailure"}
		]}
	],
	
  	create: function() {
    	this.inherited(arguments);
		this.$.dialogTitle.setContent($L("Login"));
		this.$.aolPickerItem.setContent($L("AOL Reader"));
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
		
		this.setService();
	},
	
	rendered: function() {
		this.inherited(arguments);
		this.activate();
		if(((this.credentials.service !== "ttrss" || this.credentials.service !== "oc") && this.credentials.email && this.credentials.password) || ((this.credentials.service === "ttrss" || this.credentials.service === "oc") && this.credentials.email && this.credentials.password && this.credentials.server) || this.credentials.service === "feedly" || this.credentials.service === "aol" ) {
			this.tryLoginWithSavedCredentials();
		}        
	},

	activate: function() {
		// Get credentials for login
		this.credentials = new Credentials();
	},
	
	setService: function() {
		//This method is called like this since it is the onchange handler for the servicePicker, so is initially called before
		//the groups are created - so we need to ignore it on the first run (ie. the groups don't yet exist)
		if(this.$.usernameGroup != undefined){
			if (this.$.servicePicker.selected.value == "feedly" || this.$.servicePicker.selected.value == "aol")
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
		this.credentials.service = this.$.servicePicker.selected.value
		if (this.$.servicePicker.selected.value == "feedly" || this.$.servicePicker.selected.value == "aol")
		{
			this.tryLogin();
		}
		else
		{
			if (this.$.usernameInput.value == "" || this.$.passwordInput.value == "") 
			{
				this.loginFailure();
				return
			}
			
			if ((this.$.servicePicker.selected.value == "ttrss" || this.$.servicePicker.selected.value == "oc") && this.$.serverURLInput.value == "")
			{
				this.loginFailure();
				return			
			}
			else
			{
				this.credentials.server = this.$.serverURLInput.value;
			}
			
			this.credentials.email = this.$.usernameInput.value;
			this.credentials.password = this.$.passwordInput.value;
					
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
		if (this.credentials.service == "feedly" || this.credentials.service == "aol")
		{
			this.$.oAuthBrowserWrapper.show();
		}
		else
		{
			this.$.loginSpinner.show();
		}
		
		// Attempt login
    	this.api = new Api();
    	this.api.login(this.credentials, this.loginSuccess.bind(this), this.loginFailure.bind(this), this);
	},

	tryLoginWithSavedCredentials: function() {
		//Clear Fields
		this.$.usernameInput.setValue("");
		this.$.passwordInput.setValue("");
		this.$.serverURLInput.setValue("");
		
		// Hide the window and put up the spinner
		this.$.loginWindow.hide();
		this.$.loginSpinner.show();
		
		// Attempt login
    	this.api = new Api();
    	this.api.login(this.credentials, this.loginSuccess.bind(this), this.loginFailure.bind(this), this);
	},
	
	codegot: function(inSender, inEvent) {
		this.$.oAuthBrowserWrapper.hide();
		this.$.loginSpinner.show();
	},
	
	oasuccess: function(inSender, inEvent) {
		//Set up the credentials object
		this.credentials.email = false;
		this.credentials.password = false;
		this.credentials.id = inEvent.id;
		this.credentials.refreshToken = inEvent.refresh_token;
		this.credentials.accessToken = inEvent.access_token;
		this.credentials.tokenType = inEvent.token_type;
		this.credentials.plan = inEvent.plan;
		
		var expiryDate = new Date();
		expiryDate.setSeconds(expiryDate.getSeconds() + inEvent.expires_in);
		this.credentials.tokenExpiry = expiryDate.getTime();
		
		this.api.login(this.credentials, this.loginSuccess.bind(this), this.loginFailure.bind(this), this);
	},
	
	oafailure: function(inSender, inEvent) {
		this.loginFailure();
	},
	
	browserGoBack: function(inSender, inEvent)
	{	
		var self = this;
		
		canGoBack = this.$.oAuthBrowser.eventNode.getCanGoBack();
		
		canGoBack.onsuccess = function(){
			if (this.result) {
				self.$.oAuthBrowser.eventNode.goBack();
			}
			else {
				self.$.oAuthBrowserWrapper.hide();
				self.$.loginWindow.show();
			}
		}
	},
	
	loginSuccess: function() {
		//On success, bubble up a success event, and pass the primed API
		this.credentials.save();

		//Reset the window for next time
		this.$.oAuthBrowserWrapper.hide();
		this.$.errorMessage.hide();
		this.$.loginSpinner.hide();
		this.$.loginWindow.show();
		
		this.doLoginSuccess(this.api);
	},
	
	loginFailure: function() {
		//On failure, populate the fields
		for (var i = 0; i < this.$.servicePicker.controls.length; i++) {
        	if (this.$.servicePicker.controls[i].value === this.credentials.service) {
            	this.$.servicePicker.setSelected(this.$.servicePicker.controls[i]);
        	}
    	}
		
		if (this.credentials.email)
		{
			this.$.usernameInput.setValue(this.credentials.email);
		}
		if (this.credentials.server)
		{
			this.$.serverURLInput.setValue(this.credentials.server);
		}
		
		//Next, hide the spinner and clear the window
		this.$.oAuthBrowserWrapper.hide();
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
});