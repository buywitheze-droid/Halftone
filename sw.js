// Self-destructing service worker.
// Older builds shipped a cache-first SW that ended up serving stale
// HTML to users after every release. This file replaces that SW with
// one that immediately unregisters itself and deletes all of its
// caches on activation, so any browser still holding the old SW gets
// cleaned up the next time it checks for updates.
self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => c.navigate(c.url));
    } catch (_) {}
  })());
});
// Pass everything through to the network — no caching while we wait
// for the unregister + reload to take effect.
self.addEventListener('fetch', () => {});
