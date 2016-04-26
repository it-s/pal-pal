/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .controller('HomeCtrl', ['$scope', '$colorSerice', '$timeout',
        function($scope, $colorSerice, $timeout) {

            $scope.palette = ['#05668D', '#028090', '#00A896', '#02C39A'];

            $scope.add = function() {
                $timeout(function() {
                    $scope.palette.push("#FFFFFF");
                });
            }

            $scope.remove = function(index) {
                $timeout(function() {
                    $scope.palette.splice(index, 1);
                });
            }

        }
    ]);