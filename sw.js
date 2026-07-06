const CACHE_NAME = 'unisys-v99';
const urlsToCache = ['/index.html', '/data.js'];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache).catch(function(e){ console.log('Cache partial fail:', e); });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(n){ return n !== CACHE_NAME; }).map(function(n){ return caches.delete(n); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  // Ne pas mettre en cache — toujours aller au réseau
  event.respondWith(
    fetch(event.request).catch(function(){
      return caches.match(event.request);
    })
  );
});
