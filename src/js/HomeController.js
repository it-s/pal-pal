/**
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
    ]);