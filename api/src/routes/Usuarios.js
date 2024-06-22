const express = require('express');
const router = express.Router();
const ControllersUsuarios = require('../controllers/Usuarios');

router.get('/', ControllersUsuarios.obtenerUsuarios);
router.get('/:id', ControllersUsuarios.obtenerUsuario);
router.post('/registrar', ControllersUsuarios.crearUsuario);
router.post('/acceder', ControllersUsuarios.accesoUsuario);
router.put('/editar/:id', ControllersUsuarios.actualizarUsuario);
router.delete('/eliminar/:id', ControllersUsuarios.eliminarUsuario);

module.exports = router;