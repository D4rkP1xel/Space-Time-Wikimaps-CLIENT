import axios from "axios"
import Cookies from 'js-cookie'

// Access environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL

// Create Axios instance
const axiosHandler = axios.create({ baseURL: API_URL })

// Add a request interceptor
axiosHandler.interceptors.request.use(
    config => {
        // Get the latest access token from cookies and add it to the Authorization header
        const accessToken = Cookies.get('accessToken')
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axiosHandler.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        // Check if the error is due to an expired JWT
        if (error.response && error.response.status === 401 && error.response.data === 'JWT expired') {
            try {
                // Get the refresh token from cookies
                const refreshToken = Cookies.get('refreshToken');

                // Make a request to refresh the token
                const { data } = await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken }, {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`
                    }
                });

                // Update cookies with the new access token
                Cookies.set('accessToken', data.token);

                // Update the Authorization header with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

                // Retry the original request with the new access token
                return axiosHandler(originalRequest);
            } catch (refreshError) {
                // If refreshing the token fails, reject with the refresh error
                return Promise.reject(refreshError);
            }
        }

        // If the error is not a 401 or not due to an expired JWT, reject with the original error
        return Promise.reject(error);
    }
)

export default axiosHandler