'use strict';

var app = angular.module('lodBook.events', ['ngRoute', 'angular-timeline']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/events', {
    templateUrl: 'modules/events/views/events.html',
    controller: 'EventsCtrl'
  });
  $routeProvider.when('/events/timeline', {
    templateUrl: 'modules/events/views/events_timeline.html',
    controller: 'EventsCtrl'
  });
  $routeProvider.when('/events/:eventId', {
    templateUrl: 'modules/events/views/organisation.html',
    controller: 'EventCtrl'
  });
}]);

app.controller('EventsCtrl', ['$scope', '$filter', 'DataFactory', function($scope, $filter, DataFactory) {
    //var events = DataFactory.getEvents();
    var events = [];
    var people = DataFactory.getPeople();
    var born = $filter('filter')(people, {'birthDate': '1'});
    var died = $filter('filter')(people, {'deathDate': '1'});
    angular.forEach(born, function(person) {
      var newEvent = {'@id': person['@id'], '@type': 'Birth', 'name': 'Birth of ' + person.name, 'startDate': person.birthDate};
      if (typeof person.image !== 'undefined') {
        newEvent.image = person.image;
      }
      events.push(newEvent);
    });
    angular.forEach(died, function(person) {
      var newEvent = {'@id': person['@id'], '@type': 'Death', 'name': 'Death of ' + person.name, 'startDate': person.deathDate};
      if (typeof person.image !== 'undefined') {
        newEvent.image = person.image;
      }
      events.push(newEvent);
    });
    $scope.events = $filter('orderBy')(events, 'startDate');
    console.log(events);
  }]);

app.controller('EventCtrl', ['$scope', '$routeParams', 'DataFactory', 'TextFactory', function($scope, $routeParams, DataFactory, TextFactory) {
    var eventId = 'events/' + $routeParams.eventId;
    $scope.event = DataFactory.getItem(eventId);
    $scope.subjectOf = DataFactory.getSubjectOf(eventId);
    $scope.mentionsOf = DataFactory.getMentionsOf(eventId);
    $scope.creatorOf = DataFactory.getCreatorOf(eventId);
  }]);

app.filter('timeline', function() {
    return function(item) {
      var side = 'left';
      if (item === 'Death') {
        side = 'right';
      }
      return side;
    };
  });