const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

const socketioOptions = {
  transports: ['websocket'],
};

const io = socketio(server, socketioOptions);


module.exports = {
  app,
  server,
  io,
};