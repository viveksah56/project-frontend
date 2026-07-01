/**
 * useApi Hook
 * Provides pre-configured axios instance with automatic token injection
 */

import { useCallback } from "react";
import api from "@/lib/api-interceptor";
import { AxiosRequestConfig, AxiosResponse } from "axios";

interface UseApiReturn {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
}

export function useApi(): UseApiReturn {
  const get = useCallback(async <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.get<T>(url, config);
  }, []);

  const post = useCallback(async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.post<T>(url, data, config);
  }, []);

  const put = useCallback(async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.put<T>(url, data, config);
  }, []);

  const patch = useCallback(async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.patch<T>(url, data, config);
  }, []);

  const deleteReq = useCallback(async <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.delete<T>(url, config);
  }, []);

  return {
    get,
    post,
    put,
    patch,
    delete: deleteReq,
  };
}
