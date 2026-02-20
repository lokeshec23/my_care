import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('mycare_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('mycare_token');
            localStorage.removeItem('mycare_user');
            // We don't redirect here, we let the AuthContext handle the state change
        }
        return Promise.reject(error);
    }
);

export default api;
