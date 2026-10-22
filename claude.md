# FeedSpider2 Project Documentation

## Overview
FeedSpider2 is an RSS feed reader application that syncs with multiple RSS services. It's a port from the Mojo framework to the Enyo 2 JavaScript framework, targeting retro and legacy devices including webOS, LuneOS, and Android.

**Key Facts:**
- **App ID**: com.othelloventures.feedspider2
- **Current Version**: 2.4.0
- **Original Author**: Brent Hunter (Othello Ventures)
- **Contact**: feedspider@feedspider.net
- **Website**: http://www.feedspider.net

## Supported RSS Services
- BazQux Reader
- Feedly
- InoReader
- NextCloud News
- Tiny Tiny RSS
- The Old Reader

## Critical Constraints

### 1. BACKWARD COMPATIBILITY - NO ES6
This application MUST remain compatible with retro devices that do not support ES6 features. When working on this codebase:
- **DO NOT** use ES6+ syntax (arrow functions, let/const, template literals, classes, etc.)
- **USE** ES5 JavaScript only (var, function, traditional object notation)
- **USE** Enyo's kind() system for object definitions, not ES6 classes
- Target devices may run very old JavaScript engines

### 2. ENYO FRAMEWORK - DO NOT BREAK
The Enyo 2.5.0 framework is critical to this application:
- **Framework Source**: `enyo-app/enyo/` - Complete Enyo 2.5.0 framework source
- **DO NOT** modify Enyo core files unless absolutely necessary
- **DO NOT** introduce breaking changes to Enyo components
- Uses Enyo's kind() system for defining components
- Uses Enyo's dependency system (enyo.depends())

### 3. CORDOVA WRAPPER - DO NOT BREAK
The Cordova wrapper enables deployment to old devices:
- **Location**: `cordova-wrapper/`
- **DO NOT** break Cordova compatibility
- Used for Android APK builds
- Includes cordova-plugin-inappbrowser for proper link handling
- Custom cordova.js stub for webOS builds (`cordova-webos.js`)

## Project Structure

```
FeedSpider2/
├── enyo-app/                    # Main application
│   ├── enyo/                    # Enyo 2.5.0 framework (CRITICAL - DO NOT BREAK)
│   ├── lib/                     # Enyo libraries
│   │   ├── onyx/               # Onyx UI component library
│   │   ├── layout/             # Layout library
│   │   ├── simplelang/         # Localization library
│   │   ├── webos-lib/          # webOS compatibility library
│   │   └── NotificationTheme/  # Notification theme library
│   ├── source/                  # Application source code
│   │   ├── api/                # RSS service API implementations
│   │   │   ├── api.js          # Base API
│   │   │   ├── feedly-api.js
│   │   │   ├── bq-api.js       # BazQux
│   │   │   ├── ino-api.js      # InoReader
│   │   │   ├── ttrss-api.js    # Tiny Tiny RSS
│   │   │   ├── tor-api.js      # The Old Reader
│   │   │   ├── oc-api.js       # NextCloud News
│   │   │   └── instapaper.js
│   │   ├── data/               # Data models
│   │   ├── lib/                # Utility libraries
│   │   ├── views/              # UI view components
│   │   ├── style/              # CSS/LESS styles
│   │   ├── app.js              # Main application entry
│   │   └── package.js          # Enyo dependency definitions
│   ├── assets/                  # Images and static assets
│   ├── tools/                   # Build tools
│   │   └── deploy.sh           # Deployment script
│   ├── index.html              # Web/Android entry point
│   ├── index-webos.html        # webOS entry point
│   ├── appinfo.json            # webOS app metadata
│   ├── manifest.json           # Web app manifest
│   └── deploy.json             # Deployment configuration
├── cordova-wrapper/             # Cordova configuration (CRITICAL - DO NOT BREAK)
│   ├── config.xml              # Cordova configuration
│   ├── package.json            # Cordova dependencies
│   └── www/                    # Built app copied here
├── assets/                      # Top-level app icons
├── build.sh                     # Main build script
├── cordova-webos.js            # Cordova stub for webOS
└── bin/                        # Build output directory

```

## Build System

### Node.js Version
Tested with **Node v14.19.0** - use this version or similar for builds.

### Build Script
The main build script is `build.sh` in the project root:

```bash
# Clean build artifacts
./build.sh clean

# Build for webOS/LuneOS (generates .ipk)
./build.sh webos
./build.sh luneos

# Build for web (generates www/ folder)
./build.sh www
./build.sh web

# Build for Android (generates .apk)
./build.sh android

# Combine multiple targets
./build.sh webos android www

# Verbose output
./build.sh webos -v
```

### Build Process
1. **Enyo Deploy**: Uses `enyo-app/tools/deploy.sh` which calls `enyo/tools/deploy.js`
   - Concatenates and minifies JavaScript
   - Processes CSS/LESS
   - Outputs to `enyo-app/deploy/`

2. **webOS/LuneOS**:
   - Copies `cordova-webos.js` as `enyo-app/cordova.js`
   - Runs Enyo deploy with webOS flag (-w)
   - Creates .ipk package
   - Output: `bin/*.ipk`

3. **Android**:
   - Runs standard Enyo deploy
   - Copies deploy output to `cordova-wrapper/www/`
   - Runs `cordova build android`
   - Output: `bin/*.apk`

4. **Web**:
   - Runs standard Enyo deploy
   - Copies to `bin/www/`

### Build Artifacts
- Intermediate: `enyo-app/deploy/` and `enyo-app/build/`
- Final output: `bin/` directory
- Cleaned automatically after builds

## Architecture

### Enyo Framework
Enyo is a legacy component-based JavaScript framework:
- **Component Definition**: Uses `enyo.kind()` to define components
- **Dependency Management**: Uses `enyo.depends()` in package.js files
- **Event System**: Waterfall events, signals, handlers
- **UI Library**: Onyx components for UI elements
- **No ES6**: Framework and app use ES5 JavaScript only

Example component:
```javascript
enyo.kind({
    name: "MyComponent",
    kind: "enyo.Control",
    published: {
        value: ""
    },
    components: [
        {name: "label", content: "Hello"}
    ],
    create: function() {
        this.inherited(arguments);
        this.valueChanged();
    },
    valueChanged: function() {
        this.$.label.setContent(this.value);
    }
});
```

### Application Structure

#### Entry Points
- **Web/Android**: `index.html` → `source/index.js` → creates FeedSpider2.Application
- **webOS**: `index-webos.html` → `source/index-webos.js` → creates FeedSpider2.Application
- **Dashboard**: `webos-dashboard.html` → `source/webos-dashboard.js` → for notifications

#### Main Application
- **Kind**: `FeedSpider2.Application` (in `source/app.js`)
- **View**: `FeedSpider2.Home` (main view)
- Handles background updates for notifications
- Event waterfalling for state changes

#### API Layer
Each RSS service has its own API implementation in `source/api/`:
- Base `Api` class defines common interface
- Service-specific implementations (feedly-api.js, bq-api.js, etc.)
- OAuth and credential handling
- Article syncing, marking read/unread, starring

#### Data Models
Located in `source/data/`:
- **Credentials**: User login information
- **Preferences**: App settings
- **Article**: Individual article data
- **Subscription**: Feed subscriptions
- **Folder**: Feed organization
- Collections: All articles, starred, archived, fresh, shared

#### Views
Located in `source/views/`:
- **MainView**: Primary navigation and layout
- **FeedView**: Article list display
- **ArticleView**: Article reading view
- **PreferencesView**: Settings
- **LoginDialog**: Service authentication
- Various dialogs and helper views

### Platform-Specific Features

#### webOS Integration
- Uses webOS service calls (Luna APIs)
- Dashboard notifications
- System integration (power management, network queries)
- Required permissions in appinfo.json

#### Cordova Integration
- InAppBrowser plugin for external links
- Back button handling (mapped to ESC key)
- Device ready events
- Platform detection

#### iOS Handling
- Prevents overscroll bounce
- Touch event management
- Status bar theming

## Development Guidelines

### Code Style
- **JavaScript**: ES5 only (var, function, traditional objects)
- **Enyo Kinds**: Use enyo.kind() for all component definitions
- **Dependencies**: List in package.js using enyo.depends()
- **Comments**: Document complex logic

### Making Changes
1. **Read code first**: Use Read tool to understand existing implementation
2. **Preserve compatibility**: No ES6, maintain Enyo patterns
3. **Test on targets**: Test on actual webOS/LuneOS if possible
4. **Build verification**: Run builds for all targets before committing

### Testing
- Test builds: `./build.sh webos android www`
- Manual testing on target devices
- Check for JavaScript errors in old browsers

### Adding New Features
1. Define Enyo kind in appropriate location (views/, data/, api/)
2. Add to corresponding package.js
3. Follow existing patterns for API integration
4. Use Onyx components for UI
5. Test build and deployment

### Modifying APIs
- Each service API extends base Api class
- Implement required methods: login, getFeeds, getArticles, markRead, etc.
- Handle OAuth flows where needed
- Update service list in help/preferences if adding new service

### UI Changes
- Use Onyx library components (onyx.Button, onyx.Input, etc.)
- Follow existing view patterns
- Maintain responsive layout
- Test on small screens (original webOS devices were 320px wide)

## Common Tasks

### Adding a New RSS Service
1. Create new API file in `source/api/` (e.g., `newservice-api.js`)
2. Extend base Api class
3. Implement authentication and data fetching
4. Add to `source/api/package.js`
5. Update login dialog options
6. Update help documentation

### Modifying Build Process
- Main build logic: `build.sh`
- Enyo deployment: `enyo-app/tools/deploy.sh`
- Cordova config: `cordova-wrapper/config.xml`
- Be careful not to break existing build targets

### Updating Dependencies
- Enyo libraries are vendored in `enyo-app/lib/`
- Cordova plugins in `cordova-wrapper/package.json`
- Avoid updating Enyo framework itself (legacy version)

## Deployment Targets

### webOS/LuneOS (.ipk)
- Package format: IPK (webOS package)
- Built with Enyo's webOS deploy tools
- Includes Luna service integration
- Dashboard notification support

### Android (.apk)
- Built via Cordova
- Requires Android SDK
- cordova-android ^10.1.1
- InAppBrowser plugin for link handling

### Web (www/)
- Standard web deployment
- Can be hosted on any web server
- Progressive Web App features (manifest.json, service worker stub)
- Works in modern and older browsers

## Important Files

- **build.sh**: Main build orchestration
- **enyo-app/appinfo.json**: webOS app metadata and permissions
- **enyo-app/deploy.json**: Enyo build configuration
- **cordova-wrapper/config.xml**: Cordova/Android configuration
- **enyo-app/source/package.js**: Main dependency tree
- **enyo-app/index.html**: Application entry point
- **enyo-app/source/app.js**: Main application kind

## Troubleshooting

### Build Failures
- Check Node.js version (use v14.19.0)
- Ensure all build tools are installed (cordova, android SDK)
- Run `./build.sh clean` first
- Check for syntax errors (common with ES6 accidentally introduced)

### Runtime Errors
- Check browser console for JavaScript errors
- Verify ES5 compatibility (no arrow functions, let/const, etc.)
- Test in older browsers/devices
- Check Enyo kind definitions are correct

### Cordova Issues
- Ensure cordova-android is installed: `cd cordova-wrapper && npm install`
- Check Android SDK is properly configured
- Verify plugins are installed correctly

## Resources

- **Enyo Framework**: https://github.com/enyojs/enyo (archived)
- **Enyo 2 Documentation**: https://enyojs.com/docs/ (may be offline)
- **Cordova**: https://cordova.apache.org/
- **webOS OSE**: http://www.webosose.org/
- **LuneOS**: https://webos-ports.org/

## License
See LICENSE file in project root.

## Notes for AI Assistants

When working on this codebase:
1. **NEVER use ES6+ features** - This is the most critical rule
2. **DO NOT modify Enyo framework** files in `enyo-app/enyo/`
3. **DO NOT break Cordova** configuration in `cordova-wrapper/`
4. **ALWAYS test builds** after making changes
5. **FOLLOW Enyo patterns** - use enyo.kind(), not ES6 classes
6. **PRESERVE backward compatibility** - target devices are 10+ years old
7. **READ before modifying** - understand existing code patterns first
