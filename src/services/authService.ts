import { createClient } from 'redis';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/index';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});


redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

export class AuthService {
    public async register(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const user: User = { id: userId, username, password: hashedPassword };
        await redisClient.set(`user:${username}`, JSON.stringify(user));
        return user;
    }

    public async login(username: string, password: string): Promise<string> {
        const userData = await redisClient.get(`user:${username}`);
        if (!userData) {
            throw new Error('User not found');
        }

        const user: User = JSON.parse(userData);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return token;
    }
}