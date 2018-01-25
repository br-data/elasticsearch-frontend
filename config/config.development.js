const config = {};

config.page = {
  title: 'Document Search',
  description: 'Search Elasticsearch documents for persons, companies and addresses.'
};

config.users = [
  {
    id: 1,
    username: 'user',
    password: '$2a$10$vP0qJyEd0hvvpG5MAaHg9ObUJJpJj9HxINZ/Yqz5nPo5Ms2nhR4r.',
    apiToken: '0b414d8433124406be6500833f1672e5'
  }
];

config.database = {
  type: 'elasticsearch',
  host: 'localhost:9200',
  index: 'joram'
};

config.queries = {
  match: {
    name: 'Standard Search',
    query: {
      multi_match: {
        query: undefined,
        fields: ['body', 'body.folded'],
        type: 'phrase'
      }
    },
    setQuery: function (query) {
      this.query.multi_match.query = query;
    }
  },
  custom: {
    name: 'Custom Search',
    query: {
      simple_query_string: {
        query: undefined,
        fields: ['body','body.folded'],
        default_operator: 'and',
        analyze_wildcard: true
      }
    },
    setQuery: function (query) {
      this.query.simple_query_string.query = query;
    }
  },
  fuzzy: {
    name: 'Fuzzy Search',
    query: {
      fuzzy: {
        body: undefined
      }
    },
    setQuery: function (query) {
      this.query.fuzzy.body = query;
    }
  },
  regexp: {
    name: 'Regex Search',
    query: {
      regexp: {
        body: undefined
      }
    },
    setQuery: function (query) {
      this.query.regexp.body = query;
    }
  }
};

config._source = {
  excludes: ['body*']
};

config.highlight = {
  fields: {
    body: {}
    //'body.folded': {}
  }
};

module.exports = config;
