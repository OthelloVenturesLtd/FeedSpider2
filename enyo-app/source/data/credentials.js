enyo.kind({
  name: "FeedSpider2.Credentials",

  published:
  {
    accessToken: "",
    email: "",
    id: "",
    password: "",
    plan: "",
    refreshToken: "",
    server: "",
    service: "tor",
    tokenExpiry: "",
    tokenType: ""
  },

  create: function() {
    this.inherited(arguments);
    this.set("email", this.emailCookie());
    this.set("password", this.passwordCookie());
    this.set("server", this.serverCookie());
   	this.set("service", this.serviceCookie());
    this.set("id", this.idCookie());
    this.set("accessToken", this.accessTokenCookie());
    this.set("refreshToken", this.refreshTokenCookie());
    this.set("tokenExpiry", this.tokenExpiryCookie());
    this.set("tokenType", this.tokenTypeCookie());
    this.set("plan", this.planCookie());
  },

  save: function() {
    if (this.get("email") !== undefined && this.get("email") !== null){
    	this.setCookie("email", this.get("email"));
    }
    if (this.get("password") !== undefined && this.get("password") !== null){
    	this.setCookie("password", this.get("password"));
    }
    if (this.get("server") !== undefined && this.get("server") !== null){
     	this.setCookie("server", this.get("server"));
    }    
    if (this.get("service") !== undefined && this.get("service") !== null){
    	this.setCookie("service", this.get("service"));
    }
    if (this.get("id") !== undefined && this.get("id") !== null){
	   	this.setCookie("id", this.get("id"));
    }
    if (this.get("accessToken") !== undefined && this.get("accessToken") !== null){
	    this.setCookie("accessToken", this.get("accessToken"));
    }
    if (this.get("refreshToken") !== undefined && this.get("refreshToken") !== null){    
    	this.setCookie("refreshToken", this.get("refreshToken"));
    }
    if (this.get("tokenExpiry") !== undefined && this.get("tokenExpiry") !== null){
	    this.setCookie("tokenExpiry", this.get("tokenExpiry"));
    }
    if (this.get("tokenType") !== undefined && this.get("tokenType") !== null){
    	this.setCookie("tokenType", this.get("tokenType"));
    }
    if (this.get("plan") !== undefined && this.get("plan") !== null){
    	this.setCookie("plan", this.get("plan"));
    }
  },
  
  clear: function() {
    this.clearCookie("email");
    this.clearCookie("password");
    this.clearCookie("server");
    this.clearCookie("service");
    this.clearCookie("id");
    this.clearCookie("accessToken");
    this.clearCookie("refreshToken");
    this.clearCookie("tokenExpiry");
    this.clearCookie("tokenType");
    this.clearCookie("plan");
  },

  emailCookie: function() {
    return this.getCookie("email");
  },

  passwordCookie: function() {
    return this.getCookie("password");
  },
  
  serverCookie: function() {
    return this.getCookie("server");
  },

  serviceCookie: function() {
    return this.getCookie("service");
  },
  
  idCookie: function() {
    return this.getCookie("id");
  },
  
  accessTokenCookie: function() {
    return this.getCookie("accessToken");
  },

  refreshTokenCookie: function() {
    return this.getCookie("refreshToken");
  },

  tokenExpiryCookie: function() {
    return this.getCookie("tokenExpiry");
  },

  tokenTypeCookie: function() {
    return this.getCookie("tokenType");
  },

  planCookie: function() {
    return this.getCookie("plan");
  },

  getCookie: function(name) {
    if (localStorage.getItem(name) === null)
    {
    	return undefined;
    }
    else
    {
    	return JSON.parse(localStorage.getItem(name));
    }
  },
  
  setCookie: function(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  },
  
  clearCookie: function(name) {
  	localStorage.removeItem(name);
  }
});