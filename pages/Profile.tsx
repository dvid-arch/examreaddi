import React, { useState, useEffect } from 'react';
import Card from '../components/Card.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user, updateUser, logout, requestUpgrade, isLoading } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const handleSave = async () => {
        if (name.trim() === '') return;
        if(updateUser) {
            await updateUser({ name });
        }
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/dashboard');
    };

    if (isLoading) {
        return <Card><p className="p-8">Loading profile...</p></Card>;
    }

    if (!user) {
        return <Card><p className="p-8">Please log in to view your profile.</p></Card>;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const messagesUsedToday = user.lastMessageDate === today ? user.dailyMessageCount : 0;
    const freeMessagesRemaining = Math.max(0, 5 - messagesUsedToday);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-4 pt-4">
                <img
                    src="https://picsum.photos/128"
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary dark:border-accent shadow-lg"
                />
                {!isEditing ? (
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{user.name}</h1>
                        <button onClick={() => setIsEditing(true)} className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors" aria-label="Edit name">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z" /></svg>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className="text-3xl font-bold text-center bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                            autoFocus
                        />
                        <button onClick={handleSave} className="bg-primary text-white font-bold p-2 rounded-lg hover:bg-accent" aria-label="Save name">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                    </div>
                )}
                <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Subscription Details</h2>
                    <div className="space-y-3">
                        <p className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Plan:</span>
                            <span className="font-semibold text-primary dark:text-accent capitalize">{user.subscription}</span>
                        </p>
                        {user.subscription === 'free' ? (
                            <button
                                onClick={() => requestUpgrade({
                                    title: "Upgrade to ExamRedi Pro",
                                    message: "Unlock your full potential and get the best results with our premium features.",
                                    featureList: [
                                        "Unlimited Practice Questions", "Unlimited AI Tutor Access", "Generate Custom Study Guides",
                                        "Save All Results & Track Performance", "Compete on the UTME Challenge Leaderboard"
                                    ]
                                })}
                                className="w-full mt-4 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Upgrade to Pro
                            </button>
                        ) : (
                           <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4 border-t dark:border-slate-700">You have access to all premium features!</p>
                        )}
                    </div>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Usage Stats</h2>
                    <div className="space-y-3">
                         <p className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">AI Credits:</span>
                            <span className="font-semibold text-primary dark:text-accent">{user.aiCredits}</span>
                        </p>
                         <p className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">AI Tutor Messages Today:</span>
                            <span className="font-semibold text-primary dark:text-accent">{user.subscription === 'pro' ? 'Unlimited' : `${freeMessagesRemaining} remaining`}</span>
                        </p>
                    </div>
                </Card>
            </div>
             <Card>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Account Actions</h2>
                <button onClick={handleLogout} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                    Logout
                </button>
             </Card>
        </div>
    );
};
export default Profile;