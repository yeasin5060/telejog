import express from 'express';
import {
  searchUsers,
  getAllUsers,
  getUserById,
  updateStatus,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/search', searchUsers);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/status', updateStatus);

export default router;
