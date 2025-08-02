const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const setupSocket = (io) => {
  // Store online users
  const onlineUsers = new Map();

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    // Add user to online users
    onlineUsers.set(socket.userId.toString(), {
      userId: socket.userId,
      name: socket.user.name,
      socketId: socket.id
    });

    // Update user's online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date()
    });

    // Emit online status to all users
    io.emit('user_online', {
      userId: socket.userId,
      name: socket.user.name
    });

    // Join user to their personal room
    socket.join(socket.userId.toString());

    // Handle private messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, messageType = 'text' } = data;

        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          content,
          messageType
        });

        await message.save();
        await message.populate('sender', 'name email avatar');
        await message.populate('receiver', 'name email avatar');

        // Send to receiver if online
        const receiverSocket = onlineUsers.get(receiverId.toString());
        if (receiverSocket) {
          io.to(receiverSocket.socketId).emit('new_message', message);
        }

        // Send back to sender
        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message_error', { message: 'Failed to send message' });
      }
    });

    // Handle typing events
    socket.on('typing_start', (data) => {
      const { receiverId } = data;
      const receiverSocket = onlineUsers.get(receiverId.toString());
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('user_typing', {
          userId: socket.userId,
          name: socket.user.name
        });
      }
    });

    socket.on('typing_stop', (data) => {
      const { receiverId } = data;
      const receiverSocket = onlineUsers.get(receiverId.toString());
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('user_stopped_typing', {
          userId: socket.userId
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.name}`);

      // Remove from online users
      onlineUsers.delete(socket.userId.toString());

      // Update user's offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Emit offline status to all users
      io.emit('user_offline', {
        userId: socket.userId,
        name: socket.user.name
      });
    });
  });
};

module.exports = setupSocket; 