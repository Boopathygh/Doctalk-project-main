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

export const chatWithBot = async (message) => {
    try {
        const response = await api.post('/chat/', { message });
        return response.data;
    } catch (error) {
        console.error("Error chatting with bot", error);
        throw error;
    }
};
