enyo.kind({
	name: "FeedSpider2.EventList",
	kind: "enyo.List",

	events: {
		onSwipeAnimationComplete: "",
	},
	
	animateSwipe: function(targetX,totalTimeMS) {
		var t0 = enyo.now(), t = 0;
		var $item = this.$.swipeableComponents;
		var origX = parseInt($item.domStyles.left,10);
		var xDelta = targetX - origX;

		this.stopAnimateSwipe();

		var fn = enyo.bind(this, function() {
			var t = enyo.now() - t0;
			var percTimeElapsed = t/totalTimeMS;
			var currentX = origX + (xDelta)*Math.min(percTimeElapsed,1);

			// set new left
			$item.applyStyle("left",currentX+"px");

			// schedule next frame
			this.job = enyo.requestAnimationFrame(fn);

			// potentially override animation TODO

			// go until we've hit our total time
			if(t/totalTimeMS >= 1) {
				this.stopAnimateSwipe();
				this.completeSwipeTimeout = setTimeout(enyo.bind(this, function() {
					this.completeSwipe();
				}), this.completeSwipeDelayMS);
				this.doSwipeAnimationComplete();
			}
		});

		this.job = enyo.requestAnimationFrame(fn);
	},
});