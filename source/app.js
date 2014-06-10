/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "FeedSpider2.Application",
	kind: "enyo.Application",
	view: "FeedSpider2.BasePanels"
});

enyo.ready(function () {
	new FeedSpider2.Application({name: "feedspider"});
});
