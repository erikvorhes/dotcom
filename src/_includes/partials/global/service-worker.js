const CACHE_KEYS = {
  PRE_CACHE: `precache-${VERSION}`,
  RUNTIME: `runtime-${VERSION}`
};

const EXCLUDED_URLS = [
  'admin',
  '.netlify',
  'https://identity.netlify.com/v1/netlify-identity-widget.js',
  'https://unpkg.com/netlify-cms@^2.10.0/dist/netlify-cms.js'
];

const PRE_CACHE_URLS = ['/', 'https://fonts.typotheque.com/WF-013255-001872.css'];

const IGNORED_HOSTS = ['localhost', 'unpkg.com'];

/**
 * Takes an array of strings and puts them in a named cache store
 *
 * @param {String} cacheName
 * @param {Array} items=[]
 */
const addItemsToCache = function(cacheName, items = []) {
  caches.open(cacheName).then(cache => cache.addAll(items));
}

self.addEventListener('install', function() {
  self.skipWaiting();

  addItemsToCache(CACHE_KEYS.PRE_CACHE, PRE_CACHE_URLS);
});

self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches
      .keys()
      .then(function(cacheNames) {
        return cacheNames.filter(function(item) {
          return !Object.values(CACHE_KEYS).includes(item);
        });
      })
      .then(function(itemsToDelete) {
        return Promise.all(
          itemsToDelete.map(function(item) {
            return caches.delete(item);
          })
        )
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', function(evt) {
  const { hostname } = new URL(evt.request.url);

  if (IGNORED_HOSTS.indexOf(hostname) > -1 || EXCLUDED_URLS.some(page => evt.request.url.indexOf(page) > -1)) {
    return;
  }

  evt.respondWith(
    caches.match(evt.request).then(function(cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(CACHE_KEYS.RUNTIME).then(function(cache) {
        return fetch(evt.request)
          .then(function(response) {
            return cache.put(evt.request, response.clone()).then(() => response);
          })
          .catch(function() {
            return;
          });
      });
    })
  );
});
