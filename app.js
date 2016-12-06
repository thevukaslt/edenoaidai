

(function(){


	angular.module('app', ['ngMaterial', 'ngRoute'])

	.controller('SongsController', function() {
		this.songs = library;
	})

	.controller('AppController', function() {

	})

	// configure our routes
    .config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            });
    })

    // create the controller and inject Angular's $scope
    .controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    })

    .controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    })

    .controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });





	var library = [
		{ 
			title: 'Giesmė vienas', 
			number: 1 ,
			body: "Tu esi"
		},
		{ 
			title: 'Antroji giesmė', 
			number: 2 ,
			body: "Aš esu"
		}

	];
})();