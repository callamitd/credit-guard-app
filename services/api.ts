import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your machine's IP address if running on a physical device or different emulator configuration
// For Android Emulator, 10.0.2.2 is usually the host machine
// For iOS Simulator, localhost works
const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const sendOtp = async (mobile: string) => {
    const response = await api.post('/auth/send-otp', { mobile });
    return response.data;
};

export const verifyOtp = async (mobile: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { mobile, otp });
    return response.data;
};

export const registerRetailer = async (data: any) => {
    // If there's a photo, we might need to handle it as FormData or base64
    // For now assuming JSON for simplicity, but usually file uploads need FormData
    // If the backend expects FormData for the photo, we'll need to adjust.
    // Based on previous context, let's assume standard JSON for data and maybe a separate upload or base64.
    // If the backend was removed, I can't check it. I'll implement as JSON for now.
    const response = await api.post('/retailers', data);
    return response.data;
};

export const issueGoods = async (data: any) => {
    const response = await api.post('/transactions/issue', data);
    return response.data;
};

export const recordRepayment = async (data: any) => {
    const response = await api.post('/transactions/repayment', data);
    return response.data;
};

export const searchRetailers = async (query: string) => {
    const response = await api.get(`/retailers?query=${query}`);
    return response.data;
};

export const getRetailer = async (id: string) => {
    const response = await api.get(`/retailers/${id}`);
    return response.data;
};

export const getRetailerTransactions = async (id: string) => {
    const response = await api.get(`/transactions/retailer/${id}`);
    return response.data;
};

export const getRetailers = async () => {
    const response = await api.get('/retailers');
    return response.data;
};

export const createFlag = async (data: any) => {
    const response = await api.post('/flags', data);
    return response.data;
};

export const getFlags = async () => {
    const response = await api.get('/flags');
    return response.data;
};

export const updateFlagStatus = async (id: string, status: string) => {
    const response = await api.patch(`/flags/${id}`, { status });
    return response.data;
};

export const searchRetailerByFace = async (image: string) => {
    const response = await api.post('/retailers/search/face', { image });
    return response.data;
};

export default api;
