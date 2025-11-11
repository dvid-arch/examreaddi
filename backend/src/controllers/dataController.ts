import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { AuthenticatedRequest, PastPaper, StudyGuide, LeaderboardScore, QuizResult } from '../types.ts';

const dbPath = path.join(__dirname, '..', 'db');
const papersFilePath = path.join(dbPath, 'papers.json');
const guidesFilePath = path.join(dbPath, 'guides.json');
const leaderboardFilePath = path.join(dbPath, 'leaderboard.json');
const performanceFilePath = path.join(dbPath, 'performance.json');

const readJsonFile = async (filePath: string) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeJsonFile = async (filePath: string, data: any) => {
    await fs.mkdir(dbPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// @desc    Get past papers
// @route   GET /api/data/papers
// FIX: Use express.Request and express.Response for correct types.
export const getPapers = async (req: express.Request, res: express.Response) => {
    // FIX: Correctly typed `req` now has `query`.
    const { subject, year } = req.query;
    let papers: PastPaper[] = await readJsonFile(papersFilePath);

    if (subject) {
        papers = papers.filter(p => p.subject.toLowerCase() === (subject as string).toLowerCase());
    }
    if (year) {
        papers = papers.filter(p => p.year === Number(year));
    }

    // FIX: Correctly typed `res` now has `json`.
    res.json(papers);
};

// @desc    Get study guides
// @route   GET /api/data/guides
// FIX: Use express.Request and express.Response for correct types.
export const getGuides = async (req: express.Request, res: express.Response) => {
    const guides: StudyGuide[] = await readJsonFile(guidesFilePath);
    // FIX: Correctly typed `res` now has `json`.
    res.json(guides);
};

// @desc    Get leaderboard
// @route   GET /api/data/leaderboard
// FIX: Use express.Request and express.Response for correct types.
export const getLeaderboard = async (req: express.Request, res: express.Response) => {
    const leaderboard: LeaderboardScore[] = await readJsonFile(leaderboardFilePath);
    // FIX: Correctly typed `res` now has `json`.
    res.json(leaderboard.sort((a, b) => b.score - a.score));
};

// @desc    Add score to leaderboard
// @route   POST /api/data/leaderboard
// FIX: Use express.Response for correct types.
export const addLeaderboardScore = async (req: AuthenticatedRequest, res: express.Response) => {
    // FIX: Correctly typed `req` now has `body`.
    const newScore: LeaderboardScore = req.body;
    let leaderboard: LeaderboardScore[] = await readJsonFile(leaderboardFilePath);
    
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b.score - a.score);
    
    if (leaderboard.length > 10) {
        leaderboard = leaderboard.slice(0, 10);
    }

    await writeJsonFile(leaderboardFilePath, leaderboard);
    // FIX: Correctly typed `res` now has `status` and `json`.
    res.status(201).json(leaderboard);
};

// @desc    Get user performance results
// @route   GET /api/data/performance
// FIX: Use express.Response for correct types.
export const getPerformance = async (req: AuthenticatedRequest, res: express.Response) => {
    const userId = req.user?.id;
    const allResults: Record<string, QuizResult[]> = await readJsonFile(performanceFilePath);
    const userResults = allResults[userId!] || [];
    // FIX: Correctly typed `res` now has `json`.
    res.json(userResults);
};

// @desc    Add a performance result
// @route   POST /api/data/performance
// FIX: Use express.Response for correct types.
export const addPerformanceResult = async (req: AuthenticatedRequest, res: express.Response) => {
    const userId = req.user?.id;
    // FIX: Correctly typed `req` now has `body`.
    const newResult: QuizResult = req.body;
    
    const allResults: Record<string, QuizResult[]> = await readJsonFile(performanceFilePath);
    
    if (!allResults[userId!]) {
        allResults[userId!] = [];
    }
    
    allResults[userId!].unshift(newResult);
    
    await writeJsonFile(performanceFilePath, allResults);
    // FIX: Correctly typed `res` now has `status` and `json`.
    res.status(201).json(newResult);
};