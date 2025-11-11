
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types.ts';

// FIX: Use express.Response to specify Express types and avoid conflict with DOM types.
// FIX: Explicitly type res and next to resolve method/property errors.
export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    // FIX: Correctly typed `req` via AuthenticatedRequest now has `headers`.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email: string };
            
            // We attach a simplified user object to the request.
            // For a full app, you might fetch the full user from the DB here.
            req.user = decoded;

            next();
        } catch (error) {
            console.error(error);
            // FIX: Correctly typed `res` now has `status` and `json`.
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};