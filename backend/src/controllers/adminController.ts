import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { User, PastPaper, StudyGuide } from '../types.ts';

const dbPath = path.join(__dirname, '..', 'db');
const usersFilePath = path.join(dbPath, 'users.json');
const papersFilePath = path.join(dbPath, 'papers.json');
const guidesFilePath = path.join(dbPath, 'guides.json');

const readUsers = async (): Promise<User[]> => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) { return []; }
};

const writeUsers = async (users: User[]) => {
    await fs.mkdir(dbPath, { recursive: true });
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
};

const readJsonFile = async (filePath: string) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// FIX: Use express.Request and express.Response for correct types.
export const getUsers = async (req: express.Request, res: express.Response) => {
    const users = await readUsers();
    // Don't send password hashes to the client
    const safeUsers = users.map(({ passwordHash, ...user }) => user);
    // FIX: Correctly typed `res` now has `json`.
    res.json(safeUsers);
};

// @desc    Update user subscription
// @route   PUT /api/admin/users/:id/subscription
// FIX: Use express.Request and express.Response for correct types.
export const updateUserSubscription = async (req: express.Request, res: express.Response) => {
    // FIX: Correctly typed `req` now has `params` and `body`.
    const { id } = req.params;
    const { subscription } = req.body;

    if (!['free', 'pro'].includes(subscription)) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        return res.status(400).json({ message: 'Invalid subscription status' });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Admins cannot have their subscription changed
    if(users[userIndex].role === 'admin') {
         // FIX: Correctly typed `res` now has `status` and `json`.
         return res.status(403).json({ message: 'Cannot change an admin\'s subscription' });
    }

    users[userIndex].subscription = subscription;
    
    // Give credits when upgrading to pro
    if(subscription === 'pro') {
        users[userIndex].aiCredits = 10;
    } else {
        users[userIndex].aiCredits = 0;
    }

    await writeUsers(users);

    const { passwordHash, ...updatedUser } = users[userIndex];
    // FIX: Correctly typed `res` now has `json`.
    res.json(updatedUser);
};


// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// FIX: Use express.Request and express.Response for correct types.
export const getAdminStats = async (req: express.Request, res: express.Response) => {
    try {
        const users = await readUsers();
        const papers: PastPaper[] = await readJsonFile(papersFilePath);
        const guides: StudyGuide[] = await readJsonFile(guidesFilePath);

        const totalQuestions = papers.reduce((acc, paper) => acc + paper.questions.length, 0);

        // FIX: Correctly typed `res` now has `json`.
        res.json({
            users: users.length,
            papers: papers.length,
            questions: totalQuestions,
            guides: guides.length
        });
    } catch (error) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(500).json({ message: 'Failed to retrieve stats' });
    }
};

// @desc    Delete a past paper
// @route   DELETE /api/admin/papers/:id
// FIX: Use express.Request and express.Response for correct types.
export const deletePaper = async (req: express.Request, res: express.Response) => {
    // FIX: Correctly typed `req` now has `params`.
    const { id } = req.params;
    const papers: PastPaper[] = await readJsonFile(papersFilePath);
    const updatedPapers = papers.filter(p => p.id !== id);

    if (papers.length === updatedPapers.length) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        return res.status(404).json({ message: 'Paper not found' });
    }

    try {
        await fs.writeFile(papersFilePath, JSON.stringify(updatedPapers, null, 2));
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(200).json({ message: 'Paper deleted successfully' });
    } catch (error) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(500).json({ message: 'Error writing to database' });
    }
};

// @desc    Delete a study guide
// @route   DELETE /api/admin/guides/:id
// FIX: Use express.Request and express.Response for correct types.
export const deleteGuide = async (req: express.Request, res: express.Response) => {
    // FIX: Correctly typed `req` now has `params`.
    const { id } = req.params;
    const guides: StudyGuide[] = await readJsonFile(guidesFilePath);
    const updatedGuides = guides.filter(g => g.id !== id);

    if (guides.length === updatedGuides.length) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        return res.status(404).json({ message: 'Guide not found' });
    }

    try {
        await fs.writeFile(guidesFilePath, JSON.stringify(updatedGuides, null, 2));
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(200).json({ message: 'Guide deleted successfully' });
    } catch (error) {
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(500).json({ message: 'Error writing to database' });
    }
};