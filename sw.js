// Minimal service worker — required by Chrome to enable the
// "Install app" prompt. No offline caching logic included on purpose,
// to keep this simple and avoid serving stale content.

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
});
