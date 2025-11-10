

// FIX: Corrected import to use standard `Request` and `Response` types from Express.
import { Request, Response } from 'express';
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
// FIX: Corrected `req` and `res` types to fix property access errors.
export const getPapers = async (req: Request, res: Response) => {
    const { subject, year } = req.query;
    let papers: PastPaper[] = await readJsonFile(papersFilePath);

    if (subject) {
        papers = papers.filter(p => p.subject.toLowerCase() === (subject as string).toLowerCase());
    }
    if (year) {
        papers = papers.filter(p => p.year === Number(year));
    }

    res.json(papers);
};

// @desc    Get study guides
// @route   GET /api/data/guides
// FIX: Corrected `res` type to fix method access errors.
export const getGuides = async (req: Request, res: Response) => {
    const guides: StudyGuide[] = await readJsonFile(guidesFilePath);
    res.json(guides);
};

// @desc    Get leaderboard
// @route   GET /api/data/leaderboard
// FIX: Corrected `res` type to fix method access errors.
export const getLeaderboard = async (req: Request, res: Response) => {
    const leaderboard: LeaderboardScore[] = await readJsonFile(leaderboardFilePath);
    res.json(leaderboard.sort((a, b) => b.score - a.score));
};

// @desc    Add score to leaderboard
// @route   POST /api/data/leaderboard
// FIX: Corrected `res` type to fix method access errors.
export const addLeaderboardScore = async (req: AuthenticatedRequest, res: Response) => {
    const newScore: LeaderboardScore = req.body;
    let leaderboard: LeaderboardScore[] = await readJsonFile(leaderboardFilePath);
    
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b.score - a.score);
    
    if (leaderboard.length > 10) {
        leaderboard = leaderboard.slice(0, 10);
    }

    await writeJsonFile(leaderboardFilePath, leaderboard);
    res.status(201).json(leaderboard);
};

// @desc    Get user performance results
// @route   GET /api/data/performance
// FIX: Corrected `res` type to fix method access errors.
export const getPerformance = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const allResults: Record<string, QuizResult[]> = await readJsonFile(performanceFilePath);
    const userResults = allResults[userId!] || [];
    res.json(userResults);
};

// @desc    Add a performance result
// @route   POST /api/data/performance
// FIX: Corrected `res` type to fix method access errors.
export const addPerformanceResult = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const newResult: QuizResult = req.body;
    
    const allResults: Record<string, QuizResult[]> = await readJsonFile(performanceFilePath);
    
    if (!allResults[userId!]) {
        allResults[userId!] = [];
    }
    
    allResults[userId!].unshift(newResult);
    
    await writeJsonFile(performanceFilePath, allResults);
    res.status(201).json(newResult);
};
