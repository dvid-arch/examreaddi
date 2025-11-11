import React, { useState, useEffect } from 'react';
import Card from '../../components/Card.tsx';
import { PastPaper, StudyGuide } from '../../types.ts';
import { pastPapersData } from '../../data/pastQuestions.ts';
import { allStudyGuides } from '../../data/studyGuides.ts';

type ContentType = 'papers' | 'guides';

const ManageContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ContentType>('papers');
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Manage Content</h1>

            <div className="flex border-b">
                <button 
                    onClick={() => setActiveTab('papers')} 
                    className={`py-2 px-6 font-semibold ${activeTab === 'papers' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}
                >
                    Past Papers
                </button>
                 <button 
                    onClick={() => setActiveTab('guides')} 
                    className={`py-2 px-6 font-semibold ${activeTab === 'guides' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}
                >
                    Study Guides
                </button>
            </div>
            
            {activeTab === 'papers' ? <ManagePapers /> : <ManageGuides />}
        </div>
    );
};


const ManagePapers: React.FC = () => {
    const [papers, setPapers] = useState<PastPaper[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPapers = () => {
        setIsLoading(true);
        setTimeout(() => {
            setPapers(pastPapersData);
            setIsLoading(false);
        }, 500);
    };
    
    useEffect(() => {
        fetchPapers();
    }, []);

    const handleDelete = (paperId: string) => {
        if (window.confirm('Are you sure you want to delete this paper and all its questions? This is a frontend-only demo action.')) {
            setPapers(prevPapers => prevPapers.filter(p => p.id !== paperId));
            alert('Paper deleted from view. (Demo only)');
        }
    }
    
    return (
         <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Past Papers ({papers.length})</h2>
                <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent">Add New Paper</button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Subject</th>
                            <th className="p-4 font-semibold text-slate-600">Exam</th>
                            <th className="p-4 font-semibold text-slate-600">Year</th>
                            <th className="p-4 font-semibold text-slate-600"># of Questions</th>
                            <th className="p-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading papers...</td></tr>
                        ) : (
                            papers.map(paper => (
                                <tr key={paper.id} className="border-b last:border-b-0">
                                    <td className="p-4 font-medium text-slate-800">{paper.subject}</td>
                                    <td className="p-4 text-slate-600">{paper.exam}</td>
                                    <td className="p-4 text-slate-600">{paper.year}</td>
                                    <td className="p-4 text-slate-600">{paper.questions.length}</td>
                                    <td className="p-4 flex gap-2">
                                        <button className="font-semibold text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(paper.id)} className="font-semibold text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

const ManageGuides: React.FC = () => {
    const [guides, setGuides] = useState<StudyGuide[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGuides = () => {
        setIsLoading(true);
        setTimeout(() => {
            setGuides(allStudyGuides);
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchGuides();
    }, []);

    const handleDelete = (guideId: string) => {
         if (window.confirm('Are you sure you want to delete this study guide? This is a frontend-only demo action.')) {
            setGuides(prevGuides => prevGuides.filter(g => g.id !== guideId));
            alert('Guide deleted from view. (Demo only)');
        }
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Study Guides ({guides.length})</h2>
                <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent">Add New Guide</button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Title</th>
                            <th className="p-4 font-semibold text-slate-600">Subject</th>
                            <th className="p-4 font-semibold text-slate-600">Created At</th>
                            <th className="p-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                         {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading guides...</td></tr>
                        ) : (
                            guides.map(guide => (
                                <tr key={guide.id} className="border-b last:border-b-0">
                                    <td className="p-4 font-medium text-slate-800">{guide.title}</td>
                                    <td className="p-4 text-slate-600">{guide.subject}</td>
                                    <td className="p-4 text-slate-600">{guide.createdAt}</td>
                                    <td className="p-4 flex gap-2">
                                        <button className="font-semibold text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(guide.id)} className="font-semibold text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}


export default ManageContent;