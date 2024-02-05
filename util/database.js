const Sequelize = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USER_NAME ,process.env.DATABASE_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost'
  });

  module.exports = sequelize;

