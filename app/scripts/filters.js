'use strict';

var filters = angular.module('lodBook.filters', []);

filters.filter('localiseUrl', function() {
    return function(item) {
        var link = item.match(/(#\!\/(resources|people)\/[a-z_\-0-9]+)/);
        return link ? link[1] : item;
      };
  });

filters.filter('searchJSONLD', function() {
    return function(resources, expression) {
        var results = [];
        var property = Object.keys(expression)[0];
        var value = expression[property];
        angular.forEach(resources, function(resource) {
            if (resource.hasOwnProperty(property)) {
              if (resource[property]['@id'].indexOf(value) !== -1) {
                results.push(resource);
              }
            }
          });
        return results;
      };
  });