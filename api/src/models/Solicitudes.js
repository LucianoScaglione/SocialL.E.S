const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Solicitudes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    solicitud: {
      type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'),
      defaultValue: 'pendiente'
    },
    amigosdesde: {
      type: DataTypes.DATE,
    }
  }, { timestamps: false });
};