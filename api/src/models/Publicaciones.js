const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Publicaciones', {
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fotos: {
      type: DataTypes.ARRAY(DataTypes.JSONB)
    },
    editado: {
      type: DataTypes.STRING
    },
    creado: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, { timestamps: false });
};