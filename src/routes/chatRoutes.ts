import { Router, Request, Response } from 'express';
import { ChatController } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';
import { updateImageInRedis, uploadToRedis } from '../middleware/redisStorage';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

const router = Router();
const chatController = new ChatController();

router.get('/messages', authMiddleware, chatController.getMessages);
router.get('/messages/room/:id', authMiddleware, chatController.getPrivateMessages);
router.post('/messages', authMiddleware, uploadToRedis, chatController.sendMessage);
router.post('/messages/room/:id', authMiddleware, uploadToRedis, chatController.sendMessage);
router.get('/images/:id', chatController.getImage);
router.put('/images/:id', authMiddleware, updateImageInRedis);
router.get('/images/ttl/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const ttl = await redisClient.ttl(id);
        if (ttl === -2) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.status(200).json(ttl);
    } catch (error) {
        console.error('Error fetching TTL:', error);
        res.status(500).json({ message: 'Error fetching TTL' });
    }
});

router.post('/private-room', authMiddleware, chatController.createPrivateRoom);

export default router;