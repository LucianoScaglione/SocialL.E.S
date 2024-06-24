const express = require('express');
const router = express.Router();
const ControllersAmigos = require('../controllers/Amigos.js');

router.get('/:UsuarioId', ControllersAmigos.listarAmigos);
router.delete('/eliminar/:EmisorId/:ReceptorId', ControllersAmigos.eliminarAmigo);

module.exports = router;