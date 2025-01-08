import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const chatController = new ChatController();

router.get('/messages', authMiddleware, chatController.getMessages);
router.post('/messages', authMiddleware, chatController.sendMessage);

export default router;