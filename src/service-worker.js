var cacheName = 'v2';  //cache version number
var cacheFiles = [
    './',
    './index.html',
    './js/app.js',
    './js/bootstrap.min.js',
    './js/jquery.min.js',
    './css/bootstrap.min.css'
];

self.addEventListener('install', (e) => {
    console.log("[Service Worker] Installed");

    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log("[Service Worker] Caching cacheFiles");

            return cache.addAll(cacheFiles);
        }).catch((err) => {
            console.log("[ServiceWorker] Error in Installation");
        })
    );
});

self.addEventListener('activate', (e) => {
    console.log("[Service Worker] Activated");

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((thisCacheName) => {
                if(thisCacheName !== cacheName){
                    console.log('[ServiceWorker] Removing cache files from ', thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        }).catch((err) => {
            console.log("[ServiceWorker] Error in Activation");
        })
    );
});

self.addEventListener('fetch', (e) => {
    console.log("[Service Worker] Fetching", e.request.url);

    e.respondWith(
        caches.match(e.request).then((response) => {
            if(response){
                console.log("[ServiceWorker] Found In Cache");
                return response;
            }

            let requestClone = e.request.clone();
            fetch(requestClone).then((response) => {
                if(!response){
                     console.log("[ServiceWorker] No response from Fetch");
                     return response;
                }

                let responseClone = response.clone();
                caches.open(cacheName).then((cache) => {
                    console.log("[Service Worker] New Data from", e.request.url);
                    cache.put(e.request, responseClone);
                    return response;
                }).catch((err) => {
                    console.log("[ServiceWorker] Error Putting New Response", err);
                });
            }).catch((err) => {
                console.log("[ServiceWorker] Error Fetching and Caching New Response", err);
            });
        }).catch((err) => {
            console.log("[ServiceWorker] Error in Fetching From Cache");
        })
    );
});
