enyo.kind({
	name: "FeedSpider2.LoginDialog",
	kind: "onyx.Popup",
	modal: false,
	autoDismiss: false,
	floating: true,
	centered: true,
	scrim: true,
	
	style: "padding-top: 10px; padding-left: 20px; padding-right: 20px;  padding-bottom: 20px; width: 40%;",
	
	events: {
		onLoginSuccess: "",	
	},
	
	components: [
		{name: "loginWindow", style: "text-align: center", components: [
			{tag: "p", content: "Login", style: "text-align:center; font-weight: bold; font-size: 18px"},	
			{kind: "onyx.PickerDecorator", style: "width: 100%;", components: [
				{classes: "onyx-dark", style: "width: 90%"},
				{name: "servicePicker", onChange: "setService", kind: "onyx.Picker", components: [
					{content: "AOL Reader", value: "aol"},
					{content: "BazQux Reader", value: "bq"},
					{content: "Feedly", value: "feedly"},
					{content: "InoReader", value: "ino"},
					{content: "OwnCloud News", value: "oc"},
					{content: "The Old Reader", value: "tor", active: true},
					{content: "Tiny Tiny RSS", value: "ttrss"}
				]}
			]},
			{tag: "div", style: "margin: 10px"},
			{name: "usernameGroup", components: [
				{kind: "onyx.InputDecorator", style: "width: 80%", components: [
					{name: "usernameInput", style: "width: 100%; color: white", kind: "onyx.Input", placeholder: "Username", onfocus: "checkFocus", onblur: "checkBlur"}
				]},
				{tag: "div", style: "margin: 10px"},
			]},
			{name: "passwordGroup", components: [
				{kind: "onyx.InputDecorator", style: "width: 80%", components: [
					{name: "passwordInput",  style: "width: 100%", kind: "onyx.Input", placeholder: "Password", type: "password", onfocus: "checkFocus", onblur: "checkBlur"}
				]},
				{tag: "div", style: "margin: 10px"},
			]},
			{name: "serverURLGroup", components: [
				{kind: "onyx.InputDecorator", style: "width: 80%", components: [
					{name: "serverURLInput",  style: "width: 100%", kind: "onyx.Input", placeholder: "Server URL", type: "url", oninput: "checkKeys", onfocus: "checkFocus", onblur: "checkBlur"}
				]},
				{tag: "div", style: "margin: 10px"},
			]},
			{name: "errorMessage", tag: "div", style: "color: red; font-size 14px; font-weight: bold; margin-bottom: 10px; display:none", content: "Login Failed!"},
			{kind: "onyx.Button", classes: "onyx-affirmative", style: "width: 60%", content: "Login", ontap: "checkCredentials"}
		]},
		{name: "loginSpinner", style: "text-align: center; display: none", components: [
			{kind: "onyx.Spinner", style: "background: url('assets/login-spinner.gif') no-repeat 0 0;width: 132px; height: 132px"},
			{tag: "p", content: "Logging In...", style: "text-align:center; font-weight: bold; font-size: 20px"},
		]}
	],
	
  	create: function() {
    	this.inherited(arguments);
		this.setService();
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
				this.credentials.server = this.$.serverURLInput.value
			}
			
			this.credentials.email = this.$.usernameInput.value
			this.credentials.password = this.$.passwordInput.value
					
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
		this.$.loginSpinner.show();
		this.render();
		
		// Attempt login
    	this.api = new Api();
    	this.api.login(this.credentials, this.loginSuccess.bind(this), this.loginFailure.bind(this));
	},
	
	loginSuccess: function(){
		//On success, bubble up a success event, and pass the primed API
		this.credentials.save();
		this.doLoginSuccess(this.api);
	},
	
	loginFailure: function(){
		//On failure, populate the fields
		for (var i = 0; i < this.$.servicePicker.controls.length; i++) {
        	if (this.$.servicePicker.controls[i].value === this.credentials.service) {
            	this.$.servicePicker.setSelected(this.$.servicePicker.controls[i]);
        	}
    	}
		
		if (this.credentials.email)
		{
			this.$.usernameInput.setValue(this.credentials.email)
		}
		if (this.credentials.server)
		{
			this.$.serverURLInput.setValue(this.credentials.server)
		}
		
		//Next, hide the spinner and clear the window
		this.$.loginSpinner.hide();
		this.$.errorMessage.show();
		this.$.loginWindow.show();
		this.render();
	},

	checkFocus: function(source, event) {
		source.addStyles("color: black")
	},

	checkBlur: function(source, event) {
		source.addStyles("color: white")
	},
});