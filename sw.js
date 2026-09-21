const CACHE='panthers-fulltime-v2';
const CORE=['./','index.html','styles.css','app.js','manifest.webmanifest','assets/fonts/FUDGrotesk-SemiBold.ttf','assets/fonts/Florilane Cardillac.ttf'];
const OVERLAYS=Array.from({length:12},(_,i)=>`assets/overlays/${i+1}.png`);
const GRADIENTS=['assets/SfumaturaSopra.png','assets/SfumaturaSotto.png'];
const LOGOS=['Casale cremasco.png','Castelnuovo.png','Doverese.png','Excelsior.png','Issese.png','Mombrettese.png','Monte cremasco.png','Montodinese.png','Oratorio Castellone.png','Panthers 1977.png','Ripaltese.png','Rivoltana.png','Spinese oratorio.png','Vailate.png','ZELOBUONPERSICO 1974.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll([...CORE,...OVERLAYS,...GRADIENTS,...LOGOS.map(x=>`assets/logos/${x}`)]))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
