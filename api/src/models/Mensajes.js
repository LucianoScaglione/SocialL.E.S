const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Mensajes', {
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, { timestamps: true });
};