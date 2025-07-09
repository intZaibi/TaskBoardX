let io;

function init(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  const notify = io.of('/notify');

  notify.on('connection', socket => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} connected to /notify`);
    }

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

module.exports = { init, getIO };
