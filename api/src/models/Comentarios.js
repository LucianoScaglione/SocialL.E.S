const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Comentarios', {
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
}; 