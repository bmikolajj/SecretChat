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

interface Message {
    id: string;
    username: string;
    text: string;
    createdAt: Date;
    isCampfire: boolean;
    imageId?: string;
}

export class ChatService {
    public async getMessages() {
        const messages = await redisClient.lRange('messages', 0, -1); 
        return messages.map((message) => JSON.parse(message));
    }

    public async sendMessage(username: string, text: string, imageId?: string, isCampfire?: boolean) {
        const message: Message = { id: uuidv4(), username, text, createdAt: new Date(), isCampfire: isCampfire || false, imageId };
        await redisClient.rPush('messages', JSON.stringify(message));
        console.log('Stored message:', message); 
        return message;
    }
}