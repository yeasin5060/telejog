import express from 'express';
import {
  getDeviceSessions,
  terminateSession,
  terminateAllOtherSessions,
} from '../controllers/deviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getDeviceSessions);
router.delete('/other/all', terminateAllOtherSessions);
router.delete('/:id', terminateSession);

export default router;
