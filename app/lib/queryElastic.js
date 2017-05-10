// Queries Elasticsearch for data using different methods
const elastic = require('elasticsearch');
const config = require('../config');

const elasticClient = new elastic.Client({ host: config.database.host });

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
  const index = config.database.index;
  let query = config.queries[req.query.type];
  const _source = config._source;
  const highlight = config.highlight;

  query.setQuery(req.query.query);
  query = query.query;

  return {
    index,
    size: 500,
    body: { query, _source, highlight }
  };
}

module.exports = queryElastic;
