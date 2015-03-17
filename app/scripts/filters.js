'use strict';

var filters = angular.module('lodBook.filters', []);

filters.filter('localiseUrl', function() {
    return function(item) {
        var link = item.match(/(#\!\/(resources|people|places|events|organisations)\/[a-z_\-0-9]+)/);
        return link ? link[1] : item;
      };
  });

filters.filter('dateFormat', function($filter) {
  return function(date) {
      var parts = date.split('-');
      var formattedDate;
      if (parts.length === 1) {
        formattedDate = date;
      } else if (parts.length === 2) {
        formattedDate = $filter('date')(date + '-' + '01', 'MMMM yyyy');
      } else {
        formattedDate = $filter('date')(date, 'd MMMM yyyy');
      }
      return formattedDate;
    };
});

filters.filter('labelIdentifier', function() {
    return function(item) {
      var label = item;
      if (item.indexOf('wikipedia') !== -1) {
        label = 'Wikipedia';
      } else if (item.indexOf('nla.party') !== -1 || item.indexOf('trove.nla') !== -1) {
        label = 'Trove';
      }
      return label;
    };
  });

filters.filter('listLength', function() {
    return function(item) {
        var length = false;
        if (item && Array.isArray(item) === true) {
          length = item.length;
        } else if (item) {
          length = Object.keys(item).length;
        }
        return length;
      };
  });

filters.filter('listify', function() {
    return function(item) {
      if (item && Array.isArray(item) === false) {
        item = [item];
      }
      return item;
    };
  });

filters.filter('nonEmpty', function() {
  return function(object) {
    return !!(object && Object.keys(object).length > 0);
  };
});

filters.filter('searchJSONLD', function() {
    return function(resources, expression) {
        var results = [];
        var property = Object.keys(expression)[0];
        var value = expression[property];
        angular.forEach(resources, function(resource) {
            if (resource.hasOwnProperty(property)) {
              if (Array.isArray(resource[property])) {
                angular.forEach(resource[property], function(item) {
                  if (item['@id'].indexOf(value) !== -1) {
                    results.push(resource);
                  }
                });
              } else {
                if (resource[property]['@id'].indexOf(value) !== -1) {
                  results.push(resource);
                }
              }
            }
          });
        return results;
      };
  });