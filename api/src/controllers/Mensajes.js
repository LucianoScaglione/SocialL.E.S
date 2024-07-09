const { Op } = require('sequelize');
const { Mensajes, Usuarios } = require('../db');

const listarMensajesEnChat = async (EmisorId, ReceptorId) => {
  try {
    const buscarEmisor = await Usuarios.findByPk(EmisorId);
    const buscarReceptor = await Usuarios.findByPk(ReceptorId);
    if (!buscarEmisor && buscarReceptor) {
      return 'No se encontró a uno de los usuarios';
    };
    const buscarMensajes = await Mensajes.findAll({
      where: {
        [Op.or]: [
          { EmisorId: EmisorId, ReceptorId: ReceptorId },
          { EmisorId: ReceptorId, ReceptorId: EmisorId }
        ]
      },
      include: Usuarios
    }
    );
    return buscarMensajes.length ? buscarMensajes : 'No se encontraron mensajes registrados';
  } catch (error) {
    console.log(error);
  };
};

const crearMensaje = async (EmisorId, ReceptorId, mensaje) => {
  try {
    if (!(EmisorId && ReceptorId && mensaje)) {
      return 'Error por falta de información requerida';
    };
    const usuarioEmisor = await Usuarios.findByPk(EmisorId);
    const usuarioReceptor = await Usuarios.findByPk(ReceptorId);
    if (!usuarioEmisor && usuarioReceptor) {
      return 'No se encontró a uno de los usuarios';
    };
    await Mensajes.create({
      mensaje: mensaje,
      EmisorId: EmisorId,
      ReceptorId: ReceptorId
    });
    return 'Mensaje creado correctamente';
  } catch (error) {
    console.log(error);
  };
};

module.exports = {
  listarMensajesEnChat,
  crearMensaje
}