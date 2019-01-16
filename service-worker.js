const CACHE_NAME = "football";
let urlsToCache = [
    "/",
    "/images/icon.png",
    "/favorite.html",
    "/index.html",
    "/manifest.json",
    "/nav.html",
    "/package.json",
    "/tab.html",
    "/team.html",
    "/pages/about.html",
    "/pages/home.html",
    "/pages/match.html",
    "/pages/team.html",
    "/tabs/match.html",
    "/tabs/team.html",
    "/css/materialize.min.css",
    "/css/materialize.css",
    "/css/icon.css",
    "/js/api.js",
    "/js/materialize.min.js",
    "/js/materialize.js",
    "/js/nav.js",
    "/js/tab.js"
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
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
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