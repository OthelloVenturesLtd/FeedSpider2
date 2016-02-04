var Log = {
  items: [],

  debug: function(message) {
    if(FeedSpider2.Preferences.isDebugging()) {
      console.log(message)
      this.items.push({message: message})
    }
  }
}