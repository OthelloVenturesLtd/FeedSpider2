var Log = {
  items: [],

  debug: function(message) {
    if(Preferences.isDebugging()) {
      console.log(message)
      this.items.push({message: message})
    }
  }
}