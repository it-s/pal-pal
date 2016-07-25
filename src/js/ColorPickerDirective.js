/**
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
    ]);