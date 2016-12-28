(function(){


	angular.module('app', ['ngRoute'])

	// configure our routes
    .config(function($routeProvider, $locationProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController',
                controllerAs: 'main'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController',
                controllerAs: 'about'
            })

            // route for the song page
            .when('/song/:id', {
                templateUrl : 'pages/song.html',
                controller  : 'songController',
                controllerAs: 'song'
            })
            //fallback URL address
            .otherwise({ redirectTo: '/' });;

        // use the HTML5 History API
    	$locationProvider.html5Mode(true);

            
    })

    .run(
        function($http, $rootScope) {
            
            $http.get('edeno-aidai.json').then(

                function(response){
                    console.log(response.statusText);
                    $rootScope.library = response.data;
                },

                function(response){
                    //console.log();
                    console.log('Klaida '+response.status+', biblioteka neįkelta.');
                }
           );


        }

    )

    .controller('mainController', function($scope, $http, $rootScope) {
    	var main = this;

    	main.songs = $rootScope.library;

    })

    .controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    })

    //Song controller
    .controller('songController', function($rootScope, $routeParams, $filter, $sce) {
 		var self = this;

        //Find hymn
        self.data = $filter('filter')($rootScope.library, {id: $routeParams.id})[0];
        //Trust body for HTML output
        self.data.body = $sce.trustAsHtml(self.data.body);
        self.data.copyright = $sce.trustAsHtml(self.data.copyright);


    })

    //Navigation controller
    .controller('navCtrl', function($scope, $location) {
    	this.url = function (path) {
	    	return $location.path() == path;
	    };

    });
	
})();