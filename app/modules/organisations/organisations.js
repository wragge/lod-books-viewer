'use strict';

var app = angular.module('lodBook.organisations', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/organisations', {
    templateUrl: 'modules/organisations/views/organisations.html',
    controller: 'OrganisationsCtrl'
  });
  $routeProvider.when('/organisations/:orgId', {
    templateUrl: 'modules/organisations/views/organisation.html',
    controller: 'OrganisationCtrl'
  });
}]);

app.controller('OrganisationsCtrl', ['$scope', 'DataFactory', function($scope, DataFactory) {
    $scope.orgs = DataFactory.getOrganisations();
  }]);

app.controller('OrganisationCtrl', ['$scope', '$routeParams', 'DataFactory', 'TextFactory', function($scope, $routeParams, DataFactory, TextFactory) {
    var orgId = 'organisations/' + $routeParams.orgId;
    var organisation = DataFactory.getItem(orgId);
    $scope.organisation = organisation;
    $scope.provides = DataFactory.getRelation(orgId, 'provider');
    $scope.publishes = DataFactory.getRelation(orgId, 'publisher');
    $scope.partOf = DataFactory.getRelation(orgId, 'subOrganization');
    $scope.hasParts = DataFactory.getRelation(orgId, 'subOrganizationOf');
    $scope.members = DataFactory.getRelation(orgId, 'memberOf');
    $scope.employees = DataFactory.getRelation(orgId, 'worksFor');
    $scope.subjectOf = DataFactory.getRelation(orgId, 'about');
    $scope.mentions = DataFactory.getRelation(orgId, 'mentions');
    $scope.location = function() {
      var location = null;
      if (organisation.location) {
        location = DataFactory.getItem(organisation.location['@id']);
      }
      return location;
    };

  }]);