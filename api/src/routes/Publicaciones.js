const express = require('express');
const router = express.Router();
const ControllersPublicaciones = require('../controllers/Publicaciones.js');

router.get('/', ControllersPublicaciones.obtenerPublicaciones);
router.get('/:id', ControllersPublicaciones.obtenerPublicacion);
router.post('/crear', ControllersPublicaciones.subirArchivos, ControllersPublicaciones.crearPublicaciones);
router.put('/editar/:id', ControllersPublicaciones.editarPublicacion);
router.delete('/eliminar/:id', ControllersPublicaciones.eliminarPublicacion);

module.exports = router;