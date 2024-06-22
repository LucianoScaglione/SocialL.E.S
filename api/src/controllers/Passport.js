const { Usuarios } = require('../db');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/google/callback",
  passReqToCallback: true
},
  async (request, accessToken, refreshToken, profile, done) => {
    // Este callback se llamará después de la autenticación exitosa
    // `profile` contiene la información del usuario obtenida desde Google
    const buscarUsuario = await Usuarios.findOne({ where: { correo: profile.email } });
    if (!buscarUsuario) {
      const crearUsuario = await Usuarios.create({
        nombre: profile.given_name,
        apellido: profile.family_name,
        correo: profile.email,
        fotoDePerfil: profile.picture,
        token: accessToken
      });
      return done(null, { usuario: crearUsuario, token: accessToken });
    } else {
      buscarUsuario.token = accessToken;
      return done(null, { usuario: buscarUsuario, token: accessToken });
    };
  }
));

passport.serializeUser((user, done) => { done(null, user) });

passport.deserializeUser((user, done) => { done(null, user) })