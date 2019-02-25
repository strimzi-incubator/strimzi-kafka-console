/* global angular $ */
angular.module('strimzi').controller('TopicsCtrl', ['$scope', '$rootScope', '$timeout', 'pfViewUtils', '$filter', 'topics_service',
  function ($scope, $rootScope, $timeout, pfViewUtils, $filter, topics_service) {
    $scope.filtersText = '';
    $scope.showPagination = true;

    // listen for the event in the relevant $scope
    $scope.$on('addedTopic', function () {
      getTopics();
      $scope.$broadcast('showNotification', { type: 'Success', message: 'Topic added' });
    });

    var nameList = function (attr) {
      let list = $scope.items.filter(function (item) {
        return item[attr];
      }).map(function (item) {
        return item.name;
      });
      return list;
    };

    // refresh the topic list
    var getTopics = function () {
      let scroll = $(window).scrollTop();
      let expandedList = nameList('isExpanded');
      let selectedList = nameList('selected');
      // avoid expanded list items flashing (starting out small and then growing)
      let expandedDetails = {};
      $scope.items.forEach(function (item) {
        if (item.isExpanded) {
          expandedDetails[item.name] = item.details;
        }
      });
      topics_service.get_topic_list()
        .then(function (topics) {
          // restore the state of all topics
          $timeout(function () {
            $scope.allItems = topics;
            $scope.items = $scope.allItems;
            $scope.listConfig.itemsAvailable = ($scope.allItems.length > 0);
            $scope.items.forEach(function (item) {
              if (expandedList.indexOf(item.name) >= 0) {
                // restore the previous details to avoid flashing
                item.details = expandedDetails[item.name];
                // refresh the details
                handleExpandedClick(item);
                item.isExpanded = true;
              }
              if (selectedList.indexOf(item.name) >= 0) {
                item.selected = true;
              }
            });
            applyFilters($scope.filterConfig.appliedFilters);
            sortChange();
            handleCheckBoxChange();
            $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
            $(window).scrollTop(scroll);
          }, function (e) {
            console.log(e);
          });
        });
    };
    $scope.allItems = [];
    $scope.items = $scope.allItems;
    getTopics();
    setInterval(getTopics, 5000);

    var matchesFilter = function (item, filter) {
      var match = true;
      var re = new RegExp(filter.value, 'i');

      if (filter.id === 'name') {
        match = item.name.match(re) !== null;
      } else if (filter.id === 'partitions') {
        match = item.partitions === parseInt(filter.value);
      } else if (filter.id === 'replicas') {
        match = item.replicas === parseInt(filter.value);
      } else if (filter.id === 'creationTimestamp') {
        match = item.creationTimestamp.match(re) !== null;
      }
      return match;
    };

    var matchesFilters = function (item, filters) {
      var matches = true;

      filters.forEach(function (filter) {
        if (!matchesFilter(item, filter)) {
          matches = false;
          return false;
        }
      });
      return matches;
    };

    var applyFilters = function (filters) {
      $scope.items = [];
      if (filters && filters.length > 0) {
        $scope.allItems.forEach(function (item) {
          if (matchesFilters(item, filters)) {
            $scope.items.push(item);
          }
        });
      } else {
        $scope.items = $scope.allItems;
      }
    };

    var clearFilters = function () {
      filterChange([]);
      $scope.filterConfig.appliedFilters = [];
    };

    var filterChange = function (filters) {
      $scope.filtersText = '';
      filters.forEach(function (filter) {
        $scope.filtersText += filter.title + ' : ' + filter.value + '\n';
      });
      applyFilters(filters);
      sortChange();
      $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
    };

    $scope.filterConfig = {
      fields: [
        {
          id: 'name',
          title: 'Topic name',
          placeholder: 'Filter by topic name...',
          filterType: 'text'
        },
        {
          id: 'creationTimestamp',
          title: 'Creation date',
          placeholder: 'Filter by creation date...',
          filterType: 'text'
        }
      ],
      resultsCount: $scope.items.length,
      totalCount: $scope.allItems.length,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var viewSelected = function (viewId) {
      $scope.viewType = viewId;
      $scope.sortConfig.show = true;
    };

    $scope.viewsConfig = {
      views: [pfViewUtils.getListView(), pfViewUtils.getCardView()],
      onViewSelect: viewSelected
    };

    $scope.viewsConfig.currentView = $scope.viewsConfig.views[0].id;
    $scope.viewType = $scope.viewsConfig.currentView;

    var compareFn = function (item1, item2) {
      var compValue = 0;
      if ($scope.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if ($scope.sortConfig.currentField.id === 'creationTimestamp') {
        compValue = item1.creationTimestamp.localeCompare(item2.creationTimestamp);
      } else if ($scope.sortConfig.currentField.id === 'partitions') {
        compValue = item1.partitions - item2.partitions;
      } else if ($scope.sortConfig.currentField.id === 'replicas') {
        compValue = item1.replicas - item2.replicas;
      }

      if (!$scope.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    };

    var sortChange = function () {
      $scope.items.sort(compareFn);
    };

    $scope.sortConfig = {
      fields: [
        {
          id: 'name',
          title: 'Name',
          sortType: 'alpha'
        },
        {
          id: 'creationTimestamp',
          title: 'Created date',
          sortType: 'alpha'
        },
        {
          id: 'partitions',
          title: 'Partitions',
          sortType: 'numeric'
        },
        {
          id: 'replicas',
          title: 'Replicas',
          sortType: 'numeric'
        }
      ],
      onSortChange: sortChange
    };

    $scope.doDeleteSelected = function () {
      let selectedList = nameList('selected');
      let plural = (selectedList.length > 1);
      if (selectedList.length > 0) {
        topics_service.delete_topic_list(selectedList)
          .then(function () {
            getTopics();
            $scope.$broadcast('showNotification', { type: 'Success', message: `Topic${plural ? 's' : ''} deleted` });
          });
      }
    };
    $scope.actionsConfig = {
      primaryActions: [
      ],
      actionsInclude: true
    };

    $scope.toolbarConfig = {
      viewsConfig: $scope.viewsConfig,
      filterConfig: $scope.filterConfig,
      sortConfig: $scope.sortConfig,
      actionsConfig: $scope.actionsConfig
    };

    $scope.listConfig = {
      selectionMatchProp: 'name',
      checkDisabled: false,
      itemsAvailable: true,
      useExpandingRows: true,
      compoundExpansionOnly: false,
      onCheckBoxChange: handleCheckBoxChange,
      onClick: handleExpandedClick
    };

    $scope.emptyStateConfig = {
      icon: 'pficon-warning-triangle-o',
      title: 'No topics defined',
      info: 'There are no topics defined. Click the Add topic button above to add a topic.'
    };

    $scope.noItemsConfig = {
      title: 'No Results Match the Filter Criteria',
      info: 'The active filters are hiding all items.',
      helpLink: {
        urlLabel: 'Clear All Filters',
        urlAction: clearFilters
      }
    };

    $scope.updateItemsAvailable = function () {
      if (!$scope.listConfig.itemsAvailable) {
        $scope.toolbarConfig.filterConfig.resultsCount = 0;
        $scope.toolbarConfig.filterConfig.totalCount = 0;
        $scope.toolbarConfig.filterConfig.selectedCount = 0;
      } else {
        $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
        $scope.toolbarConfig.filterConfig.totalCount = $scope.allItems.length;
        handleCheckBoxChange();
      }
    };

    function handleCheckBoxChange() {
      var selectedItems = $filter('filter')($scope.allItems, { selected: true });
      if (selectedItems) {
        $scope.toolbarConfig.filterConfig.selectedCount = selectedItems.length;
      }
    }
    function handleExpandedClick(item) {
      if (!item.isExpanded) {
        topics_service.get_topic_details(item.name)
          .then(function (details) {
            $timeout(function () {
              item.details = details;
            });
          });
      }
    }

    $scope.showComponent = true;
    $scope.customScope = {
      toggleExpandItemField: function (item, field) {
        if (item.isExpanded && item.expandField === field) {
          item.isExpanded = false;
        } else {
          item.isExpanded = true;
          item.expandField = field;
        }
      },
      collapseItem: function (item) {
        item.isExpanded = false;
      },
      isItemExpanded: function (item, field) {
        return item.isExpanded && item.expandField === field;
      }
    };
    $scope.pageConfig = {
      pageSize: 5
    };

    $scope.addNewComponentToDOM = function () {
      $scope.showComponent = false;
      $timeout(() => $scope.showComponent = true);
    };
    $scope.addNewComponentToDOM();
    $scope.showComponent = true;

  }
]);

angular.module('patternfly.notification').controller('NotificationCtrl', function ($scope, Notifications) {

  $scope.$on('showNotification', function (e, info) {
    typeMap[info.type](info.message);
  });

  var typeMap = {
    'Info': Notifications.info,
    'Success': Notifications.success,
    'Warning': Notifications.warn,
    'Danger': Notifications.error
  };
});