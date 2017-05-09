const env = process.env.NODE_ENV || 'dev';
const config = require('./config.' + env);

module.exports = config;
