import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { setupSocket } from './socket/socketHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

setupSocket(io);

// Make io accessible in request if needed
app.set('io', io);

server.listen(PORT, () => {
  console.log(`🚀 Telejog Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO initialized for real-time messaging`);
});
