const express = require('express');
const router = express.Router();
const ControllersSolicitudes = require('../controllers/Solicitudes.js');

router.post('/enviar/:EmisorId/:ReceptorId', ControllersSolicitudes.crearSolicitudDeAmistad);
router.put('/responder/:EmisorId/:ReceptorId', ControllersSolicitudes.responderSolicitudDeAmistad);
router.get('/listar/:ReceptorId', ControllersSolicitudes.listarSolicitudesDeAmistad);

module.exports = router;