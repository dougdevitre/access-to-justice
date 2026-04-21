// Minimal service worker for the Access to Justice PWA.
//
// Strategy:
// - Precache the core app shell on install.
// - Navigation requests: network-first, fall back to cache, then /offline.
// - Same-origin GET asset requests: cache-first with stale-while-revalidate.
// - Non-GET (form posts / Server Actions): never intercept — always go to
//   the network. Critical so intake submissions work normally.
//
// Cache key is versioned. Bump CACHE_V on every deploy that ships new
// precached assets; stale caches get purged in `activate`.

const CACHE_V = "a2j-v1";
const PRECACHE = [
  "/",
  "/find-help",
  "/resources",
  "/intake",
  "/offline",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icon-192.svg",
  "/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_V)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_V).map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Never intercept non-GET — Server Actions, form posts, etc. must reach
  // the network untouched.
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first with offline fallback.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_V).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const offline = await caches.match("/offline");
          return offline ?? new Response("Offline", { status: 503 });
        }),
    );
    return;
  }

  // Static assets: cache-first, refresh in background.
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_V).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    }),
  );
});
