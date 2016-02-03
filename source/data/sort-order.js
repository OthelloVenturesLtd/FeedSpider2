enyo.kind({
  name: "FeedSpider2.SortOrder",

  published: {
    sortIds: []
  },

  create: function(string) {
    this.inherited(arguments);
    this.set("sortIds", string.toArray().inGroupsOf(8).map(function(key){return key.join("");}));
  },

  getSortNumberFor: function(id) {
    var sortNumber = 0;

    for (var i = 0; i < this.get("sortIds").length; i++) {
      if(this.get("sortIds")[i] == id) {
        sortNumber = i;
        break;
      }
    }

    return sortNumber;
  }
});