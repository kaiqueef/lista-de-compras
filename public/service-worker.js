self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("static-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
        "/manifest.json",
        "/favicon.ico",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
