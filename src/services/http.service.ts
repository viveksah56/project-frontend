import Cookies from "js-cookie";

import axiosInstance from "@/utils/api";
import { AxiosRequestConfig } from "axios";
import {TOKEN_KEY} from "@/lib/token";

interface HeaderConfigProps {
    auth?: boolean;
    file?: boolean;
    params?: Record<string, any>;
    customHeaders?: Record<string, string>;
    timeout?: number;
}

interface RequestProps<T = any> {
    url: string;
    data?: T;
    config?: HeaderConfigProps;
}

class HttpService {
    private getHeaders(config?: HeaderConfigProps): Record<string, string> {
        const headers: Record<string, string> = { ...config?.customHeaders };

        if (config?.auth) {
            const token = Cookies.get(TOKEN_KEY);
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }

        if (config?.file) {
            headers["Content-Type"] = "multipart/form-data";
        }

        return headers;
    }

    private buildAxiosConfig(config?: HeaderConfigProps): AxiosRequestConfig {
        return {
            headers: this.getHeaders(config),
            params: config?.params,
            timeout: config?.timeout,
        };
    }

    async postRequest<TResponse = any, TBody = any>({
                                                        url,
                                                        data,
                                                        config,
                                                    }: RequestProps<TBody>): Promise<TResponse> {
        try {
            const axiosConfig = this.buildAxiosConfig(config);
            const response = await axiosInstance.post<TResponse>(url, data, axiosConfig);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export const httpService = new HttpService();