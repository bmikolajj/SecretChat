import multer from 'multer';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
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
            const imageId = `image:${uuidv4()}`;
            const fileData = {
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                buffer: req.file.buffer.toString('base64'),
            };
            await redisClient.set(imageId, JSON.stringify(fileData));

            const expiry = parseInt(req.body.expiry, 10) || 86400;
            await redisClient.expire(imageId, expiry);

            req.body.imageId = imageId;
        }
        next();
    });
};

export const updateImageInRedis = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Message ID is required' });
    }

    try {
        const messages = await redisClient.lRange('messages', 0, -1);
        const messageIndex = messages.findIndex((msg) => JSON.parse(msg).id === id);
        if (messageIndex === -1) {
            return res.status(404).json({ message: 'Message not found' });
        }

        const message = JSON.parse(messages[messageIndex]);
        const imageId = message.imageId;
        if (!imageId) {
            return res.status(404).json({ message: 'Image not found in message' });
        }

        const fileData = await redisClient.get(imageId);
        if (!fileData) {
            return res.status(404).json({ message: 'Image not found' });
        }
        const file = JSON.parse(fileData);
        const buffer = Buffer.from(file.buffer, 'base64');

        const img = await loadImage(`data:${file.mimetype};base64,${file.buffer}`);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let maxRCount = 0;
        const totalPixels = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] >= 255) {
                maxRCount++;
            }
            data[i] = Math.min(255, data[i] + 60);
        }

        const maxRPercentage = (maxRCount / totalPixels) * 100;
        if (maxRPercentage >= 80) {
            const ashesPath = path.join(__dirname, '../../public/images/ashes.png');
            const ashesImg = await loadImage(ashesPath);
            canvas.width = ashesImg.width;
            canvas.height = ashesImg.height;
            ctx.drawImage(ashesImg, 0, 0);

            message.isCampfire = false;
        } else {
            ctx.putImageData(imageData, 0, 0);
        }

        const updatedImageDataUrl = canvas.toDataURL(file.mimetype);
        const updatedBuffer = updatedImageDataUrl.split(',')[1];

        file.buffer = updatedBuffer;

        await redisClient.set(imageId, JSON.stringify(file));
        await redisClient.lSet('messages', messageIndex, JSON.stringify(message));

        await redisClient.expire(imageId, 86400);

        console.log('Updated image buffer and message:', imageId);
        res.status(200).json({ message: 'Image buffer and message updated successfully' });
    } catch (error) {
        console.error('Error updating image buffer and message:', error);
        res.status(500).json({ message: 'Error updating image buffer and message' });
    }
};