import axios from "axios";

// Get base URL from environment variable, fallback to local if not set
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('Mobile Debug: API URL is', baseURL);

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to debug network errors on mobile
api.interceptors.request.use(request => {
    console.log('Mobile Debug: Starting Request', request.method, request.url);
    return request;
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
