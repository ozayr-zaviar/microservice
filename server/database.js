const Sequelize = require('sequelize');

const sequelize = new Sequelize('thesis', 'anyroad', 'uzair121212', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;