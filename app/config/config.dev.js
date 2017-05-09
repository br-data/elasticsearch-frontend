const config = {};

config.page = {
  'title': 'Kuckucksnest Search',
  'description': 'Search the Kuckucksnest documents for persons, companies and addresses'
};

config.elastic = {
  'host': 'localhost:9200',
  'index': 'kuckucksnest'
};

config.users = [
  { 'id': 1, 'username': 'user', 'password': 'password', 'displayName': 'Demo User' }
];

module.exports = config;
