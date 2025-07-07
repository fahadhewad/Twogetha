const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: '*' })); // <-- Add this line

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
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