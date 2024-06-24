const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Amigos', {

  }, { timestamps: false });
};