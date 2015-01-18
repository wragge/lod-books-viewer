'use strict';

var app = angular.module('lodBook.resources', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/resources', {
    templateUrl: 'modules/resources/views/resources.html',
    controller: 'ResourcesCtrl'
  });
  $routeProvider.when('/resources/:resourceId', {
    templateUrl: 'modules/resources/views/resource.html',
    controller: 'ResourceCtrl'
  });
}]);

app.controller('ResourcesCtrl', ['$scope', '$filter', 'DataFactory', function($scope, $filter, DataFactory) {
    var resources = DataFactory.getResources();
    console.log(resources);
    $scope.resources = $filter('orderBy')(resources, 'schema_name');
  }]);

app.controller('ResourceCtrl', ['$scope', '$routeParams', '$filter', 'DataFactory', function($scope, $routeParams, $filter, DataFactory) {
    var resourceId = $routeParams.resourceId;
    $scope.resource = DataFactory.getItem('/resources/' + resourceId);
  }]);