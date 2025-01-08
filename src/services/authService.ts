import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../types/index';

export class AuthService {
    public async register(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ username, password: hashedPassword });
        await user.save();
        return user;
    }

    public async login(username: string, password: string): Promise<string> {
        const user = await UserModel.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h',
        });

        return token;
    }
}