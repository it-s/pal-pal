;(function(angular, undefined) {
'use strict'
/**
 * Angular.js application configuration
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app', [
  'ngRoute',
  'com.likalo.ui'
])
 .constant('APP_META', {
     title: 'pal-pal',
     description: 'A simple palette management tool.',
     icon: 'palette'
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

      /*
       * Disable HTML5 aws it conflicts with SVG specs
      */
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
                        ngModel.$setViewValue(color);
                    }

                    $scope.onRgbChanged = function(){
                    	var color = $colorSerice($scope.controls.rgb);
                    	$scope.controls.hsv = normaliseHSV(color.toHsv());
                        $scope.controls.hex = color.toHexString();
                        $scope.controls.name = color.toName();
                    	ngModel.$setViewValue(color);
                    }

                    $scope.onHsvChanged = function(){
                    	var color = $colorSerice($scope.controls.hsv);
                    	$scope.controls.rgb = color.toRgb();
                        $scope.controls.hex = color.toHexString();
                        $scope.controls.name = color.toName();
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
 * Angular.js application service
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .factory('$exportSerice', [
        '$location',
        '$colorSerice',
        'normalizeColorBitFilter',
        function($location, $colorSerice, normalizeColorBitFilter) {

            var name,
                svg_tag = "<svg width=\"%s\" height=\"48\" xmlns=\"http://www.w3.org/2000/svg\">",
                svg_background = "<rect width=\"%s\" x=\"0\" y=\"0\" height=\"48\" fill=\"#fff\" />",
                svg_swatch = "<rect width=\"24\" height=\"24\" x=\"%s\" y=\"8\" fill=\"%s\" />",
                svg_text = "<text x=\"5\" y=\"44\" font-family=\"sans\" font-size=\"4\">%s</text>";


            function _parse(str, args) {
                var i = 0;
                return str.replace(/%s/g, function() {
                    return args[i++] || '';
                });
            }

            function _name(pal) {
                return pal.join("-").replace(/#/g, "");
            }

            function _file(data, name, mime_type) {
                var blob = new Blob([data], {type: mime_type});
                return {
                    filename: name,
                    get: function() {
                        var dlink = document.createElement('a');
                        dlink.download = name;
                        dlink.href = window.URL.createObjectURL(blob);
                        dlink.onclick = function(e) {
                            // revokeObjectURL needs a delay to work properly
                            var that = this;
                            setTimeout(function() {
                                window.URL.revokeObjectURL(that.href);
                            }, 1500);
                        };

                        dlink.click();
                        dlink.remove();
                    }
                };
            }

            function _link(pal) {
                return $location.absUrl().split('#')[0] + "#/" + name;
            }

            function _svg(pal) {
                var length = pal.length,
                    width = 48 + 24 * length,
                    svg = _parse(svg_tag, [width]);
                svg += _parse(svg_background, [width]);
                svg += pal.map(function(item, index) {
                    var rgb = $colorSerice(item).toRgb();
                    return _parse(svg_swatch, [(24 + index * 24), item]);
                }).join("");
                svg += _parse(svg_text, [_link(pal)]);
                svg += "</svg>";
                return _file(svg, name + ".svg", 'image/svg+xml');
            }

            function _ps(pal) {
                return "";
            }

            function _gimp(pal) {
                var gimp = "GIMP Palette\nName: pal-pal\nColumns: 3\n";
                gimp += pal.map(function(item) {
                    var rgb = $colorSerice(item).toRgb();
                    return _parse("%s %s %s %s", [rgb.r, rgb.g, rgb.b, item]);
                }).join("\n");
                return _file(gimp, name + ".gpl", 'text/plain');
            }

            function _export(pal) {
                name = _name(pal);
                return {
                    string: name,
                    url: _link(pal),
                    json: angular.toJson(pal),
                    gimp: _gimp(pal),
                    ps: _ps(pal),
                    svg: _svg(pal)
                }
            }

            return _export;
        }
    ]);
;/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .filter('normalizeColorBit', function() {
            return function(number, pattern) {
            	pattern = pattern || "000";
                if (isNaN(parseFloat(number)) || !isFinite(number)) return pattern;
                return ("000" + Math.floor(number)).slice(-3);
            };
        });;/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .controller('HomeCtrl', [
        '$scope',
        '$colorSerice',
        '$exportSerice',
        '$importSerice',
        '$routeParams',
        'uiDialog',
        function($scope, $colorSerice, $exportSerice, $importSerice, $routeParams, uiDialog) {

            function _generate(c, seq) {
                var color = (c && $colorSerice(c)) || $colorSerice.random();
                switch (seq) {
                    case 'analogous':
                        return color.analogous(1).map(function(t) {
                            return t.toHexString();
                        });
                        break;
                    case 'tetrad':
                        return color.tetrad().map(function(t) {
                            return t.toHexString();
                        });
                        break;
                    case 'triad':
                    default:
                        return color.triad().map(function(t) {
                            return t.toHexString();
                        });
                }

            }

            function _swap(array, index1, index2){
                array[index1] = array.splice(index2, 1, array[index1])[0];
            }

            $scope.palette = $importSerice($routeParams["sequence"]) || _generate();

            $scope.mostReadable = function(c) {
                return $colorSerice.mostReadable(c, ["#444", "#999", "#fff"]).toHexString();
            }

            $scope.add = function() {
                if ($scope.palette.length > 5) return;
                $scope.palette.push($colorSerice.random().toHexString());
            }

            $scope.moveLeft = function($index) {
                if ($index === 0) return;
                _swap($scope.palette, $index-1, $index);
            }

            $scope.moveRight = function($index) {
                if ($index === $scope.palette.length-1) return;
                _swap($scope.palette, $index+1, $index);
            }

            $scope.remove = function(index) {
                if ($scope.palette.length < 2) return;
                $scope.palette.splice(index, 1);
            }

            $scope.generateAnalogous = function(index) {
                $scope.palette = _generate($scope.palette[index], 'analogous');
            }

            $scope.generateTriad = function(index) {
                $scope.palette = _generate($scope.palette[index], 'triad');
            }

            $scope.generateTetrad = function(index) {
                $scope.palette = _generate($scope.palette[index], 'tetrad');
            }

            $scope.brightness = function(val) {
                $scope.palette.forEach(function(color, index){
                    $scope.palette[index] = val>0? tinycolor(color).lighten().toString() : tinycolor(color).darken().toString();
                });
            }

            $scope.saturation = function(val) {
                $scope.palette.forEach(function(color, index){
                    $scope.palette[index] = val>0? tinycolor(color).saturate().toString() : tinycolor(color).desaturate().toString();
                });
            }

            $scope.export = function() {
                var data = $exportSerice($scope.palette);
                console.log(data.json);
                uiDialog.modal('templates/modal.export.html', ['$scope', 'data',
                    function($scope, data) {
                        $scope.data = data;
                    }
                ], {
                    'resolve': {
                        data: function dataFactory() {
                            return data;
                        }
                    }
                });
            }

        }
    ]);;/**
 * Angular.js application service
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .factory('$importSerice',[
            function() {
    
                function _import(str) {
                    return angular.isDefined(str) && str.split('-').map(function(c) {
                        return '#' + c;
                    });
                }
    
                return _import;
            }]);;/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .controller('PageCtrl', ['APP_META', '$scope', function(APP_META, $scope){
        $scope.APP_META = APP_META;
    }]);

})(window.angular);