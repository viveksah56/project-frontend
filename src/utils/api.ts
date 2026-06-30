import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

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
        console.log('Request initiated from:', config.url);
        return config;
    },
    (error) =>{
        console.error('Request failed from axiosInstance:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log('Response received from axiosInstance:', response);
        return response;
    },
    (error:any) => {
        console.error('Request failed from axiosInstance:', error.response?.data || error.message);
        const errorFormat=error.response?.data || error.message;
        return Promise.reject(errorFormat);
    }
);

export default axiosInstance;