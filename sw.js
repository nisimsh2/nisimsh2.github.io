// sw.js — forces fresh HTML on every visit, no manual hard-refresh needed

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  // Clear any old caches and take control of all open tabs immediately
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // For page navigations only: always go to network, bypass browser cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .catch(() => caches.match(event.request)) // fallback if offline
    );
  }
  // All other requests (fonts, etc.) pass through normally
});
