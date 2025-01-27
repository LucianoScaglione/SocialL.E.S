require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false,
  native: false,
});
const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach(model => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { Usuarios, Publicaciones, Solicitudes, Amigos, Comentarios, Mensajes } = sequelize.models;

Usuarios.hasMany(Publicaciones);
Publicaciones.belongsTo(Usuarios);

// Asociación de Emisor
Usuarios.hasMany(Solicitudes, { foreignKey: 'EmisorId', as: 'SolicitudesEnviadas' });
Solicitudes.belongsTo(Usuarios, { foreignKey: 'EmisorId', as: 'Emisor' });

// Asociación de Receptor
Usuarios.hasMany(Solicitudes, { foreignKey: 'ReceptorId', as: 'SolicitudesRecibidas' });
Solicitudes.belongsTo(Usuarios, { foreignKey: 'ReceptorId', as: 'Receptor' });

// Relación bidireccional
Amigos.belongsTo(Usuarios, { foreignKey: 'UsuarioId', as: 'Usuario' });
Amigos.belongsTo(Usuarios, { foreignKey: 'AmigoId', as: 'Amigo' });

Usuarios.hasMany(Comentarios, { foreignKey: 'UsuarioId' });
Comentarios.belongsTo(Usuarios, { foreignKey: 'UsuarioId' });

Publicaciones.hasMany(Comentarios, { foreignKey: 'PublicacionId' });
Comentarios.belongsTo(Publicaciones, { foreignKey: 'PublicacionId' });

Usuarios.hasMany(Mensajes, { foreignKey: 'EmisorId' });
Mensajes.belongsTo(Usuarios, { foreignKey: 'EmisorId' });

Usuarios.hasMany(Mensajes, { foreignKey: 'ReceptorId' });
Mensajes.belongsTo(Usuarios, { foreignKey: 'ReceptorId' });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};