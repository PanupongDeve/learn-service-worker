
//  event เมื่อ ติดตั้ง service worker
self.addEventListener('install', (event) => {
    // console.log('[Service Worker] Installing Service Worker ...', event);
    // add cache api
    event.waitUntil(
        caches.open('static')
            .then((cache) => {
                console.log('[Service Worker] Pre caching App Shell');
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/js/promise.js',
                    '/src/js/feed.js',
                    '/src/js/fetch.js',
                    '/src/js/material.min.js',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/images/main-image.jpg',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ]);
            })
    );
    
});

// event เมื่อ ยืนยันการติดตั้ง service worker

self.addEventListener('activate', (event) => {
    // console.log('[Service Worker] Activating Service Worker ...', event);
    return self.clients.claim();
});

// event เมื่อมีการโหลด asset ต่างๆ เช่น css js image file

self.addEventListener('fetch', (event) => {
    // console.log('[Service Worker] fetching something ...', event);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if(response) {
                    return response;
                } else {
                    return fetch(event.request);
                }
            })
    );
});

