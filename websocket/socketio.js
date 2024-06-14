let io;

function init(server) {
  io = server;

  // Run when client connects
  io.on('connection', (socket) => {
    try{
      console.log('Socket Connected')      
      
    }catch(e) {
      console.log("SocketIo Exception",e)
    }

    socket.on('ping', (data) => {
      socket.emit('pong',{});
    });

    socket.on('error', (error) => {
      console.log('error event listener');
      console.log(error);
    });

  });
  return io;
}

function server() {
  return io;
}

async function getRoomClients(room, namespace = '/') {
  // return await io.of(namespace).in(room).allSockets(); // v3.x
  return await io.of(namespace).in(room).fetchSockets(); // v4.x
}

async function leaveRoomUsers(room) {
  io.of('/').socketsLeave(room); // v4.x
}


module.exports = {
  init,
  server,
  getRoomClients,
  leaveRoomUsers,
};