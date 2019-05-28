(function () {
  'use strict';
  const CACHE = 'pwa-angular-cache-v1';
  const ROUTES_TO_CACHE = [
    '/',
    'index.html'
  ];

  self.addEventListener('install',function (e) {
    e.waitUntil(
      caches.open(CACHE).then(function (cache) {
        console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(ROUTES_TO_CACHE);
      }).then(function () {
        self.skipWaiting();
      })
    )
  });

  self.addEventListener('sync', function(event) {
    console.log("sync event", event);
    if (event.tag === 'syncTag') {
      event.waitUntil(
        fetch('http://localhost:3000/sync',{mode:'no-cors'}).then( function (response) {
          response.text().then(function (data) {
            console.log(data)
          })
        }).catch(function (error) {
          console.log(error)
        })
      )
    }
  })
}());
