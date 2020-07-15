# postsw

Simple post-processing Service Worker.

## Installation
```shell
npm install -g postsw
```

## Getting started

### Register Service Worker
Add the following code to your project.
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

Or use with [`register-service-worker`](https://www.npmjs.com/package/register-service-worker)

### Generate `sw.js`
```shell
postsw ./your_project_dist_dir

# postsw --help
```

### Server configuration(optional)
```shell
location / {
  index /index.html
  add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
  expires off;
}

location ~ (sw.js)$ {
  add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
  expires off;
}
```
