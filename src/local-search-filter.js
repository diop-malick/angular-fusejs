(function() {
  _ = require('lodash');

  getPropertiesToSearchOn = function(item, properties) {
    propertiesToSearchOn = {};

    if(properties) {
      _.each(properties, function(property) {
        propertyValue = _.get(item, property);

        if(_.isString(propertyValue)) {
          propertiesToSearchOn[property] = propertyValue;
        }
      });
    }
    else {
      // TODO Implement full deep search
    }

    return propertiesToSearchOn;
  };

  // items: Array of string or objects to search on
  // searchString: String that will be split (on spaces) into searchTerms
  // options:
  //   properties: Array of items' properties to search on. Default to null.
  //               When null, all string properties will be searched (deep search).
  //               Only supported if items is an array of objects. Deep properties may be specified
  //               using a dot delimiter syntax i.e. ['rootProperty.subProperty.subSubProperty'].
  //               Properties are ignored if it's not a string. Does not support nested array yet,
  //               but supports "elements[0].subElement" syntax.
  //   operator: Can be "or" (default) or "and". When "or", all search terms must be
  //             present in at least one of item's field (if items are objects). When "and",
  //             all search terms must be present in all item's field.
  //   minimumMatch: Float from 0 to 1 (default 1) Only returns the item if percentage of searchTerms
  //                 found in item is equal or higher than minimumMatch.
  //   sortByRelevancy: True or false (default). Passing to true will sort the returned array
  //                    by descending relevancy order. Relevancy is based on the number
  //                    of search terms found in the item. Only relevant to use if minimumMatch != 1.
  module.exports = function() {
    return function(items, searchString, options) {
      items = items || []

      if(!searchString || !_.isString(searchString)) {
        return items;
      }

      searchTerms = searchString.trim().split(' ');

      if(searchTerms.length > 0) {
        foundSearchTerms = [];

        matchingItems = _.filter(items, function(item) {
          propertiesToSearchOn = getPropertiesToSearchOn(item, options.properties);

          _.each(searchTerms, function(searchTerm) {
            _.each(propertiesToSearchOn, function(propertyToSearchOn, key) {
              if(propertyToSearchOn.toLowerCase().indexOf(searchTerm) != -1) {
                foundSearchTerms.push(searchTerm);
              }
            });
          });

          return _.uniq(foundSearchTerms).length === searchTerms.length;
        });

        return matchingItems;
      }
      else {
        return items;
      }

    };
  }
})();