enyo.ready(function () {
	if (window.location.search) {
		var fields = window.location.search.slice(1).split('&');

		for (var i = 0, field; field = fields[i]; i++) {
			fields[i] = field.split('=');
		}

		for (var i = 0, field; field = fields[i]; i++) {
			if (field[0] === "count") {
				var unreadCount = field[1];
			}
		}
	}
	new FeedSpider2.DashboardNotification({count: unreadCount}).renderInto(document.body);
});