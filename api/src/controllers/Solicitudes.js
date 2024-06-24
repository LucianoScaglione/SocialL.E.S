const { Solicitudes, Usuarios, Amigos } = require('../db');
const { Op } = require('sequelize');

// Crear la solicitud de amistad
const crearSolicitudDeAmistad = async (req, res, next) => {
  try {
    const { EmisorId, ReceptorId } = req.params;
    const emisor = await Usuarios.findByPk(EmisorId);
    const receptor = await Usuarios.findByPk(ReceptorId);
    if (!emisor || !receptor) {
      return res.status(404).send("No se encontró a uno o ambos usuarios");
    };
    if (EmisorId === ReceptorId) {
      return res.status(400).send("No puedes enviarte solicitud de amistad a vos mismo");
    };
    const buscarSolicitud = await Solicitudes.findOne({
      where: {
        [Op.or]: [
          { EmisorId: EmisorId, ReceptorId: ReceptorId },
          { EmisorId: ReceptorId, ReceptorId: EmisorId }
        ]
      }
    });
    if (buscarSolicitud) {
      return res.status(400).send("Ya existe una solicitud de amistad pendiente de respuesta");
    };
    await Solicitudes.create({
      EmisorId,
      ReceptorId
    });
    res.status(200).send("Se creó la solicitud de amistad");
  } catch (error) {
    next(error);
  };
};

// Recibir y responder la solicitud de amistad
const responderSolicitudDeAmistad = async (req, res, next) => {
  try {
    const { EmisorId, ReceptorId } = req.params;
    const { respuesta } = req.body;
    const emisor = await Usuarios.findByPk(EmisorId);
    const receptor = await Usuarios.findByPk(ReceptorId);
    if (!emisor || !receptor) {
      return res.status(404).send("No se encontró a uno o ambos usuarios");
    };
    const buscarSolicitud = await Solicitudes.findOne({
      where: {
        EmisorId,
        ReceptorId
      }
    });
    if (!buscarSolicitud) {
      res.status(400).send("No existe ninguna solicitud de amistad");
    };
    if (buscarSolicitud && buscarSolicitud.solicitud === "aceptada") {
      return res.status(400).send("No puedes modificar el estado de la solicitud porque ya fue aceptada");
    };
    if (respuesta === 'aceptada') {
      const fecha = new Date();
      const nombreEmisor = await Usuarios.findOne({ where: { id: EmisorId } });
      await buscarSolicitud.update({
        solicitud: respuesta,
        amigosdesde: fecha
      });
      // Creo la entrada en la tabla de Amistades para Luciano -> Ezequiel
      await Amigos.create({
        UsuarioId: EmisorId,
        AmigoId: ReceptorId
      });
      // Creo la entrada en la tabla de Amistades para Ezequiel -> Luciano
      await Amigos.create({
        UsuarioId: ReceptorId,
        AmigoId: EmisorId
      });
      res.status(200).json(`Ahora tú y ${nombreEmisor.nombre} ${nombreEmisor.apellido} son amigos`);
    } else {
      await buscarSolicitud.destroy();
      res.status(200).send("Se rechazó la solicitud de amistad.");
    };
  } catch (error) {
    next(error);
  };
};

// Listar solicitudes de un usuario
const listarSolicitudesDeAmistad = async (req, res, next) => {
  try {
    const { ReceptorId } = req.params;
    const buscarUsuario = await Usuarios.findByPk(ReceptorId);
    if (!buscarUsuario) {
      return res.status(400).send("No existe usuario registrado con ese id");
    };
    const listarSolicitudes = await Solicitudes.findAll({
      where: {
        ReceptorId: ReceptorId,
        solicitud: "pendiente"
      },
      include: [{
        model: Usuarios,
        as: 'Emisor',
        attributes: ['id', 'nombre', 'apellido', 'fotoDePerfil']
      }]
    });
    if (!listarSolicitudes.length) {
      res.status(400).send("No tienes solicitudes de amistad pendientes");
    };
    res.status(200).json(listarSolicitudes);
  } catch (error) {
    next(error);
  };
};

module.exports = {
  crearSolicitudDeAmistad,
  responderSolicitudDeAmistad,
  listarSolicitudesDeAmistad
}