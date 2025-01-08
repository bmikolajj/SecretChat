import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { authMiddleware } from './middleware/authMiddleware';
import chatRoutes from './routes/chatRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect().then(() => {
    console.log('Connected to Redis');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Redis connection error:', error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/chat.html'));
});