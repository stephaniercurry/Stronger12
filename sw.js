const CACHE='stronger12-offline-v53';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('stronger12-offline-v')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 const path=new URL(e.request.url).pathname;
 const isPage=e.request.mode==='navigate'||path.endsWith('/index.html')||path.endsWith('/Stronger12/');
 e.respondWith(fetch(e.request,isPage?{cache:'no-store'}:undefined).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}
  return response
 }).catch(()=>caches.match(e.request).then(cached=>cached||(isPage?caches.match('./index.html'):Response.error()))));
});
