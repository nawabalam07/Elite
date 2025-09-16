// server.js
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('join', ({ username, room }) => {
    socket.data.username = username || 'Guest';
    socket.join(room);
    socket.data.room = room;

    socket.emit('system', { text: `Welcome ${username} 👋`, ts: Date.now() });
    socket.to(room).emit('system', { text: `${username} joined the room 🚀`, ts: Date.now() });
  });

  socket.on('message', ({ text }) => {
    const msg = {
      user: socket.data.username,
      text: text.trim(),
      ts: Date.now()
    };
    io.to(socket.data.room).emit('message', msg);
  });

  socket.on('disconnect', () => {
    if (socket.data.username && socket.data.room) {
      socket.to(socket.data.room).emit('system', {
        text: `${socket.data.username} left the room ❌`,
        ts: Date.now()
      });
    }
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
