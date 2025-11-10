

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.ts';
import dataRoutes from './routes/dataRoutes.ts';
import aiRoutes from './routes/aiRoutes.ts';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// FIX: Corrected Express Request and Response types to fix handler signature and method access errors.
app.get('/', (req: Request, res: Response) => {
    res.send('ExamRedi Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
