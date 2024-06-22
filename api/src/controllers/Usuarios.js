const { Usuarios } = require('../db');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const obtenerUsuarios = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (nombre) {
      const buscarUsuarios = await Usuarios.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.iLike]: `%${nombre}%` } },
            { apellido: { [Op.iLike]: `%${nombre}%` } }
          ]
        }
      });
      buscarUsuarios.length ? res.status(200).json(buscarUsuarios) : res.status(400).send("No existen usuarios registrados con ese nombre");
    };
    const buscarUsuarios = await Usuarios.findAll();
    buscarUsuarios.length ? res.status(200).json(buscarUsuarios) : res.status(400).send("No existen registros de usuarios");
  } catch (error) {
    next(error);
  };
};

const obtenerUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const buscarUsuarioPorId = await Usuarios.findOne({ where: { id } });
    buscarUsuarioPorId ? res.status(200).json(buscarUsuarioPorId) : res.status(400).send("No existe usuario registrado con ese id");
  } catch (error) {
    next(error);
  };
};

const crearUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, correo, fotoDePerfil, contraseña, fechaDeNacimiento, genero } = req.body;
    if (!(nombre && apellido && correo && contraseña && fechaDeNacimiento && genero)) {
      res.status(400).send("Debes llenar los campos requeridos");
    };
    const buscarUsuarioRegistrado = await Usuarios.findOne({ where: { correo } });
    if (!buscarUsuarioRegistrado) {
      const encriptarContraseña = await bcrypt.hash(contraseña, 10);
      const usuario = await Usuarios.create({
        nombre,
        apellido,
        correo: correo.toLowerCase(),
        fotoDePerfil,
        contraseña: encriptarContraseña,
        fechaDeNacimiento,
        genero
      });
      const token = jwt.sign({ user_id: usuario.id, correo }, "secret", { expiresIn: "10h" });
      usuario.token = token;
      res.status(201).json({ "usuario": usuario, "token": token });
    } else {
      res.status(400).send("Ya existe un usuario registrado con ese correo, intente con otro");
    };
  } catch (error) {
    next(error);
  };
};

const accesoUsuario = async (req, res, next) => {
  try {
    const { correo, contraseña } = req.body;
    if (!correo && !contraseña) {
      res.status(400).send("Se requiere rellenar los campos: email y password");
    };
    const usuario = await Usuarios.findOne({ where: { correo } });
    if (usuario && (await bcrypt.compare(contraseña, usuario.contraseña))) {
      const token = jwt.sign({ user_id: usuario.id, correo }, "secret", { expiresIn: "10h" });
      usuario.token = token;
      res.status(201).json({ "usuario": usuario, "token": token });
    } else {
      res.status(400).send("Usuario incorrecto");
    };
  } catch (error) {
    next(error);
  };
};

const actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, fotoDePerfil, nuevaContraseña, fechaDeNacimiento, genero } = req.body;
    const buscarUsuario = await Usuarios.findOne({ where: { id } });
    if (!buscarUsuario) {
      res.status(400).send("No existe usuario registrado con ese id");
    };
    let contraseñaEncriptada = buscarUsuario.contraseña;
    if (nuevaContraseña) {
      contraseñaEncriptada = await bcrypt.hash(nuevaContraseña, 10);
      if (await bcrypt.compare(nuevaContraseña, buscarUsuario.contraseña))
        res.status(400).send("Debes ingresar una contraseña distinta a la anterior");
    };
    const editarUsuario = await buscarUsuario.update({
      nombre,
      apellido,
      correo,
      fotoDePerfil,
      contraseña: nuevaContraseña ? contraseñaEncriptada : buscarUsuario.contraseña,
      fechaDeNacimiento,
      genero
    });
    res.status(200).json(editarUsuario);
  } catch (error) {
    next(error);
  };
};

const eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const buscarUsuario = await Usuarios.findOne({ where: { id } });
    if (buscarUsuario) {
      await Usuarios.destroy({ where: { id } });
      res.status(200).send("Usuario eliminado");
    } else {
      res.status(400).send("No existe usuario registrado con ese id");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  accesoUsuario,
  actualizarUsuario,
  eliminarUsuario
};