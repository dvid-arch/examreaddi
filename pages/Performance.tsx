
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card.tsx';
import { QuizResult } from '../types.ts';

const Performance: React.FC = () => {
    const [results, setResults] = useState<QuizResult[]>([]);

    useEffect(() => {
        const storedResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        setResults(storedResults);
    }, []);

    const {
        averageScore,
        quizzesTaken,
        bestSubject,
        performanceBySubject,
        weakSubjects,
    } = useMemo(() => {
        if (results.length === 0) {
            return {
                averageScore: 0,
                quizzesTaken: 0,
                bestSubject: 'N/A',
                performanceBySubject: {},
                weakSubjects: [],
            };
        }

        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
        const avg = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

        const bySubject = results.reduce<Record<string, { scores: number[]; totalQuestions: number }>>((acc, result) => {
            if (!acc[result.subject]) {
                acc[result.subject] = { scores: [], totalQuestions: 0 };
            }
            acc[result.subject].scores.push(result.score);
            acc[result.subject].totalQuestions += result.totalQuestions;
            return acc;
        }, {});

        // FIX: Replaced `Object.entries` with `Object.keys().map()` because `Object.entries`
        // does not preserve key-value types for objects with index signatures, causing `data` to be `unknown`.
        // This new approach ensures `data` is correctly typed, resolving the errors.
        const subjectAverages = Object.keys(bySubject).map((subject) => {
            const data = bySubject[subject];
            const totalScored = data.scores.reduce((sum, s) => sum + s, 0);
            return {
                subject,
                average: data.totalQuestions > 0 ? (totalScored / data.totalQuestions) * 100 : 0,
            };
        });

        subjectAverages.sort((a, b) => b.average - a.average);

        return {
            averageScore: Math.round(avg),
            quizzesTaken: results.length,
            bestSubject: subjectAverages.length > 0 ? subjectAverages[0].subject : 'N/A',
            performanceBySubject: subjectAverages,
            weakSubjects: subjectAverages.filter(s => s.average < 60).map(s => s.subject),
        };
    }, [results]);

    if (results.length === 0) {
        return (
            <Card className="text-center p-8">
                <h1 className="text-3xl font-bold text-slate-800">No Performance Data Yet</h1>
                <p className="text-slate-600 mt-2 mb-6">Complete a quiz from the 'Past Questions' section to see your analysis.</p>
                <Link to="/take-examination" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
                    Take a Quiz
                </Link>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Performance Analysis</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                    <p className="text-slate-600">Average Score</p>
                    <p className="text-4xl font-extrabold text-primary">{averageScore}%</p>
                </Card>
                 <Card className="text-center">
                    <p className="text-slate-600">Quizzes Taken</p>
                    <p className="text-4xl font-extrabold text-primary">{quizzesTaken}</p>
                </Card>
                 <Card className="text-center">
                    <p className="text-slate-600">Best Subject</p>
                    <p className="text-4xl font-extrabold text-primary">{bestSubject}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Performance by Subject</h2>
                    <div className="space-y-4">
                        {Array.isArray(performanceBySubject) && performanceBySubject.map(({ subject, average }) => (
                            <div key={subject}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold text-slate-700">{subject}</span>
                                    <span className="font-semibold text-primary">{Math.round(average)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div className="bg-primary h-4 rounded-full" style={{ width: `${average}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Personalized Feedback</h2>
                    {weakSubjects.length > 0 ? (
                        <div>
                            <p className="text-slate-600 mb-3">You're doing great! To improve even more, focus on these areas:</p>
                            <ul className="list-disc list-inside space-y-2">
                                {weakSubjects.map(subject => (
                                    <li key={subject} className="font-semibold text-slate-700">{subject}</li>
                                ))}
                            </ul>
                            <p className="text-slate-600 mt-4">Try reviewing the <Link to="/study-guides" className="text-primary font-semibold underline">Study Guides</Link> for these topics.</p>
                        </div>
                    ) : (
                         <p className="text-slate-600">Excellent work! You're showing strong performance across all subjects. Keep up the consistent practice!</p>
                    )}
                </Card>
            </div>

             <Card>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Quiz History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 font-semibold text-slate-600">Date</th>
                                <th className="p-3 font-semibold text-slate-600">Subject</th>
                                <th className="p-3 font-semibold text-slate-600">Exam</th>
                                <th className="p-3 font-semibold text-slate-600">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(result => (
                                <tr key={result.id} className="border-b">
                                    <td className="p-3 text-slate-700">{new Date(result.completedAt).toLocaleDateString()}</td>
                                    <td className="p-3 font-medium text-slate-800">{result.subject}</td>
                                    <td className="p-3 text-slate-700">{result.exam} ({result.year})</td>
                                    <td className="p-3 font-medium text-primary">{result.score}/{result.totalQuestions} ({Math.round(result.score / result.totalQuestions * 100)}%)</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Performance;