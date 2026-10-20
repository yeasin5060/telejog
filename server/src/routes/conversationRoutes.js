import express from 'express';
import {
  getConversations,
  getConversationById,
  getOrCreateDirectConversation,
  createGroupOrChannel,
  togglePinConversation,
  toggleMuteConversation,
} from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getConversations);
router.get('/:id', getConversationById);
router.post('/direct', getOrCreateDirectConversation);
router.post('/group', createGroupOrChannel);
router.put('/:id/pin', togglePinConversation);
router.put('/:id/mute', toggleMuteConversation);

export default router;
