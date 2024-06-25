const express = require('express');
const router = express.Router();
const ControllersComentarios = require('../controllers/Comentarios.js');

router.get('/:PublicacionId', ControllersComentarios.obtenerComentariosPublicacion);
router.post('/crear', ControllersComentarios.crearComentario);
router.put('/editar/:id', ControllersComentarios.editarComentario);
router.delete('/eliminar/:id/:PublicacionId/:UsuarioId', ControllersComentarios.eliminarComentario);

module.exports = router;