
//  event เมื่อ ติดตั้ง service worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker ...', event);
});

// event เมื่อ ยืนยันการติดตั้ง service worker

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating Service Worker ...', event);
    return self.clients.claim();
});

// event เมื่อมีการโหลด asset ต่างๆ เช่น css js image file

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] fetching something ...', event);
    event.respondWith(fetch(event.request));
});

