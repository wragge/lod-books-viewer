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
    var getRandom = function(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
      };
    var personId = $routeParams.personId;
    $scope.person = DataFactory.getItem(personId);
    var resources = DataFactory.getImages(personId);
    if (resources.length > 1) {
      var index = getRandom(0, resources.length-1);
      $scope.imageObject = resources[index];
    } else if (resources.length === 1) {
      $scope.imageObject = resources[0];
    }
    $scope.subjectOf = DataFactory.getSubjectOf(personId);
    $scope.mentionsOf = DataFactory.getMentionsOf(personId);
    $scope.creatorOf = DataFactory.getCreatorOf(personId);
    $scope.referencesTo = TextFactory.getReferencesTo(personId);
    console.log($scope.referencesTo);
  }]);