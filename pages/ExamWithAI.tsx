
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAI } from '../services/geminiService.ts';
import { ChatMessage } from '../types.ts';
import Card from '../components/Card.tsx';
import MarkdownRenderer from '../components/MarkdownRenderer.tsx';

// --- ICONS ---
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const PracticeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const UserIcon = () => (
    <img src="https://picsum.photos/40" alt="user" className="w-8 h-8 rounded-full object-cover" />
);

const AiIcon = () => (
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    </div>
);

const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const suggestivePrompts = [
    "Explain photosynthesis",
    "Practice questions on English Tenses",
    "Summarize Newton's Laws of Motion",
    "Create a study plan for Chemistry",
];

const CHAT_HISTORY_KEY = 'aiBuddyChatHistory';


const ExamWithAI: React.FC = () => {
    const [mode, setMode] = useState<'selection' | 'practice_form' | 'chat'>('selection');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [showPrompts, setShowPrompts] = useState(false);

    // Load chat history from localStorage on initial render
    useEffect(() => {
        const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
        if (savedMessages) {
            try {
                const parsedMessages: ChatMessage[] = JSON.parse(savedMessages);
                if (parsedMessages.length > 0) {
                    setMessages(parsedMessages);
                    setMode('chat');
                    setShowPrompts(false);
                }
            } catch (error) {
                console.error("Failed to parse chat history from localStorage", error);
                localStorage.removeItem(CHAT_HISTORY_KEY);
            }
        }
    }, []);

    // Scroll to the bottom of the chat on new messages
    useEffect(() => {
        if (mode === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, mode]);

    // Save chat history to localStorage whenever it changes
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        } else {
            localStorage.removeItem(CHAT_HISTORY_KEY);
        }
    }, [messages]);


    const handleStartChat = () => {
        setMessages([
            { role: 'model', text: 'Hello! I am your AI-buddy. How can I help you prepare for your exams today?', timestamp: Date.now() }
        ]);
        setShowPrompts(true);
        setMode('chat');
    };

    const handleStartPracticeSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !topic.trim()) {
            alert('Please provide both a subject and a topic.');
            return;
        }
        const initialPrompt = `Let's start a practice session on the topic of "${topic}" in the subject "${subject}". Please generate the first practice question for me.`;
        setMode('chat');
        setIsLoading(true);
        setMessages([]);
        setShowPrompts(false);
        try {
            const aiResponse = await sendMessageToAI(initialPrompt, []);
            setMessages([{ role: 'model', text: aiResponse, timestamp: Date.now() }]);
        } catch (error) {
            console.error(error);
            setMessages([{ role: 'model', text: 'Sorry, I encountered an error while setting up the practice session. Please try again.', timestamp: Date.now() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendUserMessageToAI = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;
        setShowPrompts(false);
        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: messageText, timestamp: Date.now() }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const aiResponse = await sendMessageToAI(messageText, messages);
            setMessages([...newMessages, { role: 'model', text: aiResponse, timestamp: Date.now() }]);
        } catch (error) {
            console.error(error);
            setMessages([...newMessages, { role: 'model', text: 'Sorry, I encountered an error. Please try again.', timestamp: Date.now() }]);
        } finally {
            setIsLoading(false);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'; // Reset height after sending
            }
        }
    };
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        sendUserMessageToAI(userInput);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as unknown as React.FormEvent);
        }
    };

    const autoResizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };
    
    const handlePromptClick = (prompt: string) => {
        sendUserMessageToAI(prompt);
    };

    const handleNewSession = () => {
        setMessages([]);
        setUserInput('');
        setSubject('');
        setTopic('');
        setShowPrompts(false);
        setMode('selection');
        localStorage.removeItem(CHAT_HISTORY_KEY);
    };

    if (mode === 'selection') {
        return (
            <Card>
                <div className="text-center p-4">
                    <h1 className="text-2xl font-bold text-slate-800">Exam With AI-buddy</h1>
                    <p className="text-slate-600 mt-2 mb-8">Choose how you'd like to prepare for your exam.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button onClick={handleStartChat} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center">
                            <ChatIcon />
                            <h2 className="font-bold text-lg text-slate-800">Open Chat</h2>
                            <p className="text-sm text-slate-600 mt-1">Have a general conversation or ask specific questions.</p>
                        </button>
                        <button onClick={() => setMode('practice_form')} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center">
                            <PracticeIcon />
                            <h2 className="font-bold text-lg text-slate-800">Practice Mode</h2>
                            <p className="text-sm text-slate-600 mt-1">Get tailored practice questions on a specific topic.</p>
                        </button>
                    </div>
                </div>
            </Card>
        );
    }

    if (mode === 'practice_form') {
        return (
            <Card>
                <form onSubmit={handleStartPracticeSession} className="space-y-6 p-4">
                    <h2 className="text-2xl font-bold text-slate-800">Setup Practice Session</h2>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Physics" className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                        <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Newtonian Mechanics" className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div className="flex items-center justify-end gap-4 pt-2">
                        <button type="button" onClick={() => setMode('selection')} className="font-semibold text-slate-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition">Back</button>
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">Start Practice</button>
                    </div>
                </form>
            </Card>
        );
    }
    
    return (
        <div className="flex flex-col bg-white rounded-2xl shadow-sm h-full max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-160px)]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Exam With AI-buddy</h1>
                    <p className="text-sm text-slate-600">Your personal AI tutor for exam preparation.</p>
                </div>
                <button onClick={handleNewSession} className="font-semibold text-primary py-2 px-4 rounded-lg border border-primary hover:bg-primary-light transition-colors duration-200 text-sm">New Session</button>
            </div>
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <AiIcon />}
                        <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                           <div className={`max-w-xs sm:max-w-md lg:max-w-2xl p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-gray-100 text-slate-800 rounded-bl-lg'}`}>
                                {msg.role === 'model' ? (
                                    <MarkdownRenderer content={msg.text} />
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                )}
                           </div>
                           <span className="text-xs text-gray-400 mt-1.5 px-1">{formatTimestamp(msg.timestamp)}</span>
                        </div>
                         {msg.role === 'user' && <UserIcon />}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <AiIcon />
                        <div className="p-4 rounded-2xl rounded-bl-lg bg-gray-100 text-slate-800">
                           <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-gray-200 bg-white mt-auto flex-shrink-0">
                 {showPrompts && !isLoading && messages.length <= 1 && (
                    <div className="pb-3">
                        <p className="text-xs font-semibold text-slate-500 mb-2 px-1">Try one of these prompts:</p>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {suggestivePrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePromptClick(prompt)}
                                    className="bg-gray-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                    <textarea
                        ref={textareaRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onInput={autoResizeTextarea}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        placeholder="Ask your AI-buddy anything..."
                        className="flex-1 bg-gray-100 border-gray-200 rounded-xl py-2 px-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary max-h-40 overflow-y-auto"
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userInput.trim()}
                        className="bg-primary text-white font-bold p-3 rounded-lg hover:bg-accent transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
                        aria-label="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExamWithAI;