const CACHE_NAME = 'calculator-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/service-worker.js'
];

// 安装 Service Worker 并缓存所有资源
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截请求，并从缓存中返回资源
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;  // 如果缓存命中，返回缓存中的资源
        }
        return fetch(event.request);  // 否则，正常请求网络资源
      })
  );
});

// 更新缓存，当版本号更新时，清除旧缓存
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
