const extract = ((() => {

  // Extract text from PDF files, using OCR if necessary
  const fs = require('fs');
  const path = require('path');
  const dir = require('node-dir');
  const tika = require('tika');

  // Configuration
  let inputDir = './test/';
  let outputDir = './text/';

  // Tika and OCR options
  const options = {

    contentType: 'application/pdf',
    ocrLanguage: 'deu',
    pdfEnableAutoSpace: true,
    pdfExtractInlineImages: true
  };

  let callback = () => { return; };

  // Execute script if not used as a module
  if (!module.parent) {

    init(
      process.argv[2],
      process.argv[3],
      process.argv[4],
      process.argv[5]
    );
  }

  function init(_inputDir, _outputDir, _language, _callback) {

    // Overwrite default configuration with arguments
    // from module or command line interface
    inputDir = _inputDir || inputDir;
    outputDir = _outputDir || outputDir;
    options.language = _language || options.language;
    callback = _callback || callback;

    // Create output folder if missing
    if (!fs.existsSync(outputDir)) {

      fs.mkdirSync(outputDir);
    }

    readFiles(processFiles);
  }

  function readFiles(callback) {

    // Get a list of all files
    dir.files(inputDir, (error, files) => {

      if (error) { throw error; }

      // Include PDF files only
      files = files.filter(file => file.search(/.*.pdf/) > -1);

      callback(files);
    });
  }

  function processFiles(files) {

    const filesCount = files.length;

    console.log(`Started file processing (${new Date().toLocaleString()})`);

    // Recursively process the files
    (function recurse() {

      if (files.length > 0) {

        console.log(`Processing file ${filesCount - files.length + 1} of ${filesCount}`);

        extractText(files.pop(), recurse);
      } else {

        console.log(`Finished processing ${filesCount} files (${new Date().toLocaleString()})`);
      }
    })(files);
  }

  function extractText(filePath, callback) {

    // Extract text from PDF file
    tika.text(filePath, options, (error, result) => {

      //if (error) { throw error; }
      if (error) { console.error(error); }

      const fileName = filePath.substr(filePath.lastIndexOf('/') + 1);

      // Save extracted content as text file
      saveFile(path.join(outputDir, `${fileName}.txt`), result);
      callback();
    });
  }

  function saveFile(relativePath, string) {

    // Normalize file path
    relativePath = path.normalize(relativePath);

    try {

      console.log('Saved file', relativePath);

      // Save file
      return fs.writeFileSync(relativePath, string, 'utf8');
    } catch (error) {

      console.error(error);
    }
  }

  module.exports = {

    init
  };
})());
