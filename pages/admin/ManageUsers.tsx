import React, { useState, useEffect } from 'react';
import Card from '../../components/Card.tsx';

// In a real app, this would be defined in a shared types file.
interface AdminUser {
    id: string;
    name: string;
    email: string;
    subscription: 'free' | 'pro';
    role: 'user' | 'admin';
}

const FAKE_USERS: AdminUser[] = [
    { id: 'admin-user-001', name: 'Admin User', email: 'admin@examredi.com', subscription: 'pro', role: 'admin' },
    { id: 'pro-user-123', name: 'Pro User', email: 'pro@examredi.com', subscription: 'pro', role: 'user' },
    { id: 'free-user-456', name: 'Free User', email: 'free@examredi.com', subscription: 'free', role: 'user' },
];

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulating API call to fetch users
        const fetchUsers = () => {
            setIsLoading(true);
            setTimeout(() => {
                setUsers(FAKE_USERS);
                setIsLoading(false);
            }, 500);
        };
        fetchUsers();
    }, []);
    
    const handleSubscriptionChange = async (userId: string, newSubscription: 'free' | 'pro') => {
        // In a real app, this would be a PATCH/PUT request to the backend.
        // For the demo, we just update local state.
        setUsers(users.map(user => 
            user.id === userId ? { ...user, subscription: newSubscription } : user
        ));
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Manage Users</h1>
            <Card>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Name</th>
                                <th className="p-4 font-semibold text-slate-600">Email</th>
                                <th className="p-4 font-semibold text-slate-600">Role</th>
                                <th className="p-4 font-semibold text-slate-600 text-center">Pro Access</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center p-8">Loading users...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={4} className="text-center p-8 text-red-500">{error}</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="border-b last:border-b-0">
                                        <td className="p-4 font-medium text-slate-800">{user.name}</td>
                                        <td className="p-4 text-slate-600">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.role !== 'admin' ? (
                                                <label htmlFor={`pro-toggle-${user.id}`} className="relative inline-flex items-center cursor-pointer">
                                                  <input 
                                                    type="checkbox" 
                                                    id={`pro-toggle-${user.id}`}
                                                    className="sr-only peer" 
                                                    checked={user.subscription === 'pro'}
                                                    onChange={(e) => handleSubscriptionChange(user.id, e.target.checked ? 'pro' : 'free')}
                                                  />
                                                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            ) : (
                                                <span className="text-sm font-semibold text-slate-500">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ManageUsers;
