const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('cursor-move', (data) => {
    socket.broadcast.emit('cursor-update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

http.listen(3001, () => {
  console.log('Socket.io server running on port 3001');
}); 