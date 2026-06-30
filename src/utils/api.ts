import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
    timeoutErrorMessage: 'Request timed out',
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log(`[API] ${config.method?.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Request configuration error';
        console.error('[API] Request setup failed:', message);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(
            `[API] Response received: ${response.status} from ${response.config.url}`
        );
        return response;
    },
    (error: unknown) => {
        if (error instanceof Error) {
            console.error('[API] Response error:', error.message);
        } else {
            console.error('[API] Response error: Unknown error occurred');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
