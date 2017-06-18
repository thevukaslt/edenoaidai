var currentCache = "14";
//Integrating G-Analytics + Offline MaterialIcons
var cacheTitle = "edeno-aidai";
var activeCache = cacheTitle + '-v-' + currentCache;

importScripts('sw-offline-google-analytics.prod.v0.0.25.js');

self.addEventListener('install', function(e) {

	var urlsToCache = [
		'/',
		'app.js',
		'style.css',
		'pages/home.html',
		'pages/song.html',
		'pages/about.html',
		'layout/navbar.html',
		'logo.png',
		'favicon.png',
		'edeno-aidai.json',
		'manifest.json',
		'index.html',
		'MaterialIcons-Regular.woff2',
		'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-aria.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-route.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-animate.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.3/angular-material.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.3/angular-material.min.css',
		'https://fonts.googleapis.com/css?family=RobotoDraft:400,500,700,400italic'
	];

	e.waitUntil(
		caches.open(activeCache).then(function(cache) {
		  return cache.addAll(urlsToCache);
		})
	);

});


self.addEventListener('activate', function(e) {
	e.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith(cacheTitle) &&
				    	cacheName != activeCache;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

goog.offlineGoogleAnalytics.initialize();
self.addEventListener('fetch', function(e) {
	var offlineres = function() {
		if (e.request.headers.get('Accept').indexOf('text/html') != -1) {
			return caches.match(e.request).then(function (response) { 
				return response || caches.match('/');
			})
		} 
	}	
    e.respondWith(
		caches.match(e.request).then(function(response) {
			return response || fetch(e.request).catch(offlineres);
		})
  	);
});

self.addEventListener('message', function(e) {
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});