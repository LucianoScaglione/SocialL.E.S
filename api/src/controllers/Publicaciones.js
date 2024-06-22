const { Publicaciones, Usuarios } = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname === '.jpg' || extname === '.png') {
      cb(null, true); // Aceptar el archivo
    } else {
      cb(new Error(`Sólo se permiten archivos image/jpeg y image/png`)); // Rechazar el archivo
    };
  }
});

const subirArchivos = upload.array('fotos', 10);

const crearPublicaciones = async (req, res, next) => {
  try {
    const { contenido, UsuarioId } = req.body;
    if (!(contenido && UsuarioId)) {
      res.status(400).send("Debes llenar los campos requeridos");
    }
    const buscarUsuario = await Usuarios.findOne({ where: { id: UsuarioId } });
    if (buscarUsuario) {
      let fotos = '';
      if (req.files) {
        fotos = req.files.map(file => ({
          url: file.path, // ruta del archivo
          filename: file.filename // Nombre del archivo guardado
        }));
      };
      let crearPublicacion = await Publicaciones.create({
        contenido,
        fotos,
        UsuarioId
      });
      res.status(200).send(crearPublicacion);
    } else {
      res.status(400).send("No existe usuario registrado con ese id");
    };
  } catch (error) {
    next(error);
  };
};

const obtenerPublicaciones = async (req, res, next) => {
  try {
    const publicaciones = await Publicaciones.findAll({ include: Usuarios });
    publicaciones.length ? res.status(200).json(publicaciones) : res.status(400).send("No existen publicaciones creadas");
  } catch (error) {
    next(error);
  };
};

const obtenerPublicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const publicacion = await Publicaciones.findOne({ where: { id }, include: Usuarios });
    publicacion ? res.status(200).json(publicacion) : res.status(400).send("No existen publicacion registrada con ese id");
  } catch (error) {
    next(error);
  };
};

const editarPublicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;
    const buscarPublicacion = await Publicaciones.findOne({ where: { id } });
    if (!buscarPublicacion) {
      res.status(400).send("No se encontró ninguna publicación con ese id");
    }
    if (contenido === buscarPublicacion.contenido) {
      res.status(400).send("La publicación debe tener un distinto contenido para poder editarla");
    } else {
      const editarPublicacion = await buscarPublicacion.update({
        contenido,
        editado: "editado"
      });
      res.status(200).send(editarPublicacion);
    };
  } catch (error) {
    next(error);
  };
};

const eliminarPublicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const buscarPublicacion = await Publicaciones.findOne({ where: { id } });
    if (buscarPublicacion) {
      await Publicaciones.destroy({ where: { id } });
      res.status(200).send("Eliminaste la publicación registrada");
    } else {
      res.status(400).send("No existe publicación registrada con ese id");
    };
  } catch (error) {
    next(error);
  };
};

module.exports = {
  subirArchivos,
  crearPublicaciones,
  obtenerPublicaciones,
  obtenerPublicacion,
  editarPublicacion,
  eliminarPublicacion
}