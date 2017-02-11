(function(){


/*
    //Service Worker
    var serviceWorker = function() {

        if (!navigator.serviceWorker) return;

        navigator.serviceWorker.register('/sw.js').then(function(reg) {
            if (!navigator.serviceWorker.controller) {
                return;
            }

            if (reg.waiting) {
                indexController._updateReady(reg.waiting);
                return;
            }

            if (reg.installing) {
                indexController._trackInstalling(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', function() {
                indexController._trackInstalling(reg.installing);
            });

            // Ensure refresh is only called once.
            // This works around a bug in "force update on reload".
            var refreshing;
            navigator.serviceWorker.addEventListener('controllerchange', function() {
                if (refreshing) return;
                window.location.reload();
                refreshing = true;
            });
        };

    };*/
        /*if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(function(reg){

                $mdToast.show(
                    $mdToast.cache()
                );

                reg.unregister();

                reg.update();

                reg.installing;

                reg.waiting;

                reg.active;

                reg.addEventListener('updateFound', function() {
                    //reg.installing has changed
                })

                var sw = reg.installing;


                sw.addEventListener('stateChange', function() {
                    console.log('Controller: ' + sw.state);
                    
                });

                console.log('NG: installed.');
            }).catch(function(err){
                console.log('NG: failed.');
            });

            //Refers to the current service worker
            if (!navigator.serviceWorker.controller) {

            }

            if (reg.waiting) {

            }

            if (reg.installing) {
                //there's an update in progress
                reg.installing.addEventListener('statechange', function() {
                    if (this.state == 'installed') {
                        //there's an update ready
                    }
                });
            }
        };

        self.addEventListener('push', function(e) {
            
            $mdToast.show(
                $mdToast.cache()
            );      
        });
    }*/
        







	angular.module('app', ['ngRoute', 'ngMaterial'])

    //Config
    .config(function($mdThemingProvider, $mdToastProvider) {
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
        function($http, $rootScope, serviceWorker) {           

            //Init ServiceWorker
            serviceWorker.run();

            //Data preload
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
                                        hideDelay   : 3000,
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

                // Ensure refresh is only called once.
                // This works around a bug in "force update on reload".
                var refreshing;
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                    if (refreshing) return;
                    window.location.reload();
                    refreshing = true;
                });

            }).catch(function(res) {

                console.log('Klaida: ' +res);
                $mdToast.show({
                    hideDelay   : 3000,
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
                      '<md-button ng-click="toast.update()">'+
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

        self.update = function() {

            if ( isDlgOpen ) return;
            isDlgOpen = true;

            $mdToast
              .hide('refresh')
              .then(function() {
                isDlgOpen = false;
              });

        };
    })

    .controller('mainController', function($rootScope, $filter, $location) {
    	var main = this;

        main.songs = $filter('orderBy')($rootScope.library, function() {
            return 0.5 - Math.random();
        });

        /*main.go = function ( path ) {
            $location.path( path );
        };  */      


    })

    //Song controller
    .controller('songController', function($rootScope, $routeParams, $filter, $sce) {
 		var self = this;

        //Find hymn
        self.song = $filter('filter')($rootScope.library, {id: $routeParams.id})[0];
        //Trust body for HTML output
        self.body = $sce.trustAsHtml(self.song.body);
        self.copyright = $sce.trustAsHtml(self.song.copyright);

        self.fontSize = 16;
        self.textUp = function() {
            self.fontSize = self.fontSize + 2;
        }
        self.textDw = function() {
            self.fontSize = self.fontSize - 2;
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