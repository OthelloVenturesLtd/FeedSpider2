<?php
//This file is only used for advertising on a hosting webserver

//Figure out what protocol the client wanted
if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
	$PROTOCOL = "https";
} else {
	$PROTOCOL = "http";
}
$docRoot = "./";
$appTitle = "FeedSpider";
echo file_get_contents("https://www.webosarchive.org/app-template/header.php?docRoot=" . $docRoot . "&appTitle=" . $appTitle . "&protocol=" . $PROTOCOL);
?>
    <div style="font-family:arial,helvetica,sans-serif;margin:15px;" align="center">
    <p>FeedSpider is a cross platform news reader web app created by <a href="https://www.othelloventures.com">Othello Ventures</a>.<br>It is distributed by <a href="http://www.webosarchive.org">webOS Archive</a> with permission.</p>
    &nbsp;<br/>
    <table style="margin-left:20%;margin-right:20%;">
        <tr><td width="200" align="right"><b><a href="https://feedspider.net/">FeedSpider Home</a></b></td><td style="padding-left:18px">Visit FeedSpider on the web, and download for FirefoxOS.</td></tr>
        <tr><td width="200" align="right"><b><a href="/app">FeedSpider PWA</a></b></td><td style="padding-left:18px">Progressive Web App that works on modern browsers, and can be pinned to your home screen, dock or Start Menu on modern platforms.</td>
	    <tr><td width="200" align="right"><b><a href="https://play.google.com/store/apps/details?id=com.othelloventures.feedspider2">Android</a></b></td><td style="padding-left:18px">The PWA bundled for distribution on Google Play.</td></tr>
        <tr><td width="200" align="right"><b><a href="https://appcatalog.webosarchive.org/showMuseum.php?search=feedspider">webOS/LuneOS</a></b></td><td style="padding-left:18px">Versions built for legacy (mobile) webOS and modern LuneOS.</td></tr>
	    <tr><td width="200" align="right"><b><a href="https://github.com/codepoet80/FeedSpider2">FeedSpider GitHub</a></b></td><td style="padding-left:18px">Source and Releases for this fork.</td></tr>
    </table>
    </div>
</body>
</html>