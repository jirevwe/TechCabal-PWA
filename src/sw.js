importScripts('./js/sw-toolbox/sw-toolbox.js');

const cacheFiles = [
    './',
    './index.html',
    
    './js/hn.js',
    './js/app.js',
    './js/toast.js',
    './js/fetch.js',
    './js/offline.js',
    './js/database.js',
    './js/jquery.min.js',
    './js/idb-keyval.js',
    './js/bootstrap.min.js',
    // './js/sw-toolbox/sw-toolbox.js',
    
    './css/news.css',
    './css/style.css',
    './css/bootstrap.min.css',

    './images/refresh.svg',
    './images/push-off.png',
    './images/push-on.png',

    'https://fonts.googleapis.com/css?family=Open+Sans'
];

// implements all the service worker functions
toolbox.precache(cacheFiles);

// Install and Activate events
self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Fetch events
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});