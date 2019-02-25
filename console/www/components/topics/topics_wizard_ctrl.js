/* global angular $ */
angular.module('patternfly.wizard').controller('WizardModalController', ['$scope', '$rootScope', '$uibModal',
  function ($scope, $rootScope, $uibModal) {
    $scope.openWizardModal = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: 'components/topics/topics-wizard.html',
        controller: 'WizardController',
        size: 'lg'
      });

      var closeWizard = function (e, reason) {
        modalInstance.dismiss(reason);
      };
      $scope.$on('wizard.done', closeWizard);
    };
  }
]);
angular.module('patternfly.wizard').controller('WizardController', ['$scope', '$timeout', '$rootScope', 'topics_service',
  function ($scope, $timeout, $rootScope, topicsService) {
    var initializeWizard = function () {
      $scope.data = {
        name: '',
        partitions: 1,
        replicas: 1,
        retention: { ms: 7200000 },
        segment: { bytes: 1073741824 }
      };

      $scope.wizardReady = false;
      $timeout(function () {
        $scope.wizardReady = true;
      }, 1);
      $scope.isNextEnabled = function () {
        return false;
      };
      $scope.nextEnabled = false;

      $scope.nextButtonTitle = 'Next >';
    };

    $scope.data = {};

    $scope.firstStepNextTooltip = 'Review';
    $scope.firstStepPrevTooltip = 'First step back';
    $scope.reviewStepNextTooltip = 'Click to add new topic';
    $scope.reviewStepPrevTooltip = 'Back to edit';

    $scope.nextCallback = function (step) {
      // call startdeploy after deploy button is clicked on review tab
      if (step.stepId === 'review') {
        topicsService.create_topic($scope.data)
          .then(function () {
            $timeout(function () {
              $scope.deploymentComplete = true;
              $rootScope.$broadcast('addedTopic');
            });
          });
      }
      return true;
    };
    $scope.backCallback = function () {
      return true;
    };

    $scope.stepChanged = function (step) {
      if (step.stepId === 'review') {
        $scope.nextButtonTitle = 'Add Topic';
      } else if (step.stepId === 'review-progress') {
        $scope.nextButtonTitle = 'Close';
      } else {
        $scope.nextButtonTitle = 'Next >';
      }
    };

    $scope.cancelDeploymentWizard = function () {
      $rootScope.$broadcast('wizard.done', 'cancel');
    };

    $scope.finishedWizard = function () {
      $rootScope.$broadcast('wizard.done', 'done');
      return true;
    };

    initializeWizard();
  }
]);

angular.module('patternfly.wizard').controller('DetailsGeneralController', ['$scope', '$timeout', 'topics_service',
  function ($scope, $timeout, topicsService) {
    'use strict';

    $scope.reviewTemplate = 'review-template.html';
    $scope.detailsGeneralComplete = false;
    $scope.focusSelectors = ['#new-name'];
    $scope.onShow = function () { };
    $timeout(function () {
      $('#nextButton').prop('disabled', true);
      $('name').focus();
    });

    // hack! check for Enter key and goto the review step
    $scope.checkSubmit = function (e) {
      if (e && e.keyCode == 13) {
        if (topicsService.is_unique_valid_name($scope.data.name)) {
          $scope.$parent.$parent.$parent.$parent.$parent.wizard.next(function () {
            return true;
          });
        }
      }
    };

    $scope.updateName = function () {
      let enabled = topicsService.is_unique_valid_name($scope.data.name);
      $('#nextButton').prop('disabled', !enabled);
      $scope.detailsGeneralComplete = angular.isDefined($scope.data.name) && $scope.data.name.length > 0;
    };
  }
])
  .directive('restrictField', function () {
    return {
      restrict: 'AE',
      scope: {
        restrictField: '='
      },
      link: function (scope) {
        // this will match spaces, tabs, line feeds etc
        // you can change this regex as you want
        var regex = /\s/g;

        scope.$watch('restrictField', function (newValue, oldValue) {
          if (newValue !== oldValue && regex.test(newValue)) {
            scope.restrictField = newValue.replace(regex, '-');
          }
        });
      }
    };
  });

angular.module('patternfly.wizard').controller('DetailsReviewController', ['$rootScope', '$scope',
  function ($rootScope, $scope) {
    'use strict';

    // Find the data!
    var next = $scope;
    while (angular.isUndefined($scope.data)) {
      next = next.$parent;
      if (angular.isUndefined(next)) {
        $scope.data = {};
      } else {
        $scope.data = next.$ctrl.wizardData;
      }
    }
  }
]);

angular.module('patternfly.wizard').controller('SummaryController', ['$rootScope', '$scope', '$timeout',
  function ($rootScope, $scope, $timeout) {
    'use strict';
    $scope.pageShown = false;

    $scope.onShow = function () {
      $scope.pageShown = true;
      $timeout(function () {
        $scope.pageShown = false; // done so the next time the page is shown it updates
      });
    };
  }
]);

angular.module('patternfly.wizard').controller('DeploymentController', ['$rootScope', '$scope', '$timeout', 'topics_service',
  function ($rootScope, $scope, $timeout, topicsService) {
    'use strict';

    $scope.onShow = function () {
      $scope.deploymentComplete = false;

      topicsService.create_topic($scope.data)
        .then(function () {
          $timeout(function () {
            $scope.deploymentComplete = true;
            $rootScope.$broadcast('addedTopic');
          });
        });
    };
  }
]);
