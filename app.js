;(function(angular, undefined) {
'use strict'
/**
 * Angular.js application configuration
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app', [
  'ngRoute',
  'as.sortable',
  'com.likalo.ui'
])
 .constant('APP_META', {
     title: 'pal-pal',
     description: 'A simple palette management tool.',
     icon: 'palette'
 })
 .constant('APP_API', {
     user: '/api/users'
 })
 .config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider){
        
      /*
       * Setting up router
       */
      $routeProvider
        .when('/:sequence?', {
          templateUrl: 'templates/page.home.html',
          controller: 'HomeCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider
        .html5Mode(false);
     
 }]);
;/**
 * Angular.js directive
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .directive('colorPicker', ['$colorSerice',
        function($colorSerice) {
        	function normaliseHSV(hsv) {
        		hsv.h = Math.floor(hsv.h);
        		hsv.s = Math.floor(hsv.s*100);
        		hsv.v = Math.floor(hsv.v*100);
        		return hsv
        	}
            function normalizeHex(hex) {
                if(!$colorSerice(hex).isValid()) return false;
                return hex.indexOf("#") === 0? hex: "#" + hex;
            }
            return {
                require: 'ngModel',
                scope: {},
                replace: true,
                templateUrl: 'templates/directive.colorpicker.html',
                link: function($scope, $el, $attrs, ngModel) {

                    ngModel.$formatters.push(function(value) {
                        return $colorSerice(value);
                    });

                    ngModel.$render = function() {
                        var color = ngModel.$viewValue;
                        $scope.color = color;
                        $scope.controls = {
                            rgb: color.toRgb(),
                            hsv: normaliseHSV(color.toHsv()),
                            hex: color.toHexString(),
                            name: color.toName()
                        }
                		// $scope.isLight = $scope.controls.hsv.v > 50;
                    }

                    ngModel.$parsers.push(function(value) {
                        return value.toHexString();
                    })

                    $scope.colornames = $colorSerice.names;

                    $scope.onHexChanged = function(){
                        var hex, color;
                        hex = normalizeHex($scope.controls.hex);
                        if(!hex) return;
                        color = $colorSerice(hex);
                        $scope.controls.rgb = color.toRgb();
                        $scope.controls.hsv = normaliseHSV(color.toHsv());
                        $scope.controls.name = color.toName();
                        // $scope.isLight = $scope.controls.hsv.v > 50;
                        ngModel.$setViewValue(color);
                    }

                    $scope.onRgbChanged = function(){
                    	var color = $colorSerice($scope.controls.rgb);
                    	$scope.controls.hsv = normaliseHSV(color.toHsv());
                        $scope.controls.hex = color.toHexString();
                        $scope.controls.name = color.toName();
                		// $scope.isLight = $scope.controls.hsv.v > 50;
                    	ngModel.$setViewValue(color);
                    }

                    $scope.onHsvChanged = function(){
                    	var color = $colorSerice($scope.controls.hsv);
                    	$scope.controls.rgb = color.toRgb();
                        $scope.controls.hex = color.toHexString();
                        $scope.controls.name = color.toName();
                		// $scope.isLight = $scope.controls.hsv.v > 50;
                    	ngModel.$setViewValue(color);
                    }

                }
            };
        }
    ]);;/**
 * Angular.js application service
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .factory('$colorSerice', ['$window', function($window){
        return $window["tinycolor"] || {};
    }]);
;/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .controller('HomeCtrl', [
        '$scope', 
        '$colorSerice', 
        '$routeParams', 
        '$location',
        'uiDialog',
        function($scope, $colorSerice, $routeParams, $location, uiDialog) {

            function _import(str){
                return angular.isDefined(str) && str.split('-').map(function(c){return '#' + c;});
            }

            function _export(pal){
                return {
                    string: pal.join(", "),
                    url: $location.absUrl().replace($location.path(), "/") + pal.join("-").replace(/#/g, ""),
                    json: angular.toJson(pal)
                }
            }

            function _generate(c, seq){
                var color = (c && $colorSerice(c)) || $colorSerice.random();
                switch(seq){
                    case 'analogous':
                        return color.analogous().map(function(t) { return t.toHexString(); });
                    break;
                    case 'monochromatic':
                        return color.monochromatic().map(function(t) { return t.toHexString(); });
                    break;
                    case 'tetrad':
                        return color.tetrad().map(function(t) { return t.toHexString(); });
                    break;
                    case 'triad':
                    default:
                        return color.triad().map(function(t) { return t.toHexString(); });
                }
                
            }

            $scope.palette = _import($routeParams["sequence"]) || _generate();

            $scope.mostReadable = function(c){
                return $colorSerice.mostReadable(c, ["#444", "#999", "#fff"]).toHexString();
            }

            $scope.add = function(hex) {
                if($scope.palette.length > 5) return;
                $scope.palette.push(hex || "#FFFFFF");
            }

            $scope.remove = function(index) {
                if($scope.palette.length < 2) return;
                $scope.palette.splice(index, 1);
            }

            $scope.generateAnalogous = function(index) {
                $scope.palette = _generate($scope.palette[index], 'analogous');
            }

            $scope.generateMonochromatic = function(index) {
                $scope.palette = _generate($scope.palette[index], 'monochromatic');
            }

            $scope.generateTriad = function(index) {
                $scope.palette = _generate($scope.palette[index], 'triad');
            }

            $scope.generateTetrad = function(index) {
                $scope.palette = _generate($scope.palette[index], 'tetrad');
            }

            $scope.share = function() {
                var data = _export($scope.palette);
                console.log(data.json);
                uiDialog.modal('templates/modal.share.html',
                    ['$scope', 'data', function($scope, data) {
                        $scope.data = data;
                    }],
                    {
                    resolve: {
                        data: function dataFactory() {
                            return data;
                        }
                    }
                });
            }

        }
    ]);;/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .controller('PageCtrl', ['APP_META', '$scope', function(APP_META, $scope){
        $scope.APP_META = APP_META;
    }]);

})(window.angular);