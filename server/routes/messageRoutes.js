const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead, getUnreadCount } = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');

// All routes are protected
router.use(auth);

// Send a message
router.post('/', sendMessage);

// Get messages with a specific user
router.get('/:userId', getMessages);

// Mark a message as read
router.put('/:messageId/read', markAsRead);

// Get unread message count
router.get('/unread/count', getUnreadCount);

module.exports = router; 