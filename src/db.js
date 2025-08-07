require('dotenv').config();
const { Sequelize } = require('sequelize');
const { initializeModels } = require('./models');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '-03:00',
  }
);

const models = initializeModels(sequelize);

module.exports = {
  sequelize,
  ...models,
};
