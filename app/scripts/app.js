'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('lodBook', [
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'duScroll',
  'mgcrea.ngStrap',
  'ui.bootstrap',
  'angular-parallax',
  'picardy.fontawesome',
  'lodBook.text',
  'lodBook.people',
  'lodBook.resources',
  'lodBook.places',
  'lodBook.events',
  'lodBook.organisations',
  'lodBook.filters'
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/text/1'});
  $locationProvider.hashPrefix('!');
}]);

app.factory('DataFactory', function($document, $filter) {
    var replaceColons = function(array) {
        //Because colons seem to cause problems in some expressions
        //Would be good to get rid of this somehow.
        var newArray = [];
        angular.forEach(array, function(object) {
            var newObject = {};
            angular.forEach(object, function(value, property) {
                newObject[property.replace(':', '_')] = value;
              });
            newArray.push(newObject);
          });
        return newArray;
      };

    //var getRandom = function(min, max) {
    //    return Math.floor(Math.random()*(max-min+1)+min);
    //  };

    console.log('Running DataFactory...');
    var allData = [];
    var dataFactory = {};
    //var peopleJson = angular.element('#people-json')[0];
    //allData = allData.concat(JSON.parse(peopleJson.innerHTML)['@graph']);
    //var resourcesJson = angular.element('#resources-json')[0];
    var dataJson = angular.element('#data-json')[0];
    allData = JSON.parse(dataJson.innerHTML)['@graph'];
    allData = replaceColons(allData);
    console.log(allData);

    dataFactory.getItem = function(itemId) {
        var items = $filter('filter')(allData, {'@id': itemId});
        console.log(items[0]);
        return items[0];
      };

    dataFactory.getSubjectOf = function(itemId) {
        //Return all resources that are about the supplied item
        var items = $filter('searchJSONLD')(allData, {'about': itemId});
        return items;
      };

    dataFactory.getMentionsOf = function(itemId) {
        //Return all resources that mention the supplied item
        var items = $filter('searchJSONLD')(allData, {'mentions': itemId});
        return items;
      };

    dataFactory.getRelation = function(itemId, relation) {
        //Return all resources that mention the supplied item
        var filter = {};
        filter[relation] = itemId;
        console.log(filter);
        var items = $filter('searchJSONLD')(allData, filter);
        return items;
      };

    dataFactory.getCreatorOf = function(itemId) {
        //Return all resources that are created by the supplied entity
        var items = $filter('searchJSONLD')(allData, {'creator': itemId});
        return items;
      };

    dataFactory.getPeople = function() {
        var people = $filter('filter')(allData, {'@id': '/people/'});
        return people;
      };

    dataFactory.getOrganisations = function() {
        var organisations = $filter('filter')(allData, {'@id': '/organisations/'});
        return organisations;
      };

    dataFactory.getResources = function() {
        var resources = $filter('filter')(allData, {'@id': '/resources/'});
        return resources;
      };

    dataFactory.getPlaces = function() {
        var places = $filter('filter')(allData, {'@id': '/places/'});
        return places;
      };

    dataFactory.getEvents = function() {
        var events = $filter('filter')(allData, {'@id': '/events/'});
        return events;
      };

    dataFactory.getImages = function(itemId) {
        var resources = $filter('filter')(allData, {'@type': 'CreativeWork', 'about': itemId, 'thumbnailUrl': ''});
        return resources;
      };

    dataFactory.loading = 'Loading data from DataFactory...';
    
    return dataFactory;
  });

app.factory('TextFactory', function($document, $filter) {
    console.log('Running TextFactory...');
    var textFactory = {};
    var text = [];
    var links = {};
    var references = {};
    var headings = {};
    var title1 = 'Another great LOD Book';
    var titleSep, title2;
    var pCount = 1;
    var hCount = 1;
    var parent = 0;
    var wordsTotal = 0;
    //Load text from page into array
    angular.forEach(angular.element('[property="name"]', angular.element('#content')), function(link) {
        var label = angular.element(link).text();
        var aboutId = angular.element(link).attr('about');
        links[label] = aboutId;
        if (!(aboutId in references)) {
          references[aboutId] = [label];
        } else {
          references[aboutId].push(label);
        }
      });
    var elements = angular.element('#content').children();
    angular.forEach(elements, function(elem) {
        var tag = elem.tagName;
        if (tag.match(/H1/)) {
          title1 = angular.element(elem).text();
          angular.forEach([': ', ' – '], function(sep) {
                var parts = title1.split(sep);
                if (parts.length === 2) {
                  title1 = parts[0];
                  titleSep = sep;
                  title2 = parts[1];
                }
              });
        } else if (tag.match(/H[2-6]{1}/)) {
          var myParent = parent;
          var level = parseInt(tag.substring(1), 10);
          if ((parent !== 0) && (level < headings[parent].level)) {
            myParent = headings[headings[parent].parent].parent;
          }
          headings[hCount] = {
            'parent': myParent,
            'content': angular.element(elem).html(),
            'level': level,
            'start': pCount
          };
          parent = hCount;
          text.push({
            'id': hCount,
            'parent': parent,
            'type': 'h',
            'level': level,
            'content': angular.element(elem).html()
          });
          hCount++;
        } else {
          var paraText = angular.element(elem).text();
          var words = 0;
          var paraLinks = [];
          if (paraText.length > 0) {
            words = paraText.match(/\s+/g).length;
          }
          angular.forEach(links, function(link, key) {
            var pattern = new RegExp(key);
            if (pattern.exec(angular.element(elem).text()) !== null) {
              paraLinks.push({'label':key, 'link': link});
            }
          });
          text.push({
            'id': pCount,
            'parent': parent,
            'type': 'p',
            'content': angular.element(elem).html(),
            'links': paraLinks,
            'words': words,
            'wordsProgress': wordsTotal
          });
          wordsTotal += words;
          pCount++;
        }
      });
    elements.remove();

    textFactory.getTitle = function() {
        return [title1, titleSep, title2];
      };

    textFactory.getText = function() {
        return text;
      };

    textFactory.getHeadings = function() {
        return headings;
      };

    textFactory.getWords = function() {
        return wordsTotal;
      };

    textFactory.getParas = function() {
        return $filter('filter')(text, {'type': 'p'});
      };

    textFactory.getPara = function(paraId) {
        return $filter('filter')(text, {'type': 'p', 'id': paraId})[0];
      };

    textFactory.getLinks = function(paraId) {
        return $filter('filter')(text, {'type': 'p', 'id': paraId})[0].links;
      };

    textFactory.getParaCount = function() {
        return $filter('filter')(text, {'type': 'p'}).length;
      };

    textFactory.getParaNumbers = function() {
        var paraNums = [];
        var total = textFactory.getParaCount();
        for (var i = 1; i <= total; i++) {
          paraNums.push(i);
        }
        return paraNums;
      };

    textFactory.getReferencesTo = function(itemId) {
      references = [];
      var paras = $filter('filter')(text, {'type': 'p', 'links': itemId});
      console.log(paras);
      angular.forEach(paras, function(para) {
        var links = $filter('filter')(para.links, {'link': itemId});
        console.log(links);
      });
    };

    textFactory.loading = 'Loading data from TextFactory...';
    
    return textFactory;
  });

app.run(function(TextFactory){
    console.log(TextFactory.loading);
  });

app.run(function(DataFactory){
    console.log(DataFactory.loading);
  });

app.controller('AppCtrl', ['$scope', '$location', 'TextFactory', function($scope, $location, TextFactory) {
    $scope.title = TextFactory.getTitle();
    $scope.isActive = function (viewLocation) {
        var path = new RegExp(viewLocation);
        var active = path.exec($location.path());
        return active;
      };
    $scope.checkClass = function(id) {
      var thisClass;
      if (id.indexOf('/people/') !== -1) {
        thisClass = 'people';
      } else if (id.indexOf('/organisations/') !== -1) {
        thisClass = 'organisation';
      } else if (id.indexOf('/resources/') !== -1) {
        thisClass = 'resource';
      } else if (id.indexOf('/events/') !== -1) {
        thisClass = 'event';
      } else if (id.indexOf('/places/') !== -1) {
        thisClass = 'place';
      }
      return thisClass;
    };
  }]);
