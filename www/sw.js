/**
 * Service Worker for 제주 여행 가이드 PWA V15
 * bkit phase-9: Enhanced offline-first with Background Sync
 */

const CACHE_NAME = 'jeju-travel-v15';
const STATIC_CACHE = 'jeju-static-v15';
const DYNAMIC_CACHE = 'jeju-dynamic-v15';

// Core assets to precache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/og-image.png'
];

// External CDNs to cache
const CDN_ASSETS = [
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap'
];

// Install - Cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW V15] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW V15] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate - Clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW V15] Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => !name.includes('v15'))
                    .map(name => {
                        console.log('[SW V15] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    
    // Static assets - Cache first
    if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset) || url.pathname === asset)) {
        event.respondWith(
            caches.match(event.request)
                .then(cached => {
                    const fetchPromise = fetch(event.request).then(response => {
                        if (response && response.status === 200) {
                            const clone = response.clone();
                            caches.open(STATIC_CACHE).then(cache => cache.put(event.request, clone));
                        }
                        return response;
                    }).catch(() => cached);
                    
                    return cached || fetchPromise;
                })
        );
        return;
    }

    // API/External - Network first with cache fallback
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

// Background Sync for offline schedule saves
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-schedule') {
        console.log('[SW V15] Background sync triggered');
        event.waitUntil(syncScheduleData());
    }
});

async function syncScheduleData() {
    const data = await getLocalScheduleData();
    if (data) {
        try {
            // Sync to cloud when online
            console.log('[SW V15] Syncing schedule data...');
        } catch (error) {
            console.error('[SW V15] Sync failed:', error);
        }
    }
}

async function getLocalScheduleData() {
    // Read from IndexedDB or localStorage
    return null;
}

// Push Notifications
self.addEventListener('push', (event) => {
    console.log('[SW V15] Push received');
    const data = event.data?.json() || {};
    
    const options = {
        body: data.body || '여행 일정을 확인하세요!',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: { url: data.url || '/' },
        actions: [
            { action: 'open', title: '열기' },
            { action: 'close', title: '닫기' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || '제주 여행 앱', options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

console.log('[SW V15] Service Worker loaded');
