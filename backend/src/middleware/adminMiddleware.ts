import express, { NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { AuthenticatedRequest, User } from '../types.ts';

const usersFilePath = path.join(__dirname, '..', 'db', 'users.json');

// FIX: Use express.Response to specify Express types and avoid conflict with DOM types.
export const admin = async (req: AuthenticatedRequest, res: express.Response, next: NextFunction) => {
    if (req.user) {
        try {
            const data = await fs.readFile(usersFilePath, 'utf-8');
            const users: User[] = JSON.parse(data);
            const user = users.find(u => u.id === req.user!.id);

            if (user && user.role === 'admin') {
                next();
            } else {
                // FIX: Correctly typed `res` now has `status` and `json`.
                res.status(403).json({ message: 'Not authorized as an admin' });
            }
        } catch (error) {
             // FIX: Correctly typed `res` now has `status` and `json`.
             res.status(500).json({ message: 'Error checking admin status' });
        }
    } else {
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(401).json({ message: 'Not authorized' });
    }
};