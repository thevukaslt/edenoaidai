(function(){

    angular.module('store', ['ngMaterial', 'angularTrix'])

    //Config
    .config(function($mdThemingProvider, $mdToastProvider) {
        //Theme colors
        $mdThemingProvider.theme('default')
            .primaryPalette('deep-orange')
            .accentPalette('grey');
    })

    //Store controller
    .controller('storeCtrl', function($scope, $location, $filter, $http) {
        var self = this;

        $http.get('/edeno-aidai.json')
        .then(
                function(res){

                    self.library = res.data;
            		//self.output = self.library;


        			self.update();
        			self.preview();


                })

        self.update = function() {

        	self.new = {
	        	'title' : '', 
	        	'songId' : '', 
	        	id : '', 
	        	'verse' : '', 
	        	'body' : '', 
	        	'copyright' : ''
	        }

			self.latest = self.library[self.library.length - 1];
        }

        self.generate = function() {
        	self.new.id = self.library[self.library.length - 1].id + 1;

            self.library.push(self.new);

            self.update();

            self.output = self.library;
            //self.output = angular.toJson(self.library, true);
        };

        self.preview = function() {
        	self.output = self.new;
        }


    })

    .directive('selectOnClick', ['$window', function ($window) {
	    // Linker function
	    return function (scope, element, attrs) {
	      element.bind('click', function () {
	        if (!$window.getSelection().toString()) {
	          this.setSelectionRange(0, this.value.length)
	        }
	      });
    	}
    }])

	
})();