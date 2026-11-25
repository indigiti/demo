'use strict';
const scope=self.registration.scope;
const prefix='horoscope-'+scope+'-';
const cache=prefix+'__SOURCE_SHA__';
self.addEventListener('install',event=>{event.waitUntil(caches.open(cache).then(c=>c.addAll(['./','./index.html','./astronomy.browser.min.js','./manifest.webmanifest','./icon.svg'].map(p=>new URL(p,scope).href))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(prefix)&&k!==cache).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||!url.href.startsWith(scope)||url.origin!==self.location.origin)return;const relative=url.href.slice(scope.length);if(req.mode==='navigate'){if(relative!==''&&relative!=='index.html')return;event.respondWith(fetch(req).catch(()=>caches.open(cache).then(c=>c.match(new URL('./index.html',scope).href))));return;}if(!['index.html','astronomy.browser.min.js','manifest.webmanifest','icon.svg'].includes(relative))return;event.respondWith(caches.open(cache).then(async c=>(await c.match(req))||fetch(req)));});
