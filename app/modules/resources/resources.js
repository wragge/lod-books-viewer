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
    var resourceId = '/resources/' + $routeParams.resourceId;
    var resource = DataFactory.getItem(resourceId);
    $scope.resource = resource;
    $scope.creators = DataFactory.getRelation(resourceId, 'created');
    $scope.subjects = DataFactory.getRelation(resourceId, 'subjectOf');
    $scope.mentions = DataFactory.getRelation(resourceId, 'mentionedBy');
    $scope.publisher = DataFactory.getRelation(resourceId, 'publishes');
    $scope.provider = DataFactory.getRelation(resourceId, 'provides');
    $scope.hasParts = DataFactory.getRelation(resourceId, 'isPartOf');
    $scope.isPartOf = DataFactory.getRelation(resourceId, 'hasPart');
  }]);