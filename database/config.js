// central configuration object for database settings
// reads values from environment variables (via dotenv) and
// exposes separate sections for development and production.

require('dotenv').config();

const development = {
  dialect: process.env.DEV_DB_DIALECT || 'sqlite',
  storage: process.env.DEV_DB_STORAGE || './database/music_library.db',
  // you can also supply a URL string if you prefer:
  url: process.env.DEV_DATABASE_URL
};

const production = {
  dialect: process.env.PROD_DB_DIALECT || 'sqlite',
  storage: process.env.PROD_DB_STORAGE || './database/music_library.db',
  url: process.env.PROD_DATABASE_URL
};

module.exports = {
  development,
  production
};
