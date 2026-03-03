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

// define Track model on the sequelize instance so it can be reused elsewhere
const { DataTypes } = require('sequelize');
const Track = sequelize.define('Track', {
  trackId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  songTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  albumName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: DataTypes.INTEGER, // seconds
  releaseYear: DataTypes.INTEGER,
});

// when run directly (`node database/setup.js`), perform a full
// initialization sequence: authenticate, sync (creating tables), then close.
// this ensures the file exists and the schema is in place without leaving
// an open connection.
if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection established to database:', envConfig.storage || envConfig.url);

      // sync will create tables based on defined models
      await sequelize.sync();
      console.log('Database synchronized (tables created if needed)');
    } catch (err) {
      console.error('Database initialization failed:', err);
      process.exit(1);
    } finally {
      await sequelize.close();
      console.log('Connection closed');
    }
  })();
}

module.exports = { sequelize, Track };
