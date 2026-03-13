import axios from "axios";

// Get base URL from environment variable, fallback to local if not set
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export { baseURL };

console.log('Mobile Debug: API URL is', baseURL);

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach tokens and debug network errors
api.interceptors.request.use(config => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    console.log('Mobile Debug: Starting Request', config.method, config.url);
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('Mobile Debug: API Error', error.message);
        if (error.response) {
            console.error('Mobile Debug: API Status', error.response.status);
            console.error('Mobile Debug: API Data', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default api;
