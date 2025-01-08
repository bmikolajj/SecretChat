import { createClient } from 'redis';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

export class ChatService {
    public async getMessages() {
        const messages = await redisClient.lRange('messages', 0, -1);
        return messages.map((message) => JSON.parse(message));
    }

    public async sendMessage(username: string, text: string, imageId?: string) {
        const message = { id: uuidv4(), username, text, imageId, createdAt: new Date() };
        await redisClient.rPush('messages', JSON.stringify(message));
        return message;
    }
}