import { Router } from 'express';
import { AuthService } from '../services/authService';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authService.register(username, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const token = await authService.login(username, password);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

export default router;