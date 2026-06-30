import {httpService} from "@/services/http.service";


class AuthService {
    async login(data: any): Promise<any> {
        try {
            const response = await httpService.postRequest({
                url: "/auth/login",
                data,
            });
            return response;
        } catch (error:any) {
            console.error("Full Backend Error Details:", error.response?.data || error.message);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;