/* global angular d3 */
angular.module('strimzi', [
  'patternfly.views',
  'patternfly.navigation',
  'patternfly.toolbars',
  'patternfly.wizard',
  'patternfly.notification',
  'patternfly.card',
  'ui.router', 'topics_service'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('topics');

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'components/dashboard/dashboard.html'
      })
      .state('topics', {
        url: '/topics',
        templateUrl: 'components/topics/topics.html'
      })
      .state('help', {
        url: '/help',
        template: '<div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">\
                          <div class="card-pf-body" style="height: 50px;">\
                            <p class="card-pf-aggregate-status-notifications">\
                              State: Help\
                            </p>\
                          </div>\
                        </div>'
      })
      .state('user-prefs', {
        url: '/help',
        template: '<div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">\
                          <div class="card-pf-body" style="height: 50px;">\
                            <p class="card-pf-aggregate-status-notifications">\
                              State: User Preferences\
                            </p>\
                          </div>\
                        </div>'
      })
      .state('logout', {
        url: '/help',
        template: '<div class="card-pf card-pf-accented card-pf-aggregate-status" style="height: 89px;">\
                          <div class="card-pf-body" style="height: 50px;">\
                            <p class="card-pf-aggregate-status-notifications">\
                              State: Logout\
                            </p>\
                          </div>\
                        </div>'
      });
  })
  .controller('vertNavWithRouterController', ['$scope',
    function ($scope) {
      $scope.navigationItems = [
        /*
        {
          title: "Dashboard",
          iconClass: "fa fa-dashboard",
          uiSref: "dashboard",
          uiSrefOptions: { someKey: 'SomeValue' }
        },
        */
        {
          title: 'Topics',
          iconClass: 'fa fa-commenting-o',
          uiSref: 'topics'
        },
        {
          title: 'Help',
          iconClass: 'fa pficon-help',
          uiSref: 'help',
          mobileOnly: true
        },
        {
          title: 'User',
          iconClass: 'fa pficon-user',
          mobileOnly: true,
          children: [
            { title: 'User Preferences', uiSref: 'user-prefs' },
            { title: 'Logout', uiSref: 'logout' }
          ]
        }
      ];
      $scope.hideVerticalNav = function () {
        angular.element(document.querySelector('#verticalNavWithRouterLayout')).addClass('hidden');
      };
      $scope.handleNavigateClickRouter = function (item) {
        if (item.title === 'Exit Demo') {
          $scope.hideVerticalNav();
        }
      };
    }
  ])
  .filter('pretty', function () {
    return function (str) {
      var formatComma = d3.format(',');
      if (!isNaN(parseFloat(str)) && isFinite(str))
        return formatComma(str);
      return str;
    };
  });

