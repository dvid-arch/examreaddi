
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.ts';
import dataRoutes from './routes/dataRoutes.ts';
import aiRoutes from './routes/aiRoutes.ts';
import adminRoutes from './routes/adminRoutes.ts';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// FIX: The error on this line was likely due to type inference issues caused by conflicting global types. Fixing Request/Response types throughout the app resolves this.
app.use(express.json());

// FIX: Add explicit types for req and res to resolve method errors like '.send'.
app.get('/', (req: Request, res: Response) => {
    // FIX: Use express.Response to get correct method definitions like .send()
    res.send('ExamRedi Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});