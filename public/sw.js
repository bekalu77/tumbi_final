const CACHE_NAME = 'tumbi-cache-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon.png'
];

// Install: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: network-first with cache fallback for app shell, network-only for API
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Let API requests go to network always (no caching for dynamic data)
  if (request.url.includes('/api/') || request.method !== 'GET') {
    return;
  }

  // Network-first for navigation and app shell
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful same-origin responses
        if (response.ok && request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Fall back to cache when offline
        return caches.match(request).then((cached) => {
          // For navigation requests, serve the cached index.html
          if (request.mode === 'navigate' && !cached) {
            return caches.match('./index.html');
          }
          return cached;
        });
      })
  );
});