self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("diario").then(c =>
      c.addAll(["/", "/index.html", "/styles.css", "/Script.js"])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});