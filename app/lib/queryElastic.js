// Queries Elasticsearch for data using different methods
const elastic = require('elasticsearch');
const config = require('../config');

const elasticClient = new elastic.Client(config.elastic.host);
const elasticIndex = config.elastic.index;

function queryElastic() {
  return (req, res, next) => {
    elasticClient.search(useMultiMatch(req.query), (error, data) => {
      req.error = error;
      req.result = data;
      next();
    });
  };
}

function useMultiMatch(query) {
  return {
    elasticIndex,
    size: 500,
    body: {
      query: {
        multi_match: {
          query: query.query,
          type: 'phrase',
          fields: ['body', 'body.folded']
        }
      },
      _source: {
        excludes: ['body*']
      },
      highlight: {
        fields: {
          body: {},
          'body.folded': {}
        }
      }
    }
  };
}

module.exports = queryElastic;
