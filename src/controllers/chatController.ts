import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

export class ChatController {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
    }

    public getMessages = async (req: Request, res: Response): Promise<void> => {
        try {
            const messages = await this.chatService.getMessages();
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error); 
            res.status(400).json({ message: (error as Error).message });
        }
    };

    public getPrivateMessages = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const messages = await this.chatService.getPrivateMessages(id);
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error); 
            res.status(400).json({ message: (error as Error).message });
        }
    };

    public sendMessage = async (req: Request, res: Response): Promise<void> => {
        const { text, isCampfire, imageId } = req.body;
        const { id } = req.params;
        const { username } = req.user!;
        try {        
            const roomId = id || undefined;
            const message = await this.chatService.sendMessage(username, text, imageId, isCampfire === 'true', roomId);
            console.log('Sent message:', message);
            res.status(201).json(message);
        } catch (error) {
            console.error('Error sending message:', error); 
            res.status(400).json({ message: (error as Error).message });
        }
    };

    public getImage = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const fileData = await redisClient.get(id);
            if (!fileData) {
                res.status(404).json({ message: 'Image not found' });
                return;
            }
            const file = JSON.parse(fileData);
            const buffer = Buffer.from(file.buffer, 'base64');
            res.set('Content-Type', file.mimetype);
            res.send(buffer);
        } catch (error) {
            console.error('Error fetching image:', error); // Add logging
            res.status(400).json({ message: (error as Error).message });
        }
    };

    public createPrivateRoom = async (req: Request, res: Response): Promise<void> => {
        const { receiver } = req.body;
        const { username } = req.user!;
        try {
            const message = await this.chatService.createPrivateRoom(username, receiver);
            res.status(201).json(message);
        } catch (error) {
            console.error('Error creating room:', error); 
            res.status(400).json({ message: (error as Error).message });
        }
    };
}