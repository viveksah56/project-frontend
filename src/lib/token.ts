import Cookies from "js-cookie";


export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export const TOKEN_KEY = '_token';
export const REFRESH_TOKEN_KEY = '_refreshToken';


export const setToken = (tokenPair: TokenPair) => {
    Cookies.set(TOKEN_KEY, tokenPair.accessToken);
    Cookies.set(REFRESH_TOKEN_KEY, tokenPair.refreshToken);
};

export const getToken = (): TokenPair | null => {
    const accessToken = Cookies.get(TOKEN_KEY);
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

    if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
    }
    return null;
}