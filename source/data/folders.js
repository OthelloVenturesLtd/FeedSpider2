enyo.kind({
	name: "FeedSpider2.Folders",

	published: {
		api: null,
		items: null
	},

	create: function() {
		this.set("items", []);
		this.inherited(arguments);
	},

	clear: function() {
		this.get("items").clear();
	},

	addSubscription: function(id, label, subscription) {
		var folder = this.get("items").find(function(f) {return f.id == id;});

		if(!folder) {
			folder = new FeedSpider2.Folder({api: this.get("api"), title: label, id: id});
			this.get("items").push(folder);
		}

		folder.addSubscription(subscription);
	},

	addSortIds: function(success, failure) {
		var self = this;

		self.get("api").getTags(
			function(tags) {
				tags.forEach(function(tag) {
					var folder = self.get("items").find(function(item) {return item.id == tag.id;});
					if(folder) folder.set("sortId", tag.sortid);
				});
				
				success();
			},
			failure
		);
	}
});