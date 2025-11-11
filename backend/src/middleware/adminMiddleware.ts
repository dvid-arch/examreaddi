
import { Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
// FIX: Resolve `Cannot find name '__dirname'` error by defining `__dirname` for ES modules.
import { fileURLToPath } from 'url';
import { AuthenticatedRequest, User } from '../types.ts';

// FIX: Resolve `Cannot find name '__dirname'` error by defining `__dirname` for ES modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, '..', 'db', 'users.json');

// FIX: Use express.Response to specify Express types and avoid conflict with DOM types.
// FIX: Explicitly type res and next to resolve method/property errors.
export const admin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
