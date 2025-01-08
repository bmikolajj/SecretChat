import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    username: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const MessageModel = model('Message', messageSchema);

export default MessageModel;