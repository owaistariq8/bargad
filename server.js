"use strict";
require('dotenv').config();

(async () => {
  
  require('./db')();

  const { app, server, io } = require('./services/server');
 
  const socketio = require('./websocket/socketio');
  const crons = require('./crons/index');

  try{

    socketio.init(io);
    require('./routes/init')(app);
    crons.init(io);
  }catch(e) {
    console.log('Server.js Exception',e);
  }


  const PORT = process.argv[2] || process.env.PORT || 3000;

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
