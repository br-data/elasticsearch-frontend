# Elasticsearch Frontend

[![License](https://img.shields.io/github/license/br-data/elasticsearch-frontend.svg?style=flat-square)]() [![GitHub release](https://img.shields.io/github/release/br-data/elasticsearch-frontend.svg?style=flat-square)]() [![GitHub issues](https://img.shields.io/github/issues/br-data/elasticsearch-frontend.svg?style=flat-square)]()

Simple search interface for large document collections in [Elasticsearch](https://www.elastic.co/de/products/elasticsearch). Made for the exploration and analysis of big document leaks. The application is build with [Express](https://expressjs.com/) and [Pug](https://pugjs.org/). User authentication and protected routes are provided by [Passport](http://passportjs.org/).

## History
The initial prototype was build to uncover the tax haven in the free trade zone of Madeira. We used Elasticsearch to build a document search for the [Madeira Gazette](www.gov-madeira.pt/joram/). Many of those big PDF files are simple document scans which we wanted to search for persons and company names. Read the whole story: [Madeira – A Tax Haven Approved by the European Commission](http://web.br.de/madeira/english/)

Why build another document search engine? – Because it super lightweight and customizable. Until we add more features.

## Requirements
The application is written in JavaScript. You'll need **Node.js v6** at least, to run the application. Check out the [Node.js installation guide](https://nodejs.org/en/download/package-manager/). We use **Elasticsearch 2.4** for document storage and search. For further details, please refer to the [Elasticsearch installation guide](https://www.elastic.co/guide/en/elasticsearch/reference/2.4/_installation.html).

To check if your Elasticsearch is up and running, call the REST-Interface from the command line:

```
$ curl -XGET http://localhost:9200/_cluster/health\?pretty\=1
```

If you are seeing a _Unassigned shards_ warning, you might consider setting the numbers of replicas to 0. This works fine in a development environment:

```
$ curl -XPUT 'localhost:9200/_settings' -d '         
{                  
  index: {
    number_of_replicas : 0
  }
}'
```

To check if your document are all in place, run a simple search query on your index:

```
$ curl -XGET 'localhost:9200/my-index/_search?q=body:my-query&pretty'
```

## Installation
Installation and configuration is straight forward, once Elasticsearch is set up. 

1. Import documents to Elasticsearch: If you have never done that before, there is another repo dedicated to extracting text from PDF files and importing them to Elasticsearch: [elasticsearch-import-tools](https://github.com/br-data/elasticsearch-import-tools)
2. Edit the `config/config.development.js` file. 
3. Start the server: `npm start`.
4. Go to http://localhost:3000. The default username is `user` and the password is `password`.

## Searching
There are four different ways to search for whole sentences (full-text) or a single word (term):

**Standard search** (full-text search): Finds exact word combinations like `John Doe`. Diacritcs are ignored and a search for `John Doe` will also find `Jóhñ Döé`.

**Custom search** (full-text search): By default, the custom search finds all documents that contain `John` AND `Doe`. Supports wildcards and simple search operators:

- `+` signifies AND operation
- `|` signifies OR operation
- `-` negates a single token
- `"` wraps a number of tokens to signify a phrase for searching
- `*` at the end of a term signifies a prefix query
- `~N` after a word signifies edit distance (fuzziness)
- `~N` after a phrase signifies slop amount

**Fuzzy search** (term-based search): Finds words, even if they contain a typo or OCR mistake. A search for `Jhon` or `J°hn` will also find `John`.

**Regex search** (term-based search): Uses Regex patterns like `J.h*` for searching. This Regex will find words such as `John`, `Jahn` and `Johnson`.

## Customization
If you want to change the page title and description, simply update the configuration `config/config.development.js`.

```
config.page = {
  title: 'Document Search',
  description: 'Search Elasticsearch documents for persons, companies and addresses.'
};
```

## Authentication
The current authentication strategy is username and password, using [passport-local](https://github.com/jaredhanson/passport-local). Passport provides many different authentication strategies as Express middleware. If you want to change the authentication method, go ahead, check out the [Passport docs](http://passportjs.org/).

For the ease of development, valid users are stored in the configuration `config/config.development.js`:

```javascript
config.users = [
  {
    id: 1,
    username: 'user',
    password: '$2a$10$vP0qJyEd0hvvpG5MAaHg9ObUJJpJj9HxINZ/Yqz5nPo5Ms2nhR4r.',
    displayName: 'Demo User',
    apiToken: '0b414d8433124406be6500833f1672e5'
  }
];
```

New password hashes are created using [bcrypt](https://github.com/kelektiv/node.bcrypt.js):

```javacript
const bcrypt = require('bcrypt')
const saltRounds = 10
const myPlaintextPassword = 'password'
const salt = bcrypt.genSaltSync(saltRounds)
const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt)

``` 

Note that the list of user could easily be stored in a database like MongoDB.

## API

```
curl -v -H "Authorization: Bearer 0b414d8433124406be6500833f1672e5" http://127.0.0.1:3000/api
curl -v "http://127.0.0.1:3000/api?access_token=0b414d8433124406be6500833f1672e5"
```

## Deployment
To deploy the application in a live environment, create a new configuration `config/config.production.js`. Update it with all your server information, Elasticsearch host, credentials etc.

Use the new configuration by starting node with the environment variable set to `production`:

```
$ NODE_ENV=production node bin/www
```

To keep it running, use a process manager like [forever](https://github.com/foreverjs/forever) or [PM2](https://github.com/Unitech/pm2):

```
$ NODE_ENV=production forever start bin/www
```

It's advisable to use SSL/TLS encryption for all connections to the server. One way to do this, is routing your Node.js application through an Apache or Nginx proxy with HTTPS enabled.

## Planned features
- Add (inline) document viewer
- Add document import and ingestion
- Split data retrieval and rendering

## Similar projects:
If you are looking for even mightier alternative, check out:
- OCCRP: [Aleph](https://github.com/alephdata/aleph), playing live at [Investigative Dashboard](http://data.occrp.org)
- New York Times: [Stevedore](https://github.com/newsdev/stevedore)
- [DocumentCloud](https://github.com/documentcloud) 
- [Open Semantic Search](https://www.opensemanticsearch.org)
