const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
require('../src/controllers/Passport.js')
require('./db.js');

const server = express();

const AuthGoogle = require('./routes/AuthGoogle.js');
const Usuarios = require('./routes/Usuarios.js');
const Publicaciones = require('./routes/Publicaciones.js');
const Solicitudes = require('./routes/Solicitudes.js');
const Amigos = require('./routes/Amigos.js');
const Comentarios = require('./routes/Comentarios.js');

server.name = 'API';
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use('/uploads', express.static('uploads'));

// Configurar express-session
server.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
server.use(passport.initialize());
server.use(passport.session());

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173' /*'http://127.0.0.1:5173'*/);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

server.use('/auth/google', AuthGoogle);
server.use('/usuarios', Usuarios);
server.use('/publicaciones', Publicaciones);
server.use('/solicitudes', Solicitudes)
server.use('/amigos', Amigos)
server.use('/comentarios', Comentarios);

module.exports = server;