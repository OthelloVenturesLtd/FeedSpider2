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
    <div style="font-family:arial,helvetica,sans-serif;margin:15px;">
    <table><tr><td><img src="app/iconff-64.png"></td><td><h1>FeedSpider 2</h1></tr></table>
    <p>FeedSpider is a cross platform news reader web app created by <a href="https://www.othelloventures.com">Othello Ventures</a>, and distributed by <a href="http://www.webosarchive.org">webOS Archive</a> with permission.</p>
    <ul>
        <li><b><a href="https://feedspider.net/">FeedSpider Home</a>:</b> visit FeedSpider on the web, and download for FirefoxOS.</li>
        <li><b><a href="/app">FeedSpider PWA</a>:</b> Progressive Web App that works on modern browsers, and can be pinned to your home screen, dock or Start Menu on modern platforms.</li>
	<li><b><a href="https://play.google.com/store/apps/details?id=com.othelloventures.feedspider2">Android</a>:</b> The PWA bundled for distribution on Google Play.</li>
        <li><b><a href="https://appcatalog.webosarchive.org/showMuseum.php?search=feedspider">webOS/LuneOS</a>:</b> Versions built for legacy (mobile) webOS and modern LuneOS.</li>
	<li><b><a href="https://github.com/codepoet80/FeedSpider2">FeedSpider GitHub</a>:</b> Source and Releases for this fork.</li>
    </ul>
    </div>
</body>
</html>