self.addEventListener('install', function(event) {
    console.log("Service Worker got install call");
});

self.addEventListener('fetch', function(event) {
    console.log("Service Worker got fetch call");
});

self.addEventListener('activate', function(event) {
    console.log("Service Worker got activate call");
});
  