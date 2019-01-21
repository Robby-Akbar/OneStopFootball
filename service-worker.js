const CACHE_NAME = "football";
let urlsToCache = [
    "/",
    "/images/icon.png",
    "/images/notification.png",
    "/favorite.html",
    "/index.html",
    "/manifest.json",
    "/match.html",
    "/nav.html",
    "/team.html",
    "/pages/about.html",
    "/pages/home.html",
    "/pages/match.html",
    "/pages/team.html",
    "/css/icon.css",
    "/css/materialize.min.css",
    "/css/materialize.css",
    "/js/api.js",
    "/js/db.js",
    "/js/db_function.js",
    "/js/idb.js",
    "/js/materialize.min.js",
    "/js/materialize.js",
    "/js/nav.js"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
    let base_url = "https://api.football-data.org/v2/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true, cacheName: CACHE_NAME }).then(function(response) {
                return response || fetch (event.request);
            })
        )
    }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', function(event) {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    let options = {
        body: body,
        icon: 'images/notification.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});
