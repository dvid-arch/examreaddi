import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card.tsx';
import { pastPapersData } from '../data/pastQuestions.ts';
import { PastQuestion } from '../types.ts';
import MarkdownRenderer from '../components/MarkdownRenderer.tsx';

interface SearchResult extends PastQuestion {
    subject: string;
    year: number;
    exam: string;
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;


const QuestionSearch: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'browse' | 'search'>('browse');

    // Search state
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Browse state
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [expandedPaperId, setExpandedPaperId] = useState<string | null>(null);

    const performSearch = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) return;

        const lowerCaseQuery = searchQuery.toLowerCase();
        const allQuestions: SearchResult[] = pastPapersData.flatMap(paper =>
            paper.questions.map(q => ({
                ...q,
                subject: paper.subject,
                year: paper.year,
                exam: paper.exam,
            }))
        );

        const filteredResults = allQuestions.filter(q => {
            const questionText = q.question.toLowerCase();
            const optionsText = Object.values(q.options).map(o => o.text).join(' ').toLowerCase();
            return questionText.includes(lowerCaseQuery) || optionsText.includes(lowerCaseQuery);
        });

        setResults(filteredResults);
        setHasSearched(true);
    }, []);
    
    useEffect(() => {
        const initialQuery = location.state?.query;
        if (typeof initialQuery === 'string') {
            setQuery(initialQuery);
            performSearch(initialQuery);
            setActiveTab('search');
        }
    }, [location.state, performSearch]);

    const handleSearchFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(query);
    };

    const subjects = useMemo(() => {
        const uniqueSubjects = [...new Set(pastPapersData.map(p => p.subject))].sort();
        return ['all', ...uniqueSubjects];
    }, []);

    const years = useMemo(() => {
        const uniqueYears = [...new Set(pastPapersData.map(p => p.year))].sort((a, b) => b - a);
        return ['all', ...uniqueYears];
    }, []);

    const filteredPapers = useMemo(() => {
        return pastPapersData.filter(paper => {
            const subjectMatch = selectedSubject === 'all' || paper.subject === selectedSubject;
            const yearMatch = selectedYear === 'all' || paper.year === Number(selectedYear);
            return subjectMatch && yearMatch;
        }).sort((a, b) => b.year - a.year || a.subject.localeCompare(b.subject));
    }, [selectedSubject, selectedYear]);

    const handleTogglePaper = (paperId: string) => {
        setExpandedPaperId(prevId => (prevId === paperId ? null : paperId));
    };
    
    const highlightQuery = (text: string, highlight: string): string => {
        if (!highlight.trim()) {
            return text;
        }
        const regex = new RegExp(`(${highlight})`, 'gi');
        // Use a string replacement that can be parsed by rehype-raw
        return text.replace(regex, `<mark class="bg-yellow-200 px-1 rounded">$1</mark>`);
    };

    const renderBrowser = () => (
        <Card>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="subject-filter" className="block text-sm font-medium text-slate-700 mb-1">Filter by Subject</label>
                        <select
                            id="subject-filter"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {subjects.map(s => <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>)}
                        </select>
                    </div>
                     <div className="flex-1">
                        <label htmlFor="year-filter" className="block text-sm font-medium text-slate-700 mb-1">Filter by Year</label>
                        <select
                            id="year-filter"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                           {years.map(y => <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>)}
                        </select>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                    {filteredPapers.length > 0 ? (
                        <div className="space-y-2">
                            {filteredPapers.map(paper => (
                                <div key={paper.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleTogglePaper(paper.id)}
                                        className="w-full flex justify-between items-center p-3 text-left bg-gray-50 hover:bg-gray-100"
                                        aria-expanded={expandedPaperId === paper.id}
                                    >
                                        <span className="font-semibold text-lg text-slate-800">{paper.subject} - {paper.exam} {paper.year}</span>
                                        <span className={`transform transition-transform duration-300 ${expandedPaperId === paper.id ? 'rotate-180' : ''}`}>
                                            <ChevronDownIcon />
                                        </span>
                                    </button>
                                    {expandedPaperId === paper.id && (
                                        <div className="p-3 bg-white space-y-4">
                                            {paper.questions.map((q, index) => (
                                                <div key={q.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <p className="font-semibold text-slate-700 mb-2">Question {index + 1}</p>
                                                    <div className="text-slate-800 mb-2"><MarkdownRenderer content={q.question} /></div>
                                                    {q.questionDiagram && (
                                                        <div className="mb-4">
                                                            <img src={q.questionDiagram} alt="Question diagram" className="max-w-md h-auto rounded-lg border bg-white" />
                                                        </div>
                                                    )}
                                                    <div className="space-y-2">
                                                        {Object.keys(q.options).map(key => {
                                                            const value = q.options[key];
                                                            const isCorrect = key === q.answer;
                                                            return (
                                                                <div key={key} className={`p-3 rounded-md flex items-start gap-3 text-sm ${isCorrect ? 'bg-green-100 text-green-800 font-semibold' : 'bg-white'}`}>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-start gap-2">
                                                                            <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-slate-800'}`}>{key}.</span>
                                                                            <div className={isCorrect ? 'text-green-800' : 'text-slate-700'}><MarkdownRenderer content={value.text} /></div>
                                                                        </div>
                                                                        {value.diagram && (
                                                                            <div className="mt-2 pl-6">
                                                                                <img src={value.diagram} alt={`Option ${key} diagram`} className="max-w-[200px] h-auto rounded-md border bg-white" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-10">No past papers match your criteria.</p>
                    )}
                </div>
            </div>
        </Card>
    );

    const renderSearch = () => (
        <Card>
            <div>
                <form onSubmit={handleSearchFormSubmit} className="flex gap-2">
                    <div className="relative flex-grow">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., photosynthesis, gravity, simile..."
                            className="w-full bg-gray-100 border-gray-200 border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label="Search for questions"
                        />
                    </div>
                    <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition-colors">
                        Search
                    </button>
                </form>

                <div className="mt-6 min-h-[400px]">
                    {!hasSearched ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="bg-primary-light text-primary rounded-full p-4 inline-block mb-6">
                                <BookOpenIcon />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Find Questions Instantly</h2>
                            <p className="text-slate-600 max-w-md">
                                Enter a topic, keyword, or phrase in the search bar above to find relevant past questions from our database.
                            </p>
                        </div>
                    ) : results.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                Found {results.length} question{results.length > 1 ? 's' : ''} for "{query}"
                            </h2>
                            <div className="space-y-6">
                                {results.map((q, index) => (
                                    <div key={q.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start text-sm text-slate-500 mb-2">
                                            <span>Question {index + 1}</span>
                                            <span className="font-semibold">{q.subject} - {q.exam} {q.year}</span>
                                        </div>
                                        <div className="text-lg text-slate-800 mb-2"><MarkdownRenderer content={highlightQuery(q.question, query)} /></div>
                                        {q.questionDiagram && (
                                            <div className="mb-4">
                                                <img src={q.questionDiagram} alt="Question diagram" className="max-w-md h-auto rounded-lg border bg-white" />
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            {Object.keys(q.options).map(key => {
                                                const value = q.options[key];
                                                const isCorrect = key === q.answer;
                                                return (
                                                    <div key={key} className={`p-3 rounded-md flex items-start gap-3 text-sm ${isCorrect ? 'bg-green-100 text-green-900 font-semibold' : 'bg-white'}`}>
                                                         <div className="flex-1">
                                                            <div className="flex items-start gap-2">
                                                                <span className={`font-bold ${isCorrect ? 'text-green-900' : 'text-slate-800'}`}>{key}.</span>
                                                                <div className={isCorrect ? 'text-green-900' : 'text-slate-700'}><MarkdownRenderer content={highlightQuery(value.text, query)} /></div>
                                                            </div>
                                                            {value.diagram && (
                                                                <div className="mt-2 pl-6">
                                                                    <img src={value.diagram} alt={`Option ${key} diagram`} className="max-w-[200px] h-auto rounded-md border bg-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                             <h2 className="text-2xl font-bold text-slate-700">No Results Found</h2>
                            <p className="text-slate-500 mt-2">We couldn't find any questions matching "{query}". Try a different search term.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Card>
                <h1 className="text-3xl font-bold text-slate-800">Past Questions</h1>
                <p className="text-slate-600 mt-2">Browse the library of past papers or search for specific questions by keyword.</p>
                 <div className="mt-6 flex border border-gray-200 rounded-lg p-1 bg-gray-50 max-w-md">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === 'browse' ? 'bg-primary text-white shadow' : 'text-slate-600'}`}
                    >
                        Browse Library
                    </button>
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeTab === 'search' ? 'bg-primary text-white shadow' : 'text-slate-600'}`}
                    >
                        Search by Keyword
                    </button>
                </div>
            </Card>

            {activeTab === 'browse' ? renderBrowser() : renderSearch()}
        </div>
    );
};

export default QuestionSearch;
