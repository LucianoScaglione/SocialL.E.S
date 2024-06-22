//'/auth/google'
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta de inicio de sesión con Google
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback de Google para redireccionar después de la autenticación
router.get('/callback',
  passport.authenticate('google', {
    //Autenticación exitosa
    successRedirect: '/usuarios',
    //Autenticación fallida
    failureRedirect: '/auth/google'
  }));

module.exports = router;