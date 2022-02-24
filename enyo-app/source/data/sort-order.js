enyo.kind({
	name: "FeedSpider2.SortOrder",

	published: {
		sortIds: []
	},

	create: function(string) {
		this.inherited(arguments);
		var sortIds = [];
		for(var i = 0; i < string.length; i = i + 8)
		{
			sortIds.push(string.substr(i, 8));
		}
		this.set("sortIds", sortIds);
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