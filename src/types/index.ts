export interface User {
    id: string;
    username: string;
    password: string;
}
export interface Message {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: Date;
}