/* MiniSQL · Service Worker FINAL v2.0.17
   Caché completo: index + manifest + iconos + fuente + xlsx (Importar).
   Instalación robusta: guarda lo que exista, no aborta si falta algo. */
var CACHE = 'minisql-v2.0.32';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './InterVariable.woff2',
  './xlsx.full.min.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return Promise.allSettled(ASSETS.map(function(u){
        return fetch(u, {cache:'no-cache'}).then(function(r){
          if(r.ok){ return c.put(u, r); }
          throw new Error('falta ' + u);
        });
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE){ return caches.delete(k); }
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('message', function(e){
  if(e.data && e.data.type === 'SKIP_WAITING'){ self.skipWaiting(); }
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET'){ return; }
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached){ return cached; }
      return fetch(e.request).then(function(resp){
        if(resp && resp.status === 200 && new URL(e.request.url).origin === location.origin){
          var copia = resp.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, copia); });
        }
        return resp;
      }).catch(function(){
        if(e.request.mode === 'navigate'){ return caches.match('./index.html'); }
      });
    })
  );
});
