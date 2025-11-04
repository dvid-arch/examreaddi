
import React from 'react';
import { Link } from 'react-router-dom';
import { CareerIcon as CareerIconImported } from '../constants.tsx'; // Using an alias to avoid naming conflict

const PracticeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const ClassroomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PerformanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const GamesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ChallengeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const CareerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><CareerIconImported /></svg>;
const DictionaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;


const tiles = [
    { title: 'Practice For UTME', color: 'tile-blue', path: '/practice', icon: <PracticeIcon /> },
    { title: 'Classroom', color: 'tile-pink', path: '/study-guides', icon: <ClassroomIcon /> },
    { title: 'Question Search', color: 'tile-green', path: '/question-search', icon: <SearchIcon /> },
    { title: 'Performance Analysis', color: 'tile-orange', path: '/performance', icon: <PerformanceIcon /> },
    { title: 'Educational Games', color: 'tile-yellow', path: '/games', icon: <GamesIcon /> },
    { title: 'UTME Literature Books', color: 'tile-purple', path: '/literature', icon: <BookIcon /> },
    { title: 'UTME Challenge', color: 'tile-green', path: '/challenge', icon: <ChallengeIcon /> },
    { title: 'Career And Institutions', color: 'tile-blue', path: '/career-institutions', icon: <CareerIcon /> },
    { title: 'Dictionary', color: 'tile-pink', path: '/dictionary', icon: <DictionaryIcon /> },
];

const DashboardTile: React.FC<{ title: string; color: string; path: string; icon: React.ReactNode; }> = ({ title, color, path, icon }) => (
    <Link to={path} className={`bg-${color} p-4 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center items-center text-center`}>
        <div className="w-14 h-14 mb-3 rounded-full bg-white flex items-center justify-center shadow">
             {icon}
        </div>
        <p className="font-semibold text-slate-800 text-lg">{title}</p>
    </Link>
);

const WelcomeBanner = () => (
    <div className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-green-600 rounded-full opacity-30"></div>
        <div className="absolute -left-12 bottom-4 w-40 h-40 bg-green-600 rounded-full opacity-20 transform rotate-45"></div>
        <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, Owoidighe-1!</h1>
            <p className="mt-2 text-green-100 max-w-2xl">Ready to ace your exams? Let's dive into some practice questions or review your study guides.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link to="/practice" className="bg-white text-primary font-bold py-3 px-6 rounded-lg hover:bg-green-100 transition-colors duration-200 text-center">Start Practice Session</Link>
                <Link to="/performance" className="bg-transparent border-2 border-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-primary transition-colors duration-200 text-center">View Performance</Link>
            </div>
        </div>
    </div>
);


const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <WelcomeBanner />

            <div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-4">Explore Your Tools</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {tiles.map((tile) => (
                        <DashboardTile key={tile.title} {...tile} />
                    ))}
                </div>
            </div>

             <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                <p className="text-slate-700 text-sm">
                    <span className="font-bold text-primary mr-2">Tip:</span> Consistent practice is the key to mastering any subject. Try a new topic today!
                </p>
            </div>
        </div>
    );
};

export default Dashboard;