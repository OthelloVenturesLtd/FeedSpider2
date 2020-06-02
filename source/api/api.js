enyo.kind({
	name: "FeedSpider2.API",

	//Stub Methods for API Interface
	login: function(credentials, success, failure, controller) {},

	getTags: function(success, failure) {},

	getSortOrder: function(success, failure) {},

	setSortOrder: function(sortOrder, stream) {},

	unsubscribe: function(feed) {},

	removeLabel: function(folder) {},

	searchSubscriptions: function(query, success, failure) {},

	addSubscription: function(url, success, failure) {},

	getAllSubscriptions: function(success, failure) {},

	cacheTitles: function(subscriptions) {},

	titleFor: function(id) {},

	getUnreadCounts: function(success, failure) {},

	getAllArticles: function(continuation, success, failure) {},

	getAllStarred: function(continuation, success, failure) {},

	getAllShared: function(continuation, success, failure) {},
	
	getAllFresh: function(continuation, success, failure) {},
	
	getAllArchived: function(continuation, success, failure) {},

	getAllArticlesFor: function(id, continuation, success, failure) {},

	markAllRead: function(id, success, failure) {},

	search: function(query, id, success, failure) {},

	searchItemsFound: function(success, failure, response) {},

	mapSearchResults: function(response) {},

	setArticleRead: function(articleId, subscriptionId, success, failure) {},

	setArticleNotRead: function(articleId, subscriptionId, success, failure, sticky) {},

	setArticleShared: function(articleId, subscriptionId, success, failure) {},

	setArticleNotShared: function(articleId, subscriptionId, success, failure) {},

	setArticleStarred: function(articleId, subscriptionId, success, failure) {},

	setArticleNotStarred: function(articleId, subscriptionId, success, failure) {},
	
	supportsAllArticles: function() {},
	
	supportsFresh: function() {},
	
	supportsArchived: function() {},
	
	supportsStarred: function() {},
	
	supportsShared: function() {},
	
	supportsSearch: function() {},
	
	supportsManualSort: function() {}
});