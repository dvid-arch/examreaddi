
import { Response } from 'express';
import { AuthenticatedRequest, User } from '../types.ts';
import { GoogleGenAI, Content } from "@google/genai";
import fs from 'fs/promises';
import path from 'path';
// FIX: Resolve `Cannot find name '__dirname'` error by defining `__dirname` for ES modules.
import { fileURLToPath } from 'url';

// FIX: Resolve `Cannot find name '__dirname'` error by defining `__dirname` for ES modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'db');
const usersFilePath = path.join(dbPath, 'users.json');

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable not set.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

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

const missingApiKeyError = { message: "The AI service is not configured on the server." };

const buildHistory = (history: {role: 'user' | 'model', text: string}[]): Content[] => {
    return history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];
const FREE_TIER_MESSAGES = 5;

// @desc    Handle AI chat messages
// @route   POST /api/ai/chat
// FIX: Use express.Response for correct types.
export const handleAiChat = async (req: AuthenticatedRequest, res: Response) => {
    // FIX: Correctly typed `req` now has `body`.
    const { message, history } = req.body;
    const userId = req.user!.id;
    const ai = getAiInstance();
    // FIX: Correctly typed `res` now has `status` and `json`.
    if (!ai) return res.status(500).json(missingApiKeyError);

    const users = await readUsers();
    const user = users.find(u => u.id === userId);
    // FIX: Correctly typed `res` now has `status` and `json`.
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.subscription === 'free') {
        const today = getTodayDateString();
        if (user.lastMessageDate !== today) {
            user.dailyMessageCount = 0;
            user.lastMessageDate = today;
        }
        if (user.dailyMessageCount >= FREE_TIER_MESSAGES) {
            // FIX: Correctly typed `res` now has `status` and `json`.
            return res.status(403).json({ message: "You have reached your daily message limit."});
        }
        user.dailyMessageCount += 1;
        await writeUsers(users);
    }
    
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: buildHistory(history),
            config: {
                systemInstruction: `You are Ai-buddy, a friendly and encouraging AI tutor for ExamRedi. Your goal is to help students understand complex topics and prepare for their exams. Keep your tone positive and supportive. Format responses using markdown.`,
            },
        });
        const result = await chat.sendMessage({ message });
        // FIX: Correctly typed `res` now has `json`.
        res.json({ reply: result.text });
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(500).json({ message: "Error communicating with AI service." });
    }
};

const handleCreditUsage = async (userId: string, cost: number): Promise<{success: boolean, message?: string}> => {
    const users = await readUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, message: "User not found" };

    if (user.subscription === 'free') {
        return { success: false, message: "This feature is for Pro users only." };
    }
    if (user.aiCredits < cost) {
        return { success: false, message: "Insufficient AI credits." };
    }

    user.aiCredits -= cost;
    await writeUsers(users);
    return { success: true };
};

// @desc    Generate a study guide
// @route   POST /api/ai/generate-guide
// FIX: Use express.Response for correct types.
export const handleGenerateGuide = async (req: AuthenticatedRequest, res: Response) => {
    // FIX: Correctly typed `req` now has `body`.
    const { subject, topic } = req.body;
    const creditCheck = await handleCreditUsage(req.user!.id, 1);
    // FIX: Correctly typed `res` now has `status` and `json`.
    if (!creditCheck.success) return res.status(403).json({ message: creditCheck.message });

    const ai = getAiInstance();
    // FIX: Correctly typed `res` now has `status` and `json`.
    if (!ai) return res.status(500).json(missingApiKeyError);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a study guide for the subject "${subject}" on the topic "${topic}".`,
            config: {
                systemInstruction: `You are an expert educator. Create a concise, easy-to-understand study guide. Use clear headings, bullet points, and simple language. Use markdown for formatting.`,
            }
        });
        // FIX: Correctly typed `res` now has `json`.
        res.json({ guide: response.text });
    } catch (error) {
        console.error("Gemini Guide Generation Error:", error);
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(500).json({ message: "Error generating study guide." });
    }
};

// @desc    Research a topic (course/university)
// @route   POST /api/ai/research
// FIX: Use express.Response for correct types.
export const handleResearch = async (req: AuthenticatedRequest, res: Response) => {
    // FIX: Correctly typed `req` now has `body`.
    const { searchType, query } = req.body;
    const creditCheck = await handleCreditUsage(req.user!.id, 1);
    // FIX: Correctly typed `res` now has `status` and `json`.
    if (!creditCheck.success) return res.status(403).json({ message: creditCheck.message });

    const ai = getAiInstance();
    // FIX: Correctly typed `res` now has `status` and `json`.
    if (!ai) return res.status(500).json(missingApiKeyError);

    let prompt = '';
    if (searchType === 'university') {
        prompt = `Provide a detailed overview of the Nigerian university: "${query}". Include its history, notable alumni, faculties, admission requirements, and student life.`;
    } else {
        prompt = `Generate a guide for a Nigerian student considering a career in "${query}". Include required JAMB subjects, top Nigerian universities offering it, career paths, and necessary skills.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `You are a knowledgeable career and academic advisor for Nigerian students. Provide accurate, detailed, and encouraging information. Use markdown formatting.`,
            }
        });
        // FIX: Correctly typed `res` now has `json`.
        res.json({ result: response.text });
    } catch (error) {
        console.error("Gemini Research Error:", error);
        // FIX: Correctly typed `res` now has `status` and `json`.
        res.status(500).json({ message: "Error researching topic." });
    }
};
