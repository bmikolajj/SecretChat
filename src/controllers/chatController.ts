import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';

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
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    };

    public sendMessage = async (req: Request, res: Response): Promise<void> => {
        const { text } = req.body;
        const { username } = req.user!;
        try {
            const message = await this.chatService.sendMessage(username, text);
            res.status(201).json(message);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    };
}