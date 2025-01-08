import { createClient } from 'redis';
import { User } from '../types/index';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});


redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

export class UserService {
    async createUser(userData: User): Promise<User> {
        const userId = uuidv4();
        const newUser: User = { ...userData, id: userId };
        await redisClient.set(`user:${userId}`, JSON.stringify(newUser));
        await redisClient.set(`user:username:${newUser.username}`, userId);
        return newUser;
    }

    async getUserById(userId: string): Promise<User | null> {
        const userData = await redisClient.get(`user:${userId}`);
        return userData ? JSON.parse(userData) : null;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const userId = await redisClient.get(`user:username:${username}`);
        if (!userId) {
            return null;
        }
        return this.getUserById(userId);
    }

    async updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
        const user = await this.getUserById(userId);
        if (!user) {
            return null;
        }
        const updatedUser = { ...user, ...updateData };
        await redisClient.set(`user:${userId}`, JSON.stringify(updatedUser));
        return updatedUser;
    }

    async deleteUser(userId: string): Promise<User | null> {
        const user = await this.getUserById(userId);
        if (!user) {
            return null;
        }
        await redisClient.del(`user:${userId}`);
        await redisClient.del(`user:username:${user.username}`);
        return user;
    }
}