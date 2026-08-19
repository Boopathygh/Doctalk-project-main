import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api`;


export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkSymptoms = async (data) => {
    try {
        const response = await api.post('/symptom-check/', data);
        return response.data;
    } catch (error) {
        console.error("Error checking symptoms", error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    return api.post('/register/', userData);
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/token/', credentials);
        // Store tokens
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            // Setup default header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
};

export const getProfile = async () => {
    return api.get('/profile/');
};


export const updateProfile = async (data) => {
    return api.patch('/profile/', data);
};

export const chatWithBot = async (message) => {
    try {
        const response = await api.post('/chat/', { message });
        return response.data;
    } catch (error) {
        console.error("Error chatting with bot", error);
        throw error;
    }
};
