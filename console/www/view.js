/* global angular */
angular.module('patternfly.views').controller('ViewCtrl', ['$scope',
  function ($scope) {
    $scope.viewType = 'basic';

    $scope.setView = function (viewType) {
      $scope.viewType = viewType;
    };
  }
]);