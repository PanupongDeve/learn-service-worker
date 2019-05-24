const STATIC_CHACHES_NAME = 'static-v9';
const DYNAMIC_CHACHES_NAME = 'dynamic';
const STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
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
]

function isInArray(string, array) {
    var cachePath;
    if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
      console.log('matched ', string);
      cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else {
      cachePath = string; // store the full request (for CDNs)
    }
    return array.indexOf(cachePath) > -1;
}

function trimCache(cacheName, maxItems) {
    caches.open(cacheName)
        .then((cache) => {
            return cache.keys()
                .then((keys) => {
                if (keys.length > maxItems) {
                    cache.delete(keys[0])
                        .then(trimCache(cacheName, maxItems))
                }
            })
        })
}


//  event เมื่อ ติดตั้ง service worker
self.addEventListener('install', (event) => {
    // console.log('[Service Worker] Installing Service Worker ...', event);
    // add cache api
    event.waitUntil(
        caches.open(STATIC_CHACHES_NAME)
            .then((cache) => {
                console.log('[Service Worker] Pre caching App Shell');
                cache.addAll(STATIC_FILES);
            })
    );
    
});

// event เมื่อ ยืนยันการติดตั้ง service worker

self.addEventListener('activate', (event) => {
    // console.log('[Service Worker] Activating Service Worker ...', event);
    event.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map((key => {
                    if (key !== STATIC_CHACHES_NAME && key !== DYNAMIC_CHACHES_NAME) {
                        console.log('[Serice worker] Removing old cache.', key);
                        return caches.delete(key);
                    }
                })))
            })
    );
    return self.clients.claim();
});

// event เมื่อมีการโหลด asset ต่างๆ เช่น css js image file

// base caches

// self.addEventListener('fetch', (event) => {
//     // console.log('[Service Worker] fetching something ...', event);
//     event.respondWith(
//         caches.match(event.request)
//             .then((response) => {
//                 if(response) {
//                     return response;
//                 } else {
//                     return fetch(event.request)
//                         .then((res) => {
//                             // open dynamic caches
//                             return caches.open(DYNAMIC_CHACHES_NAME)
//                                 .then((cache) => {
//                                     cache.put(event.request.url, res.clone());
//                                     return res;
//                                 })
//                         })
//                         .catch((err) => {
//                             console.log(err);
//                             return caches.open(STATIC_CHACHES_NAME)
//                             .then((cache) => {
//                                 return cache.match('/offline.html')
//                             })
//                         });
//                 }
//             })
//     );
// });

// Cache-only
// self.addEventListener('fetch', (event) => {
//     // console.log('[Service Worker] fetching something ...', event);
//     event.respondWith(
//         caches.match(event.request)  
//     );
// });

// Network-only
// self.addEventListener('fetch', (event) => {
//     // console.log('[Service Worker] fetching something ...', event);
//     event.respondWith(
//         fetch(event.request)  
//     );
// });


//  Network with Cache fallback
// self.addEventListener('fetch', (event) => {
//     // console.log('[Service Worker] fetching something ...', event);
//     event.respondWith(
//         fetch(event.request)
//             .then((res) => {
//                 return caches.open(DYNAMIC_CHACHES_NAME)
//                         .then((cache) => {
//                             cache.put(event.request.url, res.clone());
//                             return res;
//                         })
//             })
//             .catch((err) => {
//                 console.log(err);
//                 return caches.match(event.request)  
//             })
//     );
// });


// caches then network
self.addEventListener('fetch', (event) => {
    const url = 'https://httpbin.org/get';
    console.log('to do in case 1');
    if (event.request.url.indexOf(url) > -1) {
        event.respondWith(
            caches.open(DYNAMIC_CHACHES_NAME)
                .then((cache) => {
                    return fetch(event.request)
                        .then((res) => {
                            // trimCache(DYNAMIC_CHACHES_NAME, 3);
                            cache.put(event.request, res.clone());
                            return res;
                        });
                })
            
        );
    } else if (isInArray(event.request.url, STATIC_FILES)) {
        console.log('to do in case 2');
        event.respondWith(
            caches.match(event.request)
        );
    } else {
        console.log('to do in case 3');
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if(response) {
                        return response;
                    } else {
                        return fetch(event.request)
                            .then((res) => {
                                // open dynamic caches
                                return caches.open(DYNAMIC_CHACHES_NAME)
                                    .then((cache) => {
                                        // trimCache(DYNAMIC_CHACHES_NAME, 3);
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            })
                            .catch((err) => {
                                console.log(err);
                                return caches.open(STATIC_CHACHES_NAME)
                                .then((cache) => {
                                    if (event.request.headers.get('accept').includes('text/html')) {
                                        return cache.match('/offline.html')
                                    }
                                    
                                })
                            });
                    }
                })
        );
    }
   
});


