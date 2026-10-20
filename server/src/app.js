import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Import Middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.resolve('uploads')));

// Root Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'Telejog Messenger API',
    version: '1.0.0',
    documentation: {
      auth: '/api/auth',
      users: '/api/users',
      conversations: '/api/conversations',
      messages: '/api/messages',
      stories: '/api/stories',
      devices: '/api/devices',
      upload: '/api/upload',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
