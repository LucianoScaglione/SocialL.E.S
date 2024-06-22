const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Usuarios', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fotoDePerfil: {
      type: DataTypes.TEXT,
    },
    contraseña: {
      type: DataTypes.STRING
    },
    fechaDeNacimiento: {
      type: DataTypes.DATEONLY
    },
    genero: {
      type: DataTypes.STRING,
      defaultValue: 'No especificado'
    },
    fechaCreacion: {
      type: DataTypes.DATEONLY,
      defaultValue: Sequelize.NOW
    }
  }, { timestamps: false })
}