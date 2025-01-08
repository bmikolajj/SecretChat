import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';
import { updateImageInRedis, uploadToRedis } from '../middleware/redisStorage';

const router = Router();
const chatController = new ChatController();

router.get('/messages', authMiddleware, chatController.getMessages);
router.post('/messages', authMiddleware, uploadToRedis, chatController.sendMessage);
router.get('/images/:id', chatController.getImage);
router.put('/images/:id', authMiddleware, updateImageInRedis);

export default router;