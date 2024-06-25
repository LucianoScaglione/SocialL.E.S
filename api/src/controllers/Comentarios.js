const { Comentarios, Publicaciones, Usuarios } = require('../db');

const obtenerComentariosPublicacion = async (req, res, next) => {
  try {
    const { PublicacionId } = req.params;
    const buscarPublicacion = await Publicaciones.findByPk(PublicacionId);
    if (!buscarPublicacion) {
      return res.status(404).send("La publicación que buscas no existe");
    };
    const buscarComentarios = await Comentarios.findAll({ where: { PublicacionId }, include: Usuarios });
    if (!buscarComentarios.length) {
      return res.status(404).send("No existen comentarios registrados");
    };
    res.status(200).json(buscarComentarios);
  } catch (error) {
    next(error);
  };
};

const crearComentario = async (req, res, next) => {
  try {
    const { PublicacionId, UsuarioId, comentario } = req.body;
    if (!(PublicacionId || UsuarioId || comentario)) {
      return res.status(400).send("Debes enviar toda la información requerida para crear un comentario");
    };
    const buscarPublicacion = await Publicaciones.findByPk(PublicacionId);
    const buscarUsuario = await Usuarios.findByPk(UsuarioId);
    if (!buscarPublicacion) {
      return res.status(400).send("La publicación que buscas no existe");
    };
    if (!buscarUsuario) {
      return res.status(400).send("El usuario que ingresaste no se encuentra registrado");
    };
    const crearComentario = await Comentarios.create({
      comentario,
      UsuarioId,
      PublicacionId
    });
    res.status(201).send(crearComentario);
  } catch (error) {
    next(error);
  };
};

const editarComentario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comentario } = req.body;
    const buscarComentario = await Comentarios.findOne({ where: { id } });
    if (!buscarComentario) {
      return res.status(404).send("No existe el comentario que buscas");
    };
    if (buscarComentario.comentario === comentario) {
      return res.status(400).send("Debes cambiar el contenido del comentario para poder editarlo");
    };
    const comentarioEditado = await buscarComentario.update({ comentario });
    res.status(200).json(comentarioEditado);
  } catch (error) {
    next(error);
  };
};

const eliminarComentario = async (req, res, next) => {
  try {
    const { id, PublicacionId, UsuarioId } = req.params;
    const buscarComentario = await Comentarios.findByPk(id);
    if (!buscarComentario) {
      return res.status(404).send("El comentario que quieres eliminar no existe");
    };
    const usuario = await Usuarios.findByPk(UsuarioId);
    if (!usuario) {
      return res.status(400).send("No se encontró el usuario dueño del comentario");
    };
    const dueñoPublicacion = await Publicaciones.findOne({ where: { id: PublicacionId }, include: Usuarios });
    if (!dueñoPublicacion) {
      return res.status(400).send("No se encontró el usuario dueño de la publicación");
    };
    const idDueño = dueñoPublicacion.Usuarios.map(usuario => usuario.id);
    if (UsuarioId === idDueño || buscarComentario.UsuarioId === UsuarioId) {
      await buscarComentario.destroy({ where: { id } });
      usuario.id === idDueño ? res.status(200).json(`Eliminaste el comentario de ${usuario.nombre} ${usuario.apellido}`) : res.status(200).send("Eliminaste tu comentario");
    } else {
      return res.status(400).send("No puedes eliminar un comentario que no sea creado por ti");
    };
  } catch (error) {
    next(error);
  };
};

module.exports = {
  obtenerComentariosPublicacion,
  crearComentario,
  editarComentario,
  eliminarComentario
};