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

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Example of handling admin join
  socket.on('join_admin', () => {
    socket.join('admin');
    console.log(`Socket ${socket.id} joined admin room`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
