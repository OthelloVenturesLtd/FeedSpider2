#!/bin/bash

mydir=$(cd `dirname $0` && pwd)
mkdir -p $mydir/bin/

if [ "$1" = "clean" ]; then
    echo "Cleaning up..."
    rm -rf $mydir/bin/*
    rm -rf $mydir/bin/www/*
    rm -rf $mydir/enyo-app/deploy/*
    rm -rf $mydir/enyo-app/build/*
    exit
fi

www=0
webOS=0
android=0
verbose=
for arg in "$@"; do
    if [ "$arg" = 'webos' ]; then
        webOS=1
    fi
    if [ "$arg" = 'luneos' ]; then
        webOS=1
    fi
    if [ "$arg" = 'android' ]; then
        android=1
    fi
    if [ "$arg" = 'www' ]; then
        www=1
    fi
    if [ "$arg" = 'web' ]; then
        www=1
    fi
    if [ "$arg" = '-v' ]; then
        verbose="-v"
    fi
done

if [[ $www -eq 0 ]] && [[ $webOS -eq 0 ]] && [[ $android -eq 0 ]] ; then
    echo "No build target specified"
    echo "Allowed: webos luneos www android"
    echo "(or any combination)"
    exit
fi

if [ $webOS -eq 1 ]; then
    echo "Building for LuneOS/webOS..."
    rm -rf $mydir/bin/*.ipk
    rm -rf $mydir/bin/www/*
    cp -f $mydir/cordova-webos.js $mydir/enyo-app/cordova.js
    $mydir/enyo-app/tools/deploy.sh -w $verbose
    mv $mydir/enyo-app/deploy/bin/*.ipk $mydir/bin/
else
    echo "Building for www..."
    $mydir/enyo-app/tools/deploy.sh $verbose
fi

if [ $android -eq 1 ]; then
    echo "Building for Android..."
    rm -rf $mydir/bin/*.apk

    # Check if Cordova dependencies are installed
    if [ ! -d "$mydir/cordova-wrapper/node_modules" ]; then
        echo "Installing Cordova dependencies..."
        cd $mydir/cordova-wrapper
        npm install
        cd $mydir
    fi

    # Ensure www directory exists
    mkdir -p $mydir/cordova-wrapper/www

    dirname=$mydir/cordova-wrapper
    cd $mydir/cordova-wrapper
    cordova platform add android
    echo "Copying to Cordova..."
    cp -R $mydir/enyo-app/deploy/* $mydir/cordova-wrapper/www
    cd $mydir/cordova-wrapper
    echo "Building Cordova..."
    cordova build android

    # Extract app name from package.json and rename APK
    appname=$(grep '"name"' $mydir/cordova-wrapper/package.json | head -1 | sed 's/.*"name": *"\([^"]*\)".*/\1/')
    cp $mydir/cordova-wrapper/platforms/android/app/build/outputs/apk/debug/app-debug.apk $mydir/bin/${appname}-debug.apk
fi

echo "Cleaning up..."
if [ $www -eq 1 ]; then
    mkdir -p $mydir/bin/www
    cp -R $mydir/enyo-app/deploy/* $mydir/bin/www/
fi
rm -rf $mydir/enyo-app/deploy/*
rm -rf $mydir/enyo-app/build/*

echo
echo "Build output at: $mydir/bin/"
ls $mydir/bin/
