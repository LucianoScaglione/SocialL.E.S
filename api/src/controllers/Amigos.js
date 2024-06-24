const { Op } = require('sequelize');
const { Usuarios, Solicitudes, Amigos } = require('../db');

const listarAmigos = async (req, res, next) => {
  try {
    const { UsuarioId } = req.params;
    if (!UsuarioId) {
      return res.status(400).send("Debes enviar el id del usuario que quiere consultar su lista de amigos")
    }
    const buscarAmigos = await Amigos.findAll({
      where: {
        UsuarioId
      },
      include: [{
        model: Usuarios,
        as: 'Amigo',
        attributes: ['id', 'nombre', 'apellido', 'fotoDePerfil']
      }]
    });
    if (!buscarAmigos.length) {
      return res.status(400).send("No tienes amigos agregados");
    };
    res.status(200).json(buscarAmigos);
  } catch (error) {
    next(error);
  };
};

const eliminarAmigo = async (req, res, next) => {
  try {
    const { EmisorId, ReceptorId } = req.params;
    if (!EmisorId || !ReceptorId) {
      return res.status(400).send("Faltan parámetros requeridos");
    }
    const emisor = await Usuarios.findByPk(EmisorId);
    const receptor = await Usuarios.findByPk(ReceptorId);
    if (!emisor || !receptor) {
      return res.status(404).send("No se encontró a uno o ambos usuarios");
    };
    const buscarSolicitud = await Solicitudes.findOne({
      where: {
        [Op.or]: [
          { EmisorId: EmisorId, ReceptorId: ReceptorId },
          { EmisorId: ReceptorId, ReceptorId: EmisorId }
        ],
        solicitud: 'aceptada'
      }
    });
    if (!buscarSolicitud) {
      return res.status(400).send("No se encontró ninguna amistad creada con ese id de usuario");
    };
    const buscarRelacionAmigoEmisor = await Amigos.findOne({ where: { UsuarioId: EmisorId, AmigoId: ReceptorId } });
    const buscarRelacionAmigoReceptor = await Amigos.findOne({ where: { UsuarioId: ReceptorId, AmigoId: EmisorId } });
    if (!buscarRelacionAmigoEmisor || !buscarRelacionAmigoReceptor) {
      return res.status(400).send("No se encontró la relación de amistad en ambos sentidos");
    }
    if (buscarSolicitud.solicitud === 'pendiente') {
      return res.status(400).send("No se puede eliminar a un usuario que todavía no aceptó tu solicitud de amistad");
    };
    await buscarSolicitud.destroy();
    await buscarRelacionAmigoEmisor.destroy();
    await buscarRelacionAmigoReceptor.destroy();
    res.status(200).json(`Eliminaste a ${receptor.nombre} ${receptor.apellido} de tus amigos`);
  } catch (error) {
    next(error);
  };
};

module.exports = {
  listarAmigos,
  eliminarAmigo
}