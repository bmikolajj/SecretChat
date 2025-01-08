import multer from 'multer';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const uploadToRedis = (req: Request, res: Response, next: NextFunction) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed' });
        }
        if (req.file) {
            const imageId = uuidv4();
            const fileData = {
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                buffer: req.file.buffer.toString('base64'),
            };
            await redisClient.set(imageId, JSON.stringify(fileData));
            req.body.imageId = imageId;
        }
        next();
    });
};