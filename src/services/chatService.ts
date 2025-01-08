import MessageModel from '../models/messageModel';

export class ChatService {
    public async getMessages() {
        return await MessageModel.find().sort({ createdAt: -1 }).exec();
    }

    public async sendMessage(username: string, text: string) {
        const message = new MessageModel({ username, text });
        return await message.save();
    }
}