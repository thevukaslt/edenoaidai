(function(){


	angular.module('app', ['ngRoute', 'ngMaterial'])

    //Theme
    .config(function($mdThemingProvider) {
        // Enable browser color
        //$mdThemingProvider.enableBrowserColor();
        $mdThemingProvider.theme('default')
            .primaryPalette('teal')
            .accentPalette('deep-orange');
        //$mdThemingProvider.setDefaultTheme('main');


    })

	//Routing
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
                //controller  : 'aboutController',
                //controllerAs: 'about'
            })

            // route for the song page
            .when('/song/:id', {
                templateUrl : 'pages/song.html',
                controller  : 'songController',
                controllerAs: 'song'
            })
            //fallback URL address
            .otherwise({ redirectTo: '/' });

        // use the HTML5 History API
    	$locationProvider.html5Mode(true);

            
    })

    .run(
        function($http, $rootScope) {
            
            $http.get('edeno-aidai.json').then(

                function(response){
                    console.log(response.statusText + " Biblioteka gauta");
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

    /*.controller('aboutController', function($scope) {
        
    })*/

    //Song controller
    .controller('songController', function($rootScope, $routeParams, $filter, $sce) {
 		var self = this;

        //Find hymn
        self.song = $filter('filter')($rootScope.library, {id: $routeParams.id})[0];
        //this.self = $filter('filter')($rootScope.library, {id: $routeParams.id})[0];
        //Trust body for HTML output
        self.body = $sce.trustAsHtml(self.song.body);
        self.copyright = $sce.trustAsHtml(self.song.copyright);

    })

    //Navigation controller
    .controller('navCtrl', function($scope, $location, $filter, $rootScope) {
    	this.url = function (path) {
	    	return $location.path() == path;
	    };

        this.search = function(data) {
            return this.songs = $filter('filter')($rootScope.library, {songId: data.$});
        };

    })

    .directive('back', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);
	
})();