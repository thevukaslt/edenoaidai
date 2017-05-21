(function(){

    var swActive = true;

    angular.module('app', ['ngRoute', 'ngMaterial'])
    //Debug
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }])
    //Theme colors
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('deep-orange')
            .accentPalette('grey');
        $mdThemingProvider.enableBrowserColor({
            palette: 'orange',
            hue: '400'
        });
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
            /*.when('/store', {
                templateUrl : 'pages/store.html',
                controller  : 'storeCtrl',
                controllerAs: 'store'
            })*/
            //fallback URL address
            .otherwise({ redirectTo: '/' });

        // use the HTML5 History API
    	$locationProvider.html5Mode(true);       
    })

    .run(
        function($http, $rootScope, serviceWorker, $mdToast) {           

            //Init ServiceWorker
            if (swActive) {
                serviceWorker.run();
            }

            //Fetch hymns
            $http.get('edeno-aidai.json').then(function(res){
                $rootScope.library = res.data;
            }).catch(
                function(res){
                    console.log('Klaida: edeno-aidai.json '+res.status + ' ' + res.statusText);

                    $mdToast.show({
                        controller  : 'toastController',
                        controllerAs: 'toast',
                        template: 
                        '<md-toast>' +
                            '<span class="md-toast-text">Nepavyko įkelti giesmyno.</span>' +
                            '<md-button ng-click="toast.update(\'reload\')">'+
                                'Bandyti dar kartą' + 
                            '</md-button>'+
                        '</md-toast>'})
                    .then(function(value){
                        if (value == 'reload') {
                            window.location.reload();
                        }
                    });  
                }
            );
        }
    )

    .service('serviceWorker', function($mdToast) {

        var self = this;


        //Service Worker
        self.run = function() {

            if (!navigator.serviceWorker) return;

            navigator.serviceWorker.register('/sw.js').then(function(reg) {

                if (reg.installing) {

                    reg.installing.addEventListener('statechange', function(){

                        if (reg.active) {

                            navigator.webkitTemporaryStorage.queryUsageAndQuota ( 
                                function(usedBytes, grantedBytes) {  
                                    //console.log('we are using ', usedBytes, ' of ', grantedBytes, 'bytes');

                                    $mdToast.show({
                                        hideDelay   : 6000,
                                        controller  : 'toastController',
                                        controllerAs: 'toast',
                                        template: 
                                        '<md-toast>' +
                                          '<span class="md-toast-text">Edeno Aidai sėkmingai išsaugoti. ' + '<br>' +
                                          'Sunaudota ' + Math.round(usedBytes/1024) + ' KB.</span>' +
                                        '</md-toast>'
                                    });  
                                }, 
                                function(e) { console.log('Error', e);  }
                            );

                        }   

                    });

                }

                if (!navigator.serviceWorker.controller) {
                    return;
                }

                if (reg.waiting) {
                    self._updateReady(reg.waiting);
                    return;
                }

                if (reg.installing) {
                    self._trackInstalling(reg.installing);
                    return;
                }

                reg.addEventListener('updatefound', function() {
                    self._trackInstalling(reg.installing);
                });

                var refreshing;
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                    if (refreshing) return;
                    window.location.reload();
                    refreshing = true;
                });

            }).catch(function(res) {

                console.log('Klaida: ' +res);
                $mdToast.show({
                    hideDelay   : 6000,
                    controller  : 'toastController',
                    controllerAs: 'toast',
                    template: 
                    '<md-toast>'+
                      '<span class="md-toast-text">Nepavyko išsaugoti...</span>'+
                    '</md-toast>'
                });  

            });

        };

        self._trackInstalling = function(worker) {

            worker.addEventListener('statechange', function() {

                if (worker.state == 'installed') {
                    self._updateReady(worker);
                }

            });

        };

        self._updateReady = function(worker) {

            var toast = 
                $mdToast.show({
                    hideDelay   : 0,
                    controller  : 'toastController',
                    controllerAs: 'toast',
                    template: 
                    '<md-toast>'+
                      '<span class="md-toast-text" flex>Išleistas atnaujinimas!</span>'+
                      '<md-button ng-click="toast.update(\'refresh\')">'+
                        'Atnaujinti'+
                      '</md-button>'+
                      '<md-button ng-click="toast.hide()">'+
                        'Slėpti'+
                      '</md-button>'+
                    '</md-toast>'
                });        

            toast.then(function(answer) {
                if (answer != 'refresh') return;
                worker.postMessage({action: 'skipWaiting'});
            });

        };
    })

    .controller('toastController', function($mdToast) {
        var isDlgOpen;
        var self = this;

        self.hide = function() {
            if (isDlgOpen) return;

            $mdToast
              .hide()
              .then(function() {
                isDlgOpen = false;
              });
            };

        self.update = function(value) {

            if ( isDlgOpen ) return;
            isDlgOpen = true;

            //console.log('Toast value is '+value);

            $mdToast
              .hide(value)
              .then(function() {
                isDlgOpen = false;
              });

        };
    })

    .controller('mainController', function($rootScope, $filter, $location, $timeout) {

    	var main = this;
        main.songs = $rootScope.library;

        var loadHymns = function(){

            retriesNum += 1;

            main.songs = $rootScope.library;

            if (!main.songs && retriesNum < 10) {

                $timeout(function() {
                    loadHymns();
                    console.log("This is " + retriesNum + " try so far!");
                }, 100);
            }
        }

        //Let's do some retries
        if (!main.songs) {      

            main.songs = [{
                "title"  : "Minutėlę...",
                "id": null,
                "songId": null
              }];

            var retriesNum = 0;

            $timeout(function() {
                    loadHymns();
            }, 100);
        }

        //main.songs = $filter('orderBy')($rootScope.library);
    })

    //Song controller
    .controller('songController', function($rootScope, $routeParams, $filter, $sce, $timeout, $location) {
 		var self = this;

        var assign = function() {
            //Find hymn
           //self.song = $filter('filter')($rootScope.library, {id: $routeParams.id})[0];
            self.song = $rootScope.library[$routeParams.id-1];
            //Trust body for HTML output
            self.body = $sce.trustAsHtml(self.song.body);
            self.copyright = $sce.trustAsHtml(self.song.copyright);
        }

        //Prevent reading of undefined
        var loadHymn = function(){

            retriesNum += 1;            

            if ($rootScope.library) {
              assign();
            }

            if (!$rootScope.library && retriesNum < 10) {

                $timeout(function() {
                    loadHymn();
                    console.log("This is " + retriesNum + " try so far!");
                }, 100);
            }
        }

        if (!$rootScope.library) {
             //initiate waiting            
            self.song = {};
            self.song.songId = "Minutėlę...";

            var retriesNum = 0;

            $timeout(function() {
                    loadHymn();
            });
        } else {
            assign();
        }

        self.fontSize = 16;
        self.textUp = function() {
            self.fontSize = self.fontSize + 2;
        }
        self.textDw = function() {
            self.fontSize = self.fontSize - 2;
        }     


        self.swipeSong = function(direction) {

            var previousSong = $routeParams.id-1;
            var nextSong = $routeParams.id;
            nextSong++;

            if (direction == "up" && nextSong < 277) {
                $location.path('song/' + nextSong);
            }
            if (direction == "down" && previousSong != 0) {
                $location.path('song/' + previousSong);
            }

        }
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

/*  //Store controller
    .controller('storeCtrl', function($scope, $location, $filter, $rootScope) {
        var self = this;

        self.library = $rootScope.library;

        self.generate = function() {
            self.library.push(self.new);

            self.new = '';
        };

    })*/

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