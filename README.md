FeedSpider2
===========

This is a port of the Mojo-based FeedSpider RSS client to the Enyo 2 Javascript Framework. Well, technically it's a port. It's really a significant re-write, especially of the UI layer.

Using the Enyo 2 Framework, FeedSpider has been ported to FireFox OS, and is currently in the process of being re-ported to webOS, and later to LuneOS, with further versions to follow.

Feedspider Supports:

* BazQux Reader
* Feedly
* InoReader
* NextCloud News
* Tiny Tiny RSS
* The Old Reader

Now, webOS and Firefox OS users can again sync their RSS feeds across all of their webOS and Firefox OS devices!

Building
========

## Prerequisites

You need the following installed:

- **Node.js 14.x** (tested with v14.21.3) - Later versions may not work with the legacy Enyo framework
- **npm** 6.x (comes with Node 14)
- **Cordova CLI** 10.x: `npm install -g cordova`
- **Android SDK** (for Android builds, see https://sdk.webosarchive.org/index.php?page=cordova)
- **gradle** 7.x (for Android builds, see https://sdk.webosarchive.org/index.php?page=cordova)

## Initial Setup

After cloning the repository, run these commands:

```bash
# Install Enyo framework dependencies
cd enyo-app/enyo
npm install
cd ../..
```

**Note**: The "walker" dependency is NOT an npm package, but a custom Enyo build tool that's included in this repository (found by digging through git history).

## Building

The build script will automatically install Cordova dependencies when needed.

```bash
# Build for web
./build.sh www

# Build for webOS/LuneOS
./build.sh webos

# Build for Android
./build.sh android

# Build for multiple targets
./build.sh webos android www
```

Build output will be in the `bin/` directory:
- `bin/www/` - Web build
- `bin/*.ipk` - webOS/LuneOS package
- `bin/*.apk` - Android package

## Troubleshooting

- If you get "this is not a cordova project" error, the build script will automatically install dependencies
- If you get walker errors, make sure you ran `npm install` in `enyo-app/enyo/`
- Use Node 14.x - newer versions may have compatibility issues with the legacy Enyo 2.5.0 framework

Contact
=======

Author: Brent Hunter  
Twitter: @FeedSpiderApp  
Email: feedspider@feedspider.net  
Web: http://www.feedspider.net  
