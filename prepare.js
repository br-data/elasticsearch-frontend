// Prepare Elasticsearch index
(function () {

  const elastic = require('elasticsearch');

  // Configuration
  let host = 'localhost:9200';
  let index = 'kuckucksnest';
  let type = 'doc';

  let client;

  // Execute script if not used as a module
  if (!module.parent) {

    init(
      process.argv[2],
      process.argv[3],
      process.argv[4]
    );
  }

  function init(_host, _index, _type) {

    // Overwrite default configuration with arguments
    // from module or command line interface
    host = _host || host;
    index = _index || index;
    type = _type || type;

    // Initialize Elasticsearch client
    client = new elastic.Client({ host: host });

    Promise.resolve()
      .then(deleteIndex, handleError)
      .then(createIndex, handleError)
      .then(checkStatus, handleError)
      .then(closeIndex, handleError)
      .then(putSettings, handleError)
      .then(putMapping, handleError)
      .then(openIndex, handleError);
  }

  function deleteIndex() {

    console.log('Deleting old index ...');

    return client.indices.delete({
      index,
      ignore: [404]
    }).then(handleResolve);
  }

  function createIndex() {

    console.log('Creating new index ...');

    return client.indices.create({
      index,
      body: {
        settings: {
          index: {
            number_of_replicas: 0
          }
        }
      }
    }).then(handleResolve);
  }

  function checkStatus() {

    console.log('Checking status ...');

    return client.cluster.health({
      index
    }).then(handleResolve);
  }

  function closeIndex() {

    console.log('Closing index ...');

    return client.indices.close({
      index
    }).then(handleResolve);
  }

  function putSettings() {

    console.log('Put settings ...');

    return client.indices.putSettings({
      index,
      type,
      body: {
        settings: {
          analysis: {
            analyzer: {
              folding: {
                tokenizer: 'standard',
                filter: ['lowercase', 'asciifolding']
              }
            }
          }
        }
      }
    }).then(handleResolve);
  }

  function putMapping() {

    console.log('Put mapping ...');

    return client.indices.putMapping({
      index,
      type,
      body: {
        properties: {
          body: {
            type: 'string',
            analyzer: 'standard',
            fields: {
              folded: {
                type: 'string',
                analyzer: 'folding'
              }
            }
          }
        }
      }
    }).then(handleResolve);
  }

  function openIndex() {

    console.log('Open index ...');

    return client.indices.open({
      index
    }).then(handleResolve);
  }

  function handleResolve(body) {

    if (!body.error) {

      console.log('\x1b[32m' + 'Success' + '\x1b[37m');
    } else {

      console.log('\x1b[33m' + 'Failed' + '\x1b[37m');
    }

    return Promise.resolve();
  }

  function handleError(err) {

    console.error(JSON.stringify(err.body, null, 2));

    return Promise.reject();
  }

  module.exports = { init };
})();
