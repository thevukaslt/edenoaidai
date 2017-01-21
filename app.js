(function(){

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function(reg){
            console.log('NG: installed.');
        }).catch(function(err){
            console.log('NG: failed.');
        });
    };

	angular.module('app', ['ngRoute', 'ngMaterial'])

    //Theme
    .config(function($mdThemingProvider) {
        //Theme colors
        $mdThemingProvider.theme('default')
            .primaryPalette('deep-orange')
            .accentPalette('grey');


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
                templateUrl : 'pages/about.html'
            })

            // route for the song page
            .when('/song/:id', {
                templateUrl : 'pages/song.html',
                controller  : 'songController',
                controllerAs: 'song'
            })
            // route for the json-store
            .when('/store', {
                templateUrl : 'pages/store.html',
                controller  : 'storeCtrl',
                controllerAs: 'store'
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
                    //console.log(response.statusText + " Biblioteka gauta");
                    $rootScope.library = response.data;
                },

                function(response){
                    //console.log();
                    console.log('Klaida '+response.status+', biblioteka neįkelta.');
                }
           );


        }

    )

    .controller('mainController', function($scope, $rootScope, $filter) {
    	var main = this;

    	//main.songs = $rootScope.library;

        main.songs = $filter('orderBy')($rootScope.library, function() {
            return 0.5 - Math.random();
        });



    })

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

        this.go = function ( path ) {
          $location.path( path );
        };

    })

    //Store controller
    .controller('storeCtrl', function($scope, $location, $filter, $rootScope) {
        var self = this;


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