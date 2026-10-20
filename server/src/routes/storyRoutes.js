import express from 'express';
import {
  getStories,
  createStory,
  viewStory,
  deleteStory,
} from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getStories);
router.post('/', createStory);
router.put('/:id/view', viewStory);
router.delete('/:id', deleteStory);

export default router;
