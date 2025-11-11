import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal, { AuthDetails } from '../components/AuthModal.tsx';
import UpgradeModal, { UpgradeRequest } from '../components/UpgradeModal.tsx';
import { User } from '../types.ts';
// import apiService from '../services/apiService.ts'; // Backend connection disabled

// The User type from backend might be slightly different.
// The backend returns this from /profile
export interface UserProfile extends User {
    id: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserProfile | null;
    login: (details: AuthDetails) => Promise<void>;
    register: (details: AuthDetails) => Promise<void>;
    logout: () => void;
    requestLogin: () => void;
    requestUpgrade: (request: UpgradeRequest) => void;
    upgradeToPro: () => void;
    updateUser: (details: Partial<UserProfile>) => Promise<void>;
    useAiCredit: () => Promise<void>;
    incrementMessageCount: () => Promise<{ success: boolean; remaining: number }>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- MOCK DATA FOR DEMO MODE ---
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const MOCK_ADMIN_USER: UserProfile = {
    id: 'admin-user-001',
    name: 'Admin User',
    email: 'admin@examredi.com',
    subscription: 'pro',
    aiCredits: 999,
    dailyMessageCount: 0,
    lastMessageDate: getTodayDateString(),
    role: 'admin',
};

const MOCK_PRO_USER: UserProfile = {
    id: 'pro-user-123',
    name: 'Pro User',
    email: 'pro@examredi.com',
    subscription: 'pro',
    aiCredits: 10,
    dailyMessageCount: 0,
    lastMessageDate: getTodayDateString(),
    role: 'user',
};

const MOCK_FREE_USER: UserProfile = {
    id: 'free-user-456',
    name: 'Free User',
    email: 'free@examredi.com',
    subscription: 'free',
    aiCredits: 0,
    dailyMessageCount: 0,
    lastMessageDate: getTodayDateString(),
    role: 'user',
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [upgradeRequest, setUpgradeRequest] = useState<UpgradeRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Check for persisted user in localStorage on initial load
    useEffect(() => {
        setIsLoading(true);
        try {
            const savedUser = localStorage.getItem('examRediUser');
            if (savedUser) {
                const parsedUser: UserProfile = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('examRediUser');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (details: AuthDetails) => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(res => setTimeout(res, 500));
        
        let userToLogin: UserProfile;
        
        const email = details.email.toLowerCase();

        if (email === MOCK_ADMIN_USER.email) {
            userToLogin = MOCK_ADMIN_USER;
        } else if (email === MOCK_PRO_USER.email) {
            userToLogin = MOCK_PRO_USER;
        } else {
            // For any other email, log in as a generic free user
            userToLogin = {
                ...MOCK_FREE_USER,
                id: `user-${Date.now()}`,
                name: 'Student', // A generic name
                email: details.email,
            };
        }
        
        setUser(userToLogin);
        setIsAuthenticated(true);
        localStorage.setItem('examRediUser', JSON.stringify(userToLogin));
        setIsAuthModalOpen(false);
        setIsLoading(false);

        if (userToLogin.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const register = async (details: AuthDetails) => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(res => setTimeout(res, 500));

        const newUser: UserProfile = {
            id: `user-${Date.now()}`,
            name: details.name || 'New User',
            email: details.email,
            subscription: 'free',
            aiCredits: 0,
            dailyMessageCount: 0,
            lastMessageDate: getTodayDateString(),
            role: 'user',
        };

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('examRediUser', JSON.stringify(newUser));
        setIsAuthModalOpen(false);
        setIsLoading(false);
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('examRediUser');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/dashboard');
    };
    
    const requestLogin = () => {
        setIsAuthModalOpen(true);
    };

    const requestUpgrade = (request: UpgradeRequest) => {
        setUpgradeRequest(request);
        setIsUpgradeModalOpen(true);
    };
    
    const upgradeToPro = () => {
        if (user) {
            const upgradedUser = {
                ...user,
                subscription: 'pro' as const,
                aiCredits: 10, // Award credits on upgrade
            };
            setUser(upgradedUser);
            localStorage.setItem('examRediUser', JSON.stringify(upgradedUser));
            setIsUpgradeModalOpen(false);
        }
    };

    const updateUser = async (details: Partial<UserProfile>) => {
        if (user) {
            const updatedUser = { ...user, ...details };
            setUser(updatedUser);
            localStorage.setItem('examRediUser', JSON.stringify(updatedUser));
        }
    };

    const useAiCredit = async () => {
        if (user && user.subscription === 'pro' && user.aiCredits > 0) {
            const updatedUser = { ...user, aiCredits: user.aiCredits - 1 };
            setUser(updatedUser);
            localStorage.setItem('examRediUser', JSON.stringify(updatedUser));
        }
    };
    
    const incrementMessageCount = async (): Promise<{ success: boolean; remaining: number }> => {
        if (!user) return { success: false, remaining: 0 };
        if (user.subscription === 'pro') return { success: true, remaining: Infinity };

        const today = getTodayDateString();
        let currentCount = user.dailyMessageCount;
        
        // Reset count if it's a new day
        if (user.lastMessageDate !== today) {
            currentCount = 0;
        }

        const FREE_TIER_MESSAGES = 5;
        if (currentCount >= FREE_TIER_MESSAGES) {
            return { success: false, remaining: 0 };
        }

        const updatedUser = { 
            ...user, 
            dailyMessageCount: currentCount + 1,
            lastMessageDate: today 
        };
        setUser(updatedUser);
        localStorage.setItem('examRediUser', JSON.stringify(updatedUser));

        return { success: true, remaining: FREE_TIER_MESSAGES - (currentCount + 1) };
    };

    const value = { isAuthenticated, user, login, register, logout, requestLogin, requestUpgrade, upgradeToPro, updateUser, useAiCredit, incrementMessageCount, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {children}
            {!isLoading && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}
            <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} request={upgradeRequest} />
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
