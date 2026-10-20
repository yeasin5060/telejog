import User from '../models/User.js';

export const setupSocket = (io) => {
  // Store connected user sockets: userId -> Set of socket.ids
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // User authentication / identification
    socket.on('setup', async (userData) => {
      if (!userData || !userData._id) return;
      const userId = userData._id.toString();

      socket.userId = userId;
      socket.join(`user_${userId}`);

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      // Update in DB
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: 'Online',
        });
      } catch (err) {
        console.error('Error updating user online status:', err.message);
      }

      // Broadcast user online status
      socket.broadcast.emit('user_status_changed', {
        userId,
        isOnline: true,
        lastSeen: 'Online',
      });

      socket.emit('connected', { onlineUserIds: Array.from(onlineUsers.keys()) });
      console.log(`👤 User joined socket room: ${userId}`);
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv_${conversationId}`);
      console.log(`💬 Socket ${socket.id} joined conversation: ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conv_${conversationId}`);
      console.log(`🚪 Socket ${socket.id} left conversation: ${conversationId}`);
    });

    // Send real-time message
    socket.on('send_message', (messageData) => {
      if (!messageData || !messageData.conversationId) return;

      // Broadcast to all participants in conversation room
      socket.to(`conv_${messageData.conversationId}`).emit('new_message', messageData);

      // If receiver specified, send directly to receiver's user room
      if (messageData.receiver) {
        socket.to(`user_${messageData.receiver}`).emit('new_message', messageData);
      }
    });

    // Typing indicators
    socket.on('typing_start', ({ conversationId, userId, userName }) => {
      socket.to(`conv_${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        userName,
        isTyping: true,
      });
    });

    socket.on('typing_stop', ({ conversationId, userId }) => {
      socket.to(`conv_${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        isTyping: false,
      });
    });

    // Reaction updates
    socket.on('reaction_updated', (data) => {
      if (data?.conversationId) {
        socket.to(`conv_${data.conversationId}`).emit('reaction_updated', data);
      }
    });

    // New story added
    socket.on('new_story', (storyData) => {
      socket.broadcast.emit('new_story_published', storyData);
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
      const userId = socket.userId;

      if (userId && onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(userId);

          const lastSeenTime = 'Just now';
          try {
            await User.findByIdAndUpdate(userId, {
              isOnline: false,
              lastSeen: lastSeenTime,
            });
          } catch (err) {
            console.error('Error updating user offline status:', err.message);
          }

          socket.broadcast.emit('user_status_changed', {
            userId,
            isOnline: false,
            lastSeen: lastSeenTime,
          });
        }
      }
    });
  });
};
