var currentCache = "8";
//Updated on 2017-03-22
var cacheTitle = "edeno-aidai";
var activeCache = cacheTitle + '-v' + currentCache;

self.addEventListener('install', function(e) {

	var urlsToCache = [
		'/',
		'style.css',
		'app.js',
		'pages/about.html',
		'pages/home.html',
		'pages/song.html',
		'layout/navbar.html',
		'logo.png',
		'favicon.png',
		'edeno-aidai.json',
		'manifest.json',
		'index.html',
		'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-route.min.js',
		'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js',
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