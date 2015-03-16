'use strict';

var app = angular.module('lodBook.people', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people', {
    templateUrl: 'modules/people/views/people.html',
    controller: 'PeopleCtrl'
  });
  $routeProvider.when('/people/:personId', {
    templateUrl: 'modules/people/views/person.html',
    controller: 'PersonCtrl'
  });
}]);

app.controller('PeopleCtrl', ['$scope', 'DataFactory', function($scope, DataFactory) {
    $scope.people = DataFactory.getPeople();
  }]);

app.controller('PersonCtrl', ['$scope', '$routeParams', 'DataFactory', 'TextFactory', function($scope, $routeParams, DataFactory, TextFactory) {
    var personId = 'people/' + $routeParams.personId;
    var person = DataFactory.getItem(personId);
    $scope.person = person;
    $scope.subjectOf = DataFactory.getRelation(personId, 'about');
    $scope.mentionsOf = DataFactory.getRelation(personId, 'mentions');
    $scope.creatorOf = DataFactory.getRelation(personId, 'creator');
    $scope.knows = DataFactory.getRelation(personId, 'knows');
    $scope.spouses = DataFactory.getRelation(personId, 'spouse');
    $scope.children = DataFactory.getRelation(personId, 'parent');
    $scope.parents = DataFactory.getRelation(personId, 'children');
    $scope.siblings = DataFactory.getRelation(personId, 'sibling');
    $scope.relatedTo = DataFactory.getRelation(personId, 'relatedTo');
    $scope.memberOf = DataFactory.getRelation(personId, 'member');
    $scope.employeeOf = DataFactory.getRelation(personId, 'employee');
    //$scope.relatedTo = DataFactory.getRelatedTo(personId);
    console.log($scope.person);
    $scope.birthPlace = function() {
      var birthPlace = null;
      if (person.birthPlace) {
        birthPlace = DataFactory.getItem(person.birthPlace['@id']);
      }
      return birthPlace;
    };
    $scope.deathPlace = function() {
      var deathPlace = null;
      if (person.deathPlace) {
        deathPlace = DataFactory.getItem(person.deathPlace['@id']);
      }
      return deathPlace;
    };
  }]);