import axios from "axios";
import Cookies from 'js-cookie';

// Access environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create Axios instance
const axiosHandler = axios.create({ baseURL: API_URL });

// Add a request interceptor
axiosHandler.interceptors.request.use(
    config => {
        // Get the latest access token from cookies and add it to the Authorization header
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosHandler;