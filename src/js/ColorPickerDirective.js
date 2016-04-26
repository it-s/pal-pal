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
                            name: color.toName()
                        }
                		$scope.isLight = $scope.controls.hsv.v > 50;
                    }

                    ngModel.$parsers.push(function(value) {
                        return value.toHexString();
                    })

                    $scope.onRgbChanged = function(){
                    	var color = $colorSerice($scope.controls.rgb);
                    	$scope.controls.hsv = normaliseHSV(color.toHsv());
                		$scope.isLight = $scope.controls.hsv.v > 50;
                    	ngModel.$setViewValue($colorSerice($scope.controls.rgb));
                    }

                    $scope.onHsvChanged = function(){
                    	var color = $colorSerice($scope.controls.hsv);
                    	$scope.controls.rgb = color.toRgb();
                		$scope.isLight = $scope.controls.hsv.v > 50;
                    	ngModel.$setViewValue($colorSerice($scope.controls.hsv));
                    }

                }
            };
        }
    ]);