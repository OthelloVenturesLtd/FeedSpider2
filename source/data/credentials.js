var Credentials = Class.create({
  initialize: function() {
    this.email = this.emailCookie()
    this.password = this.passwordCookie()
    this.server = this.serverCookie()
    if(this.serviceCookie())
    {
    	this.service = this.serviceCookie()
    }
    else
    {
    	this.service = "tor"
    }
    this.id = this.idCookie()
    this.accessToken = this.accessTokenCookie()
    this.refreshToken = this.refreshTokenCookie()
    this.tokenExpiry = this.tokenExpiryCookie()
    this.tokenType = this.tokenTypeCookie()
    this.plan = this.planCookie()
  },

  save: function() {
    if (this.email !== undefined || this.email !== null){
    	this.setCookie("email", this.email)
    }
    if (this.password !== undefined || this.password !== null){
    	this.setCookie("password", this.password)
    }
    if (this.server !== undefined || this.server !== null){
     	this.setCookie("server", this.server)
    }    
    if (this.service !== undefined || this.service !== null){
    	this.setCookie("service", this.service)
    }
    if (this.id !== undefined || this.id !== null){
	   	this.setCookie("id", this.id)
    }
    /if (this.accessToken !== undefined || this.accessToken !== null){
	    this.setCookie("accessToken", this.accessToken)
    }
    if (this.refreshToken !== undefined || this.refreshToken !== null){    
    	this.setCookie("refreshToken", this.refreshToken)
    }
    if (this.tokenExpiry !== undefined || this.tokenExpiry !== null){
	    this.setCookie("tokenExpiry", this.tokenExpiry)
    }
    if (this.tokenType !== undefined || this.tokenType !== null){
    	this.setCookie("tokenType", this.tokenType)
    }
    if (this.plan !== undefined || this.plan !== null){
    	this.setCookie("plan", this.plan)
    }*
  },
  
  clear: function() {
    this.removeCookie("email")
    this.removeCookie("password")
    this.removeCookie("server")
    this.removeCookie("service")
    this.removeCookie("id")
    this.removeCookie("accessToken")
    this.removeCookie("refreshToken")
    this.removeCookie("tokenExpiry")
    this.removeCookie("tokenType")
    this.removeCookie("plan")
  },

  emailCookie: function() {
    return this.getCookie("email")
  },

  passwordCookie: function() {
    return this.getCookie("password")
  },
  
  serverCookie: function() {
    return this.getCookie("server")
  },

  serviceCookie: function() {
    return this.getCookie("service")
  },
  
  idCookie: function() {
    return this.getCookie("id")
  },
  
  accessTokenCookie: function() {
    return this.getCookie("accessToken")
  },

  refreshTokenCookie: function() {
    return this.getCookie("refreshToken")
  },

  tokenExpiryCookie: function() {
    return this.getCookie("tokenExpiry")
  },

  tokenTypeCookie: function() {
    return this.getCookie("tokenType")
  },

  planCookie: function() {
    return this.getCookie("plan")
  },

  getCookie: function(name) {
    if (localStorage.getItem(name) == null)
    {
    	return undefined
    }
    else
    {
    	return localStorage.getItem(name)
    }
  },
  
  setCookie: function(name, value) {
    localStorage.setItem(name, value)
  },
  
  clearCookie: function(name) {
  	localStorage.removeItem(name)
  }
})
