import { User } from '../types/index';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}