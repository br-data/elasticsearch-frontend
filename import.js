// Import text files to Elasticsearch
(function () {

  const fs = require('fs');
  const dir = require('node-dir');
  const elastic = require('elasticsearch');

  // Configuration
  let inputFolder = './text/';
  let host = 'localhost:9200';
  let index = 'kuckucksnest';
  let type = 'doc';

  let fileCount, client;

  // Execute script if not used as a module
  if (!module.parent) {

    init(
      process.argv[2],
      process.argv[3],
      process.argv[4],
      process.argv[5]
    );
  }

  function init(_inputFolder, _host, _index, _type) {

    // Overwrite default configuration with arguments
    // from module or command line interface
    inputFolder = _inputFolder || inputFolder;
    host = _host || host;
    index = _index || index;
    type = _type || type;

    // Initialize Elasticsearch client
    client = new elastic.Client({ host: host });

    readFiles();
  }

  function readFiles() {

    // Get a list of all files
    dir.files(inputFolder, (error, fileList) => {

      if (error) { throw error; }

      // Include text files only
      fileList = fileList.filter(file => file.indexOf('.txt') > -1);
      fileCount = fileList.length;

      processFiles(fileList);
    });
  }

  function processFiles(fileList) {

    const filePath = fileList.pop();

    if (filePath) {

      // Read file content
      fs.readFile(filePath, 'utf8', (error, body) => {

        if (error) { throw error; }

        saveToElastic(filePath, body, () => {

          // Recursion
          processFiles(fileList);
        });
      });

    } else {

      console.log(`Finished processing ${fileCount} documents`);
    }
  }

  // Saves file content and meta data to ElasticSearch
  function saveToElastic(filePath, body, callback) {

    client.create({
      index,
      type,
      body: {
        filePath,
        body
      }
    },
    error => {

      if (error) throw error;

      console.log(`Inserted document ${filePath} to ElasticSearch`);
      callback();
    });
  }

  module.exports = { init };
})();
