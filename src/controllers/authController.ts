import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public register = async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;
        try {
            const user = await this.authService.register(username, password);
            res.status(201).json({ message: 'Registered successfully', user });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;
        try {
            const token = await this.authService.login(username, password);
            res.status(200).json({ message: 'Logged in successfully', token });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    };
}