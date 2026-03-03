// setup.js - initialize sequelize instance based on environment
const { Sequelize } = require('sequelize');
const config = require('./config');

// load variables from .env (works even if already loaded by other modules)
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];

let sequelize;

if (envConfig.url) {
  sequelize = new Sequelize(envConfig.url, {
    dialect: envConfig.dialect,
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: envConfig.dialect,
    storage: envConfig.storage,
    logging: false,
  });
}

// when run directly (`node database/setup.js`), try authenticating and
// report the status.  this also ensures the SQLite file is created.
if (require.main === module) {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection established to database:', envConfig.storage || envConfig.url);
    })
    .catch(err => {
      console.error('Unable to connect to database:', err);
      process.exit(1);
    });
}

module.exports = sequelize;
