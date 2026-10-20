import express from 'express';
import {
  getMessages,
  sendMessage,
  reactToMessage,
  pinMessage,
  deleteMessage,
  markMessagesAsRead,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:conversationId', getMessages);
router.post('/', sendMessage);
router.post('/:id/react', reactToMessage);
router.put('/:id/pin', pinMessage);
router.delete('/:id', deleteMessage);
router.put('/read/:conversationId', markMessagesAsRead);

export default router;
