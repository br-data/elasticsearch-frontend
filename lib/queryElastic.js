// Queries Elasticsearch for data using different methods
const elastic = require('elasticsearch');
const config = require('../config');

const elasticClient = new elastic.Client({ host: config.database.host });

function queryElastic() {
  return (req, res, next) => {
    if (req.query.query && req.query.type) {
      elasticClient.search(buildQuery(req), (error, data) => {
        req.error = error;
        req.result = data;
        next();
      });
    } else {
      req.error = new Error('Query string and query type are undefined.');
      req.result = null;
      next();
    }
  };
}

function buildQuery(req) {
  let query = config.queries[req.query.type];

  query.setQuery(req.query.query);
  query = query.query;

  return {
    index: config.database.index,
    size: 500,
    body: {
      query: query,
      _source: config._source,
      highlight: config.highlight
    }
  };
}

module.exports = queryElastic;
