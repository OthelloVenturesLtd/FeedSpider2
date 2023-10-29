enyo.depends(
	// Layout library
	"$lib/layout",
	// Onyx UI library
	"$lib/onyx",	// To theme Onyx using Theme.less, change this line to $lib/onyx/source,
	//"Theme.less",	// uncomment this line, and follow the steps described in Theme.less
	// localization library: https://github.com/minego/macaw-enyo/tree/master/lib/simplelang
	"$lib/simplelang",
	// webos-lib webOS compatibility library
	"$lib/webos-lib",
	// Notification theme library
	"$lib/NotificationTheme",
	// CSS/LESS style files
	"style",
	// Libraries
	"lib",
	// APIs
	"api",
	// Model and data definitions
	"data",
	// View kind definitions
	"views",
	// Include our default entry point
	"app.js"
);