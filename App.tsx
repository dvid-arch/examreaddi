
import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Flashcards from './pages/Flashcards.tsx';
import Quizzes from './pages/Quizzes.tsx';
import ExamWithAI from './pages/ExamWithAI.tsx';
import StudyGuides from './pages/StudyGuides.tsx';
import TakeExamination from './pages/TakeExamination.tsx';
import EducationalGames from './pages/EducationalGames.tsx';
import Performance from './pages/Performance.tsx';
import MemoryMatchGame from './pages/MemoryMatchGame.tsx';
import CareerInstitutions from './pages/CareerInstitutions.tsx';
import UtmeChallenge from './pages/UtmeChallenge.tsx';
import ComingSoon from './pages/ComingSoon.tsx';
import QuestionSearch from './pages/QuestionSearch.tsx';

const App: React.FC = () => {
  const location = useLocation();
  const showHeaderAndSidebar = location.pathname !== '/take-examination';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {showHeaderAndSidebar && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <div className={`flex-1 flex flex-col ${showHeaderAndSidebar ? '' : ''}`}>
        {showHeaderAndSidebar && <Header onMenuClick={() => setIsSidebarOpen(true)} />}
        <main className={`flex-1 overflow-y-auto ${showHeaderAndSidebar ? 'p-4' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/practice" element={<Quizzes />} />
            <Route path="/ai-buddy" element={<ExamWithAI />} />
            <Route path="/take-examination" element={<TakeExamination />} />
            <Route path="/question-search" element={<QuestionSearch />} />
            <Route path="/study-guides" element={<StudyGuides />} />
            <Route path="/games" element={<EducationalGames />} />
            <Route path="/games/memory-match" element={<MemoryMatchGame />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/career-institutions" element={<CareerInstitutions />} />
            <Route path="/challenge" element={<UtmeChallenge />} />
            <Route path="/literature" element={<ComingSoon title="UTME Literature Books" />} />
            <Route path="/dictionary" element={<ComingSoon title="Dictionary" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;