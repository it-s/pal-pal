/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .controller('HomeCtrl', [
        'APP_META',
        '$scope',
        '$colorSerice',
        '$exportSerice',
        '$importSerice',
        '$routeParams',
        'uiDialog',
        function(APP_META, $scope, $colorSerice, $exportSerice, $importSerice, $routeParams, uiDialog) {

            function _merge(a, b) {
                b.forEach(function(item){
                    if(a.length <= APP_META.maxColors)
                        a.push(item);
                });
            }

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

            $scope.maxColors = APP_META.maxColors;

            $scope.palette = $importSerice($routeParams["sequence"]) || _generate();

            $scope.mostReadable = function(c) {
                return $colorSerice.mostReadable(c, ["#444", "#999", "#fff"]).toHexString();
            }

            $scope.add = function() {
                if ($scope.palette.length > APP_META.maxColors) return;
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
                var palette = _generate($scope.palette[index], 'triad');
                if(isNaN(index))
                    $scope.palette = palette;
                else _merge($scope.palette,palette);
            }

            $scope.generateTetrad = function(index) {
                var palette = _generate($scope.palette[index], 'tetrad');
                if(isNaN(index))
                    $scope.palette = palette;
                else _merge($scope.palette,palette);
            }

            $scope.brightness = function(val) {
                $scope.palette.forEach(function(color, index){
                    $scope.palette[index] = val>0? $colorSerice(color).lighten().toString() : $colorSerice(color).darken().toString();
                });
            }

            $scope.saturation = function(val) {
                $scope.palette.forEach(function(color, index){
                    $scope.palette[index] = val>0? $colorSerice(color).saturate().toString() : $colorSerice(color).desaturate().toString();
                });
            }

            $scope.sort = function() {
                $scope.palette.sort(function(a,b){
                    var _a = $colorSerice(a).toHsv(),
                        _b = $colorSerice(b).toHsv();
                    return _a.h < _b.h ? -1 : (_a.h > _b.h ? 1 : 0);
                });
            }

            $scope.getRowLength = function() {
                return Math.min($scope.palette.length, 6);
            };

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
    ]);