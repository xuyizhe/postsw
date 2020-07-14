importScripts(
  '#{cdn?}'
    ? 'https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js'
    : '/workbox/workbox-sw.js'
);

if (workbox) {
  // const precacheCacheName = workbox.core.cacheNames.precache;
  // const runtimeCacheName = workbox.core.cacheNames.runtime;

  // console.log(precacheCacheName, runtimeCacheName);

  workbox.setConfig({
    debug: false,
    ['#{cdn?}' ? undefined : 'modulePathPrefix']: '/workbox/',
  });

  workbox.core.setCacheNameDetails({
    prefix: 'postsw',
    suffix: 'v' + process.env.npm_package_version,
    precache: 'precache',
    runtime: 'runtime',
  });

  workbox.precaching.precacheAndRoute([]);

  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /.*(?:googleapis)\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'googleapis',
    })
  );

  workbox.routing.registerRoute(
    /.*(?:gstatic)\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'gstatic',
    })
  );

  workbox.routing.registerRoute(
    /\.(?:html)$/,
    new workbox.strategies.NetworkOnly()
  );

  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  workbox.googleAnalytics.initialize();

  console.log(`postsw@'#{VERSION}' is loaded.`);
} else {
  console.log(`postsw@'#{VERSION}' didn't load 😬`);
}
