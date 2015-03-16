'use strict';

var app = angular.module('lodBook.places', ['ngRoute', 'leaflet-directive']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/places', {
    redirectTo: '/places/list',
  });
  $routeProvider.when('/places/map', {
    templateUrl: 'modules/places/views/places_map.html',
    controller: 'PlacesMapCtrl'
  });
  $routeProvider.when('/places/list', {
    templateUrl: 'modules/places/views/places_list.html',
    controller: 'PlacesListCtrl'
  });
  $routeProvider.when('/places/:placeId', {
    templateUrl: 'modules/places/views/place.html',
    controller: 'PlaceCtrl'
  });
}]);

app.controller('PlacesMapCtrl', ['$scope', '$filter', 'DataFactory', function($scope, $filter, DataFactory) {
    var markers = {};
    var places = DataFactory.getPlaces();
    var located = $filter('searchJSONLD')(places, {'geo': '_'});
    angular.forEach(located, function(place) {
      var geo = DataFactory.getItem(place.geo['@id']);
      var link = '<a href="' + $filter('localiseUrl')(place['@id']) + '">' + place.name + '</a>';
      markers[place['@id']] = {'lat': geo.latitude, 'lng': geo.longitude, 'message': link};
    });
    $scope.markers = markers;
  }]);

app.controller('PlacesListCtrl', ['$scope', '$filter', 'DataFactory', function($scope, $filter, DataFactory) {
    var places = DataFactory.getPlaces();
    $scope.places = $filter('orderBy')(places, 'name');
  }]);

app.controller('PlaceCtrl', ['$scope', '$routeParams', '$filter', 'DataFactory', function($scope, $routeParams, $filter, DataFactory) {
    var placeId = '/places/' + $routeParams.placeId;
    var place = DataFactory.getItem(placeId);
    $scope.place = place;
    if (place.geo) {
      var geo = DataFactory.getItem(place.geo['@id']);
      $scope.geo = geo;
      $scope.markers = {};
      $scope.centre = {'lat': geo.latitude, 'lng': geo.longitude, 'zoom': 8};
      $scope.markers.main = {'lat': geo.latitude, 'lng': geo.longitude};
    }
    $scope.containedIn = DataFactory.getRelation(placeId, 'contains');
    $scope.contains = DataFactory.getRelation(placeId, 'containedIn');
    $scope.born = DataFactory.getRelation(placeId, 'birthPlace');
    $scope.died = DataFactory.getRelation(placeId, 'deathPlace');
    $scope.located = DataFactory.getRelation(placeId, 'location');
  }]);