'use strict';

var app = angular.module('lodBook.text', ['ngRoute', 'duScroll', 'debounce', 'ngAnimate', 'ui.bootstrap', 'ui.utils']);

app.config(['$routeProvider', '$anchorScrollProvider', function($routeProvider, $anchorScrollProvider) {
  $routeProvider.when('/text', {
    redirectTo: '/text/1'
  });
  $routeProvider.when('/text/:paraId/', {
    templateUrl: 'modules/text/views/read_para.html',
    controller: 'ReadParaCtrl'
  });
  //$anchorScrollProvider.disableAutoScrolling();
}]);

//app.run(function($rootScope, $location, $document, $routeParams, $timeout) {
  //$rootScope.$on('$routeChangeSuccess', function() {
    //$timeout(function() {
      //  if ($location.path().match(/text\/\d+/)) {
        //  var paraId = parseInt($routeParams.paraId, 10);
          //if (paraId > 1) {
            //var target = angular.element(document.getElementById('para-' + paraId));
            //$document.scrollToElement(target, 70);
          //}
        //}
      //});
  //});
//});

app.controller('ReadCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.headings = $rootScope.headings;
    $scope.text = $rootScope.text;
  }]);

app.controller('ReadParaCtrl', ['$scope', '$document', '$routeParams', '$location', '$timeout','TextFactory', 'DataFactory', function($scope, $document, $routeParams, $location, $timeout, TextFactory, DataFactory) {
    $scope.paraId = parseInt($routeParams.paraId, 10);
    $scope.currentParas = [];
    $scope.activePara = '';
    $scope.activeParaId = '';
    $scope.currentLinks = [];
    $scope.wordsTotal = TextFactory.getWords();
    $scope.text = TextFactory.getText();
    $scope.gotoPara = function() {
        $location.path('/text/' + $scope.gotoParaId);
      };
    $scope.scrollToPara = function() {
      var someElement = angular.element(document.getElementById('para-' + $scope.paraId));
      $document.scrollToElement(someElement, 60);
    };
    $scope.setActiveParaId = function(paraId) {
      $scope.activeParaId = paraId;
      $scope.activePara = TextFactory.getPara(paraId);
      $scope.getCurrentLinks();
    };
    $scope.getCurrentLinks = function() {
      var people = [];
      var resources = [];
      var places = [];
      var events = [];
      var organisations = [];
      console.log($scope.activeParaId);
      var activePara = TextFactory.getPara($scope.activeParaId);
      angular.forEach(activePara.links, function(link, index) {
        var item = DataFactory.getItem(link.link);
        if (typeof item !== 'undefined') {
          if (item['@id'].indexOf('/people/') !== -1 && people.indexOf(item) === -1) {
            people.push(item);
          } else if (item['@id'].indexOf('/resources/') !== -1 && resources.indexOf(item) === -1) {
            resources.push(item);
          } else if (item['@id'].indexOf('/places/') !== -1 && places.indexOf(item) === -1) {
            places.push(item);
          } else if (item['@id'].indexOf('/organisations/') !== -1 && organisations.indexOf(item) === -1) {
            organisations.push(item);
          } else if (item['@id'].indexOf('/events/') !== -1 && events.indexOf(item) === -1) {
            events.push(item);
          }
        }
      });
      $scope.currentLinks = {'people': people, 'resources': resources, 'organisations': organisations, 'places': places, 'events': events};
    };
    
    $timeout(function() {
      if ($scope.paraId > 1) {
        $scope.scrollToPara();
      }
      $scope.setActiveParaId($scope.paraId);
    });
    
  }]);

app.directive('makeHeading', function() {
    return {
        restrict: 'E',
        scope: { heading: '='},
        template: '<a href="#!/read/p/{{ heading.start }}"><h1 ng-if="heading.level==1">{{ heading.content }}</h1>' +
        '<h2 ng-if="heading.level==2">{{ heading.content }}</h2>' +
        '<h3 ng-if="heading.level==3">{{ heading.content }}</h3></a>'

      };
  });

app.directive('scroll', function ($parse, $document, $window, debounce) {
    function link(scope, element) {
      var getActivePara = function() {
          var visibleParas = [];
          var children = element.children();
          var containerTop = element[0].offsetTop - 40;
          var windowTop = angular.element($window).scrollTop();
          var windowBottom = windowTop + angular.element($window).innerHeight();
          angular.forEach(children, function(element) {
            var para = element.children[0];
            if (para.tagName === 'P') {
              var paraTop = para.offsetTop + containerTop;
              if (paraTop >= windowTop && paraTop <= windowBottom) {
                var paraId = parseInt(para.id.match(/para-(\d+)/)[1], 10);
                visibleParas.push(paraId);
              }
            }
          });
          var first = Math.min.apply(Math, visibleParas);
          scope.$apply(function() {
            scope.scroll({paraId:first});
          });
        };
      angular.element($document).on('scroll', debounce(getActivePara, 500));
    }
    return {
        restrict: 'A',
        scope: {
          scroll: '&',
          scrollItem: '='
        },
        link: link
      };
  });