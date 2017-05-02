// Prepare Elasticsearch index
const elastic = require('elasticsearch');

const client = new elastic.Client({ host: 'localhost:9200' });
const index = 'kuckucksnest';
const type = 'doc';

(function init() {

  Promise.resolve()
    .then(deleteIndex, handleError)
    .then(createIndex, handleError)
    .then(checkStatus, handleError)
    .then(closeIndex, handleError)
    .then(putSettings, handleError)
    .then(putMapping, handleError)
    .then(openIndex, handleError);
})();

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
