// Queries Elasticsearch for data using different methods
const elastic = require('elasticsearch');
const config = require('../config');

const elasticClient = new elastic.Client(config.database.host);
const elasticIndex = config.database.index;

function queryElastic() {
  return (req, res, next) => {
    elasticClient.search(buildQuery(req), (error, data) => {
      req.error = error;
      req.result = data;
      next();
    });
  };
}

function buildQuery(req) {
  let body = {
    elasticIndex,
    size: 500,
    body: {
      query: undefined,
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
  let query = config.queryTypes[req.query.type];

  query.setQuery(req.query.query);
  body.body.query = query.query;

  return query;
}

module.exports = queryElastic;
