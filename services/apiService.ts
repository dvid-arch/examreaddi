import { API_BASE_URL } from '../config.ts';

const getToken = () => localStorage.getItem('authToken');

interface RequestOptions extends RequestInit {
    body?: any;
    useAuth?: boolean;
}

const apiService = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const { method = 'GET', body, headers = {}, useAuth = true } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (useAuth) {
        const token = getToken();
        if (token) {
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
    }

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    const responseData = await response.json().catch(() => ({ message: response.statusText }));

    if (!response.ok) {
        throw new Error(responseData.message || 'An API error occurred');
    }
    
    return responseData as T;
};

export default apiService;
