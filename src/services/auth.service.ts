import { httpService } from "@/services/http.service";
import { AxiosError } from "axios";

interface LoginResponse {
    success: boolean;
    message?: string;
    data?: any;
}

interface AuthError {
    status?: number;
    message: string;
    code?: string;
}

class AuthService {
    private handleError(error: unknown): AuthError {
        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "An authentication error occurred";
            const code = error.response?.data?.code || "AUTH_ERROR";

            return { status, message, code };
        }

        if (error instanceof Error) {
            return {
                status: 500,
                message: error.message,
                code: "UNKNOWN_ERROR",
            };
        }

        return {
            status: 500,
            message: "An unexpected error occurred",
            code: "UNEXPECTED_ERROR",
        };
    }

    async login(data: any): Promise<LoginResponse> {
        try {
            const response = await httpService.postRequest<LoginResponse>({
                url: "/auth/login",
                data,
            });
            return response;
        } catch (error: unknown) {
            const authError = this.handleError(error);
            console.error(
                `[AuthService] Login failed (${authError.code}):`,
                authError.message,
                { status: authError.status }
            );
            throw authError;
        }
    }
}

const authService = new AuthService();
export default authService;
