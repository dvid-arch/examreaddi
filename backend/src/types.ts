
import { Request } from 'express';

// Replicating frontend types for consistency
export interface PastQuestionOption {
  text: string;
  diagram?: string;
}

export interface PastQuestion {
  id:string;
  question: string;
  questionDiagram?: string;
  options: { [key: string]: PastQuestionOption };
  answer: string;
}

export interface PastPaper {
  id: string;
  exam: string;
  subject: string;
  year: number;
  questions: PastQuestion[];
}

export interface StudyGuide {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
}

export interface LeaderboardScore {
  name: string;
  score: number;
  totalQuestions: number;
  date: number;
}

export interface QuizResult {
  id: string;
  paperId: string;
  exam: string;
  subject: string;
  year: number;
  score: number;
  totalQuestions: number;
  userAnswers: { [key: string]: string };
  completedAt: number;
}

// User type for the backend database
export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    subscription: 'free' | 'pro';
    role: 'user' | 'admin';
    aiCredits: number;
    dailyMessageCount: number;
    lastMessageDate: string; // YYYY-MM-DD format
}

// Extending Express Request type to include authenticated user
// FIX: Use express.Request to avoid conflict with browser/DOM Request type.
export type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};