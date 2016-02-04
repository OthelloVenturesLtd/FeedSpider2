enyo.kind({
	name: "FeedSpider2.InstapaperLoginDialog",
	kind: "onyx.Popup",
	modal: false,
	autoDismiss: false,
	floating: true,
	centered: true,
	scrim: true,
	
	style: "padding-top: 10px; padding-left: 20px; padding-right: 20px; padding-bottom: 20px; width: 80%; max-width: 300px;",
	
	events: {
		onCredentialsSaved: "",
		onDismiss: ""	
	},
	
	components: [
		{name: "loginWindow", style: "text-align: center", components: [
			{name: "dialogTitle", tag: "p", style: "text-align:center; font-weight: bold; font-size: 18px"},
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
			{name: "errorMessage", tag: "div", style: "color: red; font-size 14px; font-weight: bold; margin-bottom: 10px;", showing: false},
			{components: [ 
				{name: "loginButton", kind: "onyx.Button", classes: "onyx-affirmative", style: "width: 38%", ontap: "checkCredentials"},
				{name: "cancelButton", kind: "onyx.Button", style: "margin-left: 4%; width: 38%", ontap: "cancelLogin"}
			]}
		]},
	],
	
  	create: function() {
    	this.inherited(arguments);
    	console.log("PING!!!")
		this.$.dialogTitle.setContent($L("Instapaper Login"));
		this.$.errorMessage.setContent($L("Login Failed"));
		this.$.loginButton.setContent($L("Login"));
		this.$.cancelButton.setContent($L("Cancel"));
		this.$.usernameInput.setPlaceholder($L("Username"));
		this.$.passwordInput.setPlaceholder($L("Password"));
	},
	
	show: function() {
		console.log("2")
		this.activate();
		console.log("3")
		this.inherited(arguments);
		console.log("4")  
	},
	
	hide: function() {
		this.$.usernameInput.setValue("");
		this.$.passwordInput.setValue("");
		this.inherited(arguments);      
	},

	activate: function() {
		var username = FeedSpider2.Preferences.getInstapaperUsername();
		
		if(username)
		{
			this.$.usernameInput.setValue(username);
			this.$.errorMessage.show();
		}
		else
		{
			this.$.errorMessage.hide();
		}
	},
	
	checkCredentials: function() {
		if (this.$.usernameInput.value === "" || this.$.passwordInput.value === "")
		{
			return;
		}
					
		FeedSpider2.Preferences.setInstapaperUsername(this.$.usernameInput.value);
		FeedSpider2.Preferences.setInstapaperPassword(this.$.passwordInput.value);
				
		this.doCredentialsSaved();
	},
	
	cancelLogin: function() {
		this.doDismiss();
	},
	
	checkFocus: function(source, event) {
		source.addStyles("color: black");
	},

	checkBlur: function(source, event) {
		source.addStyles("color: white");
	}
});