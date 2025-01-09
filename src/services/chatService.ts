import { createClient } from 'redis';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

interface Message {
    id: string;
    username: string;
    text: string;
    createdAt: Date;
    isCampfire: boolean;
    imageId?: string;
    roomId?: string;
}

interface Room {
    id: string;
    users: [string, string];
}

export class ChatService {
    public async getMessages() {
        const messages = await redisClient.lRange('messages', 0, -1);
        return messages
            .map((message) => JSON.parse(message))
            .filter((message: Message) => !message.roomId);
    }

    public async getPrivateMessages(roomId: string) {
        const messages = await redisClient.lRange('messages', 0, -1);
        return messages
            .map((message) => JSON.parse(message))
            .filter((message: Message) => message.roomId == roomId);
    }

    public async sendMessage(username: string, text: string, imageId?: string, isCampfire?: boolean, roomId?: string) {
        const message: Message = { id: uuidv4(), username, text, createdAt: new Date(), isCampfire: isCampfire || false, imageId, roomId };
        await redisClient.rPush('messages', JSON.stringify(message));
        console.log('Stored message:', message); 
        return message;
    }

    public async createPrivateRoom(username: string, receiver: string) {
        const existingRoomId = await this.findExistingRoom(username, receiver);
        if (existingRoomId) {
            console.log('Room already exists:', existingRoomId);
            return { id: existingRoomId };
        }

        const roomId = uuidv4();
        const room: Room = { id: roomId, users: [username, receiver] };
        await redisClient.set(`room:${roomId}`, JSON.stringify(room));
        await redisClient.sAdd(`user:${username}:rooms`, roomId);
        await redisClient.sAdd(`user:${receiver}:rooms`, roomId);
        console.log('Created private room:', room);
        return roomId;
    }

    private async findExistingRoom(username: string, receiver: string): Promise<string | null> {
        const userRooms = await redisClient.sMembers(`user:${username}:rooms`);
        for (const roomId of userRooms) {
            const roomData = await redisClient.get(`room:${roomId}`);
            if (roomData) {
                const room: Room = JSON.parse(roomData);
                if (room.users.includes(receiver)) {
                    return room.id;
                }
            }
        }
        return null;
    }
}