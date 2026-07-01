import {httpService} from "@/services/http.service";


class AuthService {
    async login(data: any): Promise<any> {
        return await httpService.postRequest({
            url: "/auth/login",
            data,
        });
    }

    async loginWithGoogle(tokenId: string): Promise<any> {
        return await httpService.postRequest({
            url: "/auth/google",
            data: { idToken: tokenId },
        });
    }
}

const authService = new AuthService();
export default authService;