const env = process.env.NODE_ENV || 'development';
const config = require(`./config.${env}`);

module.exports = config;
