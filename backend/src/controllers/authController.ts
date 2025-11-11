import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { User, AuthenticatedRequest } from '../types.ts';

const dbPath = path.join(__dirname, '..', 'db');
const usersFilePath = path.join(dbPath, 'users.json');

const readUsers = async (): Promise<User[]> => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, return an empty array
        return [];
    }
};

const writeUsers = async (users: User[]) => {
    await fs.mkdir(dbPath, { recursive: true });
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
};

const generateToken = (id: string, email: string) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET!, {
        expiresIn: '30d',
    });
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

// @desc    Register a new user
// @route   POST /api/auth/register
// FIX: Use express.Request and express.Response for correct types.
export const registerUser = async (req: express.Request, res: express.Response) => {
    // FIX: Correctly typed `req` now has `body`.
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const users = await readUsers();
    const userExists = users.find(u => u.email === email);

    if (userExists) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
        id: new Date().getTime().toString(),
        name,
        email,
        passwordHash,
        subscription: 'free',
        role: 'user', // New users are always 'user' role
        aiCredits: 0,
        dailyMessageCount: 0,
        lastMessageDate: getTodayDateString()
    };

    users.push(newUser);
    await writeUsers(users);

    // FIX: Correctly typed `res` now has `status` and `json`.
    res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        subscription: newUser.subscription,
        role: newUser.role,
        token: generateToken(newUser.id, newUser.email),
    });
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// FIX: Use express.Request and express.Response for correct types.
export const loginUser = async (req: express.Request, res: express.Response) => {
    // FIX: Correctly typed `req` now has `body`.
    const { email, password } = req.body;
    const users = await readUsers();
    const user = users.find(u => u.email === email.toLowerCase());

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        // FIX: Correctly typed `res` now has `json`.
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            subscription: user.subscription,
            role: user.role,
            token: generateToken(user.id, user.email),
        });
    } else {
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(400).json({ message: 'Invalid credentials' });
    }
};


// @desc    Get user profile data
// @route   GET /api/auth/profile
// FIX: Use express.Response for correct types.
export const getUserProfile = async (req: AuthenticatedRequest, res: express.Response) => {
    const users = await readUsers();
    const user = users.find(u => u.id === req.user?.id);

    if (user) {
         // Reset daily message count if the date has changed
        const today = getTodayDateString();
        if (user.lastMessageDate !== today) {
            user.dailyMessageCount = 0;
            user.lastMessageDate = today;
            await writeUsers(users);
        }

        // FIX: Correctly typed `res` now has `json`.
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            subscription: user.subscription,
            role: user.role,
            aiCredits: user.aiCredits,
            dailyMessageCount: user.dailyMessageCount,
            lastMessageDate: user.lastMessageDate
        });
    } else {
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(404).json({ message: 'User not found' });
    }
};