'use strict';

var app = angular.module('lodBook.text', ['ngRoute', 'angular-inview', 'duScroll']);

app.config(['$routeProvider', '$anchorScrollProvider', function($routeProvider, $anchorScrollProvider) {
  $routeProvider.when('/text', {
    redirectTo: '/text/1'
  });
  $routeProvider.when('/text/:paraId', {
    templateUrl: 'modules/text/views/read_para.html',
    controller: 'ReadParaCtrl'
  });
  $anchorScrollProvider.disableAutoScrolling();
}]);

app.run(function($rootScope, $location, $document, $routeParams, $timeout) {
  $rootScope.$on('$routeChangeSuccess', function() {
    $timeout(function() {
        if ($location.path().match(/text\/\d+/)) {
          var paraId = parseInt($routeParams.paraId, 10);
          if (paraId > 1) {
            var target = angular.element(document.getElementById('para-' + paraId));
            $document.scrollToElement(target, 70);
          }
        }
      });
  });
});

app.controller('ReadCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.headings = $rootScope.headings;
    $scope.text = $rootScope.text;
  }]);

app.controller('ReadParaCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'TextFactory', 'DataFactory', function($rootScope, $scope, $routeParams, $location, TextFactory, DataFactory) {
    $scope.paraId = parseInt($routeParams.paraId, 10);
    $scope.currentParas = {};
    $scope.activePara = '';
    $scope.activeParaId = '';
    $scope.currentLinks = [];
    $scope.wordsTotal = TextFactory.getWords();
    $scope.text = TextFactory.getText();
    $scope.gotoPara = function() {
        $location.path('/text/' + $scope.gotoParaId);
      };
    $scope.paraInView = function(index, inview, inviewpart, event) {
        var id = event.inViewTarget.id.match(/para-(\d+)/)[1];
        if (inview === false) {
          delete $scope.currentParas[id];
        } else {
          $scope.currentParas[id] = {'offset': event.inViewTarget.offsetTop, 'part': inviewpart};
        }
        var offset = 100000;
        var activePara = '';
        var activeParaId = '';
        $scope.currentLinks = [];
        angular.forEach($scope.currentParas, function(para, paraId) {
            var links = TextFactory.getLinks(paraId);
            console.log(links);
            angular.forEach(links, function(link) {
              var person = DataFactory.getItem(link.link);
              if (typeof(person) !== 'undefined' && $scope.currentLinks.indexOf(person) === -1) {
                $scope.currentLinks.push(person);
              }
            });
            if (para.part === 'top' || para.part === 'both') {
              if (para.offset < offset) {
                offset = para.offset;
                activePara = TextFactory.getPara(paraId);
                activeParaId = paraId;
              }
            }
          });
        $scope.activePara = activePara;
        $scope.activeParaId = activeParaId;
        //$scope.currentLinks = currentLinks;
        $scope.paraCount = TextFactory.getParaCount();
        $scope.paraNumbers = TextFactory.getParaNumbers();
        $scope.gotoParaId = $scope.paraNumbers[activeParaId-1];
        return false;
      };

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
