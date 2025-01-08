import { Schema, model } from 'mongoose';
import { User } from '../types/index';

const userSchema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = model<User>('User', userSchema);

export default UserModel;