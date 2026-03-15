const CACHE_NAME = 'caradda-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// ── Install: pre-cache static shell ────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: clean up old caches ──────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first for API, cache-first for assets ───────────
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET') return;
  if (!url.startsWith(self.location.origin) && !url.includes('/api/')) return;

  // API calls: network first, fall back to cache
  if (url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          // Cache a copy for offline fallback
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets: cache first, then network
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
    )
  );
});

// ── Background sync placeholder ────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending') {
    // Future: replay offline bill submissions
    console.log('[SW] Background sync triggered');
  }
});
