import UserModel from '../models/userModel';
import { User } from '../types/index';

export class UserService {
    async createUser(userData: User): Promise<User> {
        const newUser = new UserModel(userData);
        return await newUser.save();
    }

    async getUserById(userId: string): Promise<User | null> {
        return await UserModel.findById(userId).exec();
    }

    async updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    }

    async deleteUser(userId: string): Promise<User | null> {
        return await UserModel.findByIdAndDelete(userId).exec();
    }
}