self.addEventListener('install', function(e) {
	//Updated as of 01-22 18:17
	console.log('SW: installing.');

	var urlsToCache = [
		'/',
		'style.css',
		'app.js',
		'pages/about.html',
		'pages/home.html',
		'pages/song.html',
		'layout/navbar.html',
		'favicon.png',
		'edeno-aidai.json',
		'index.html',
		'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css',
		'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-route.min.js',
		'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js'
	];

	e.waitUntil(
		caches.open('edeno-aidai').then(function(cache) {
		  return cache.addAll(urlsToCache);
		})
	);


});


self.addEventListener('activate', function(e) {
  	console.log('SW: activated.');
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