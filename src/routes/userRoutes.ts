import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
import { UserService } from '../services/userService';

const userService = new UserService();
const userController = new UserController(userService);

router.get('/profile/:id', userController.getUserProfile);
router.put('/profile/:id', userController.updateUserProfile);

export default router;