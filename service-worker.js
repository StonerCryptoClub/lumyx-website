/**
 * Service Worker for Lumyx Agency
 * Optimized for Core Web Vitals and fast loading
 */

const CACHE_NAME = 'lumyx-v1.2.0';
const STATIC_CACHE = 'lumyx-static-v1.2.0';
const DYNAMIC_CACHE = 'lumyx-dynamic-v1.2.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/blog.html',
  '/case-study.html',
  '/css/main.css',
  '/css/styles.css',
  '/js/main.js',
  '/js/performance-optimization.js',
  '/Logo.png'
];

// Assets to cache on first request
const CACHE_ON_REQUEST = [
  '/js/',
  '/css/',
  '/images/',
  'https://cdnjs.cloudflare.com/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE;
            })
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests for analytics/tracking
  if (url.origin !== location.origin && 
      (url.hostname.includes('google-analytics') ||
       url.hostname.includes('googletagmanager') ||
       url.hostname.includes('facebook') ||
       url.hostname.includes('clarity'))) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticRequest(request));
  } else if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Handle image requests with stale-while-revalidate
async function handleImageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Serve cached version immediately
    fetchAndCache(request, cache); // Update in background
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return fallback image if available
    return cache.match('/images/placeholder.svg') || 
           new Response('Image not available', { status: 404 });
  }
}

// Handle static assets (CSS, JS) with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw error;
  }
}

// Handle navigation requests with network-first strategy
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match('/index.html');
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Handle dynamic requests with network-first, cache fallback
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok && shouldCache(request.url)) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Resource not available', { status: 404 });
  }
}

// Helper function to fetch and cache in background
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
  } catch (error) {
    console.log('Background fetch failed:', error);
  }
}

// Check if URL should be cached
function shouldCache(url) {
  return CACHE_ON_REQUEST.some(pattern => url.includes(pattern));
}

// Check if request is for static asset
function isStaticAsset(url) {
  return url.includes('/css/') || 
         url.includes('/js/') || 
         url.includes('/fonts/') ||
         url.endsWith('.css') ||
         url.endsWith('.js');
}

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any offline actions when connection is restored
  console.log('Background sync triggered');
}

// Handle push notifications (if needed)
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/Logo.png',
      badge: '/images/badge.png',
      tag: 'lumyx-notification'
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
}); 