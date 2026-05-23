import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import app from './src/app.js';

dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow any origin for development, restrict in production
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

let activeChats = [];

io.on('connection', (socket) => {
  // User connects and sends initial info
  socket.on('join_user', (user) => {
    // Prevent duplicate entries
    const existing = activeChats.find((u) => u._id === user._id);
    if (!existing) {
      activeChats.push({ ...user, socketId: socket.id });
    } else {
      existing.socketId = socket.id; // Update socket id if they reconnected
    }
    // Notify admin
    io.to('admin').emit('update_active_chats', activeChats);
  });

  socket.on('join_admin', () => {
    socket.join('admin');
    // Immediately send active chats to admin
    io.to('admin').emit('update_active_chats', activeChats);
  });

  // User sends message -> Admin
  socket.on('user_message', (msg) => {
    // Send to admin room, include the sender's socket ID so admin knows who to reply to
    io.to('admin').emit('message', { socketId: socket.id, msg });
  });

  // Admin replies -> Specific User
  socket.on('admin_message', ({ socketId, msg }) => {
    io.to(socketId).emit('message', msg);
  });

  socket.on('disconnect', () => {
    // Remove user from activeChats if they disconnect
    const userIndex = activeChats.findIndex((u) => u.socketId === socket.id);
    if (userIndex !== -1) {
      activeChats.splice(userIndex, 1);
      io.to('admin').emit('update_active_chats', activeChats);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
