const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
require('../src/controllers/Passport.js')
require('./db.js');

const { Server } = require('socket.io');
const { createServer } = require('node:http');
const server = express();
const httpServer = createServer(server);
const io = new Server(httpServer)

const AuthGoogle = require('./routes/AuthGoogle.js');
const Usuarios = require('./routes/Usuarios.js');
const Publicaciones = require('./routes/Publicaciones.js');
const Solicitudes = require('./routes/Solicitudes.js');
const Amigos = require('./routes/Amigos.js');
const Comentarios = require('./routes/Comentarios.js');
const socket = require('./routes/socket.js');
const { crearMensaje, listarMensajesEnChat } = require('./controllers/Mensajes.js');

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
server.use('/socket', socket)

/*
io: Se refiere a la instancia del servidor de Socket.IO. Se utiliza para emitir eventos a todos los clientes conectados o para manejar eventos de conexión y desconexión a nivel global.

socket: Se refiere a la instancia de un cliente específico. Se utiliza para emitir eventos a ese cliente en particular o para manejar eventos que ese cliente específico ha enviado.

El método 'emit' se utiliza para enviar mensajes o eventos desde el servidor al cliente, o viceversa. Puedes usarlo para enviar datos junto con el evento.

El método 'on' se utiliza para escuchar eventos. Cuando el evento especificado ocurre, se ejecuta la función callback asociada.

*/

io.on('connection', async (socket) => {
  console.log("Usuario conectado");
  socket.on('disconnect', () => {
    console.log("Usuario desconectado del namespace /socket");
  });

  const EmisorId = socket.handshake.auth.EmisorId;
  const ReceptorId = socket.handshake.auth.ReceptorId;


  let mensajes = await listarMensajesEnChat(EmisorId, ReceptorId)
  socket.emit('mostrar mensajes', mensajes);


  socket.on('crear mensaje', async (mensaje) => {
    const resultado = await crearMensaje(EmisorId, ReceptorId, mensaje);
    if (resultado === 'Mensaje creado correctamente') {
      const mensajesActualizados = await listarMensajesEnChat(EmisorId, ReceptorId);
      io.emit('mostrar mensajes', mensajesActualizados);
    };
  });
});

module.exports = httpServer;