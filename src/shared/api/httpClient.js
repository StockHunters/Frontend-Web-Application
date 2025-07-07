import axios from 'axios';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // ej. "https://localhost:5001/api/v1"
    timeout: 50000,
    headers: { 'Content-Type': 'application/json' }
});

http.interceptors.request.use(
    config => {
        const isAuthEndpoint = /\/authentication\/sign-in$/i.test(config.url ?? '');

        if (!isAuthEndpoint) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    error => Promise.reject(error)
);
