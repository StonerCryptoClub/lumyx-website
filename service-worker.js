/**
 * Enhanced Service Worker for Mobile Performance Optimization
 * Focuses on better cache lifetimes and mobile-specific caching strategies
 */

const CACHE_NAME = 'lumyx-v1.2-mobile-optimized';
const STATIC_CACHE = 'lumyx-static-v1.2';
const DYNAMIC_CACHE = 'lumyx-dynamic-v1.2';

// Enhanced cache durations for mobile performance
const CACHE_STRATEGIES = {
  // Static assets - long cache for mobile performance
  static: {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    strategy: 'cache-first'
  },
  // Images - aggressive caching for mobile
  images: {
    maxAge: 180 * 24 * 60 * 60, // 6 months
    strategy: 'cache-first'
  },
  // Scripts and CSS - mobile optimized caching
  assets: {
    maxAge: 90 * 24 * 60 * 60, // 3 months
    strategy: 'stale-while-revalidate'
  },
  // API and dynamic content
  api: {
    maxAge: 24 * 60 * 60, // 1 day
    strategy: 'network-first'
  }
};

// Assets to cache immediately for mobile performance
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/styles.css',
  '/css/mobile-fixes.css',
  '/js/env-loader.js',
  '/js/production-logger.js',
  '/Logo.png',
  '/manifest.json'
];

// Install event - precache critical assets for mobile
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache critical static assets
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(PRECACHE_ASSETS);
      }),
      // Skip waiting for immediate activation on mobile
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages immediately for mobile
      self.clients.claim()
    ])
  );
});

// Fetch event - implement mobile-optimized caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests except for known CDNs
  if (url.origin !== location.origin && !isTrustedCDN(url.origin)) {
    return;
  }

  event.respondWith(handleRequest(request));
});

// Enhanced request handling with mobile-specific optimizations
async function handleRequest(request) {
  const url = new URL(request.url);
  const strategy = getStrategy(url);

  switch (strategy.type) {
    case 'cache-first':
      return cacheFirst(request, strategy);
    case 'network-first':
      return networkFirst(request, strategy);
    case 'stale-while-revalidate':
      return staleWhileRevalidate(request, strategy);
    default:
      return fetch(request);
  }
}

// Determine caching strategy based on request
function getStrategy(url) {
  const pathname = url.pathname;
  
  // Static assets (images, fonts, etc.)
  if (pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf)$/)) {
    return { type: 'cache-first', cache: STATIC_CACHE, ...CACHE_STRATEGIES.static };
  }
  
  // CSS and JS files
  if (pathname.match(/\.(css|js)$/)) {
    return { type: 'stale-while-revalidate', cache: STATIC_CACHE, ...CACHE_STRATEGIES.assets };
  }
  
  // API calls
  if (pathname.startsWith('/api/') || url.hostname.includes('contentful')) {
    return { type: 'network-first', cache: DYNAMIC_CACHE, ...CACHE_STRATEGIES.api };
  }
  
  // HTML pages
  if (pathname.endsWith('.html') || pathname === '/') {
    return { type: 'stale-while-revalidate', cache: DYNAMIC_CACHE, ...CACHE_STRATEGIES.api };
  }
  
  // Default to network-first for unknown resources
  return { type: 'network-first', cache: DYNAMIC_CACHE, ...CACHE_STRATEGIES.api };
}

// Cache-first strategy with mobile optimization
async function cacheFirst(request, strategy) {
  const cache = await caches.open(strategy.cache);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is still valid for mobile performance
    const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0);
    const now = new Date();
    const age = (now - cacheTime) / 1000;
    
    if (age < strategy.maxAge) {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      // Add cache timestamp for mobile cache management
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-time', new Date().toISOString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse);
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Network-first strategy for dynamic content
async function networkFirst(request, strategy) {
  const cache = await caches.open(strategy.cache);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate for optimal mobile performance
async function staleWhileRevalidate(request, strategy) {
  const cache = await caches.open(strategy.cache);
  const cachedResponse = await cache.match(request);
  
  // Always try to update cache in background for mobile
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available for mobile speed
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache available
  return fetchPromise || new Response('Offline', { status: 503 });
}

// Check if origin is a trusted CDN for mobile optimization
function isTrustedCDN(origin) {
  const trustedCDNs = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com',
    'https://cdn.jsdelivr.net',
    'https://assets.calendly.com'
  ];
  return trustedCDNs.includes(origin);
}

// Enhanced background sync for mobile
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync implementation
async function doBackgroundSync() {
  // Sync any pending form submissions or analytics
  const cache = await caches.open(DYNAMIC_CACHE);
  // Implementation depends on your specific sync needs
}

// Push notification support for mobile engagement
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/Logo.png',
      badge: '/Logo.png',
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Open App',
          icon: '/Logo.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification('Lumyx Agency', options)
    );
  }
});

// Handle notification clicks for mobile
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 