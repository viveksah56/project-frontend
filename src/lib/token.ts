/**
 * Token Management Utility using js-cookie
 * Handles secure storage and retrieval of JWT tokens with RBAC support
 */

import Cookies from "js-cookie";

export type UserRole = "admin" | "professional" | "user";

export const TOKEN_KEY = "_token";
export const REFRESH_TOKEN_KEY = "_refreshToken";
export const ROLE_KEY = "_role";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Store tokens and role securely using js-cookie
 */
export function setToken(tokenPair: TokenPair, role?: UserRole, rememberMe: boolean = false): void {
  const expires = rememberMe ? 7 : 1; // 7 days or 1 day

  Cookies.set(TOKEN_KEY, tokenPair.accessToken, {
    expires,
    secure: true,
    sameSite: "strict",
  });

  Cookies.set(REFRESH_TOKEN_KEY, tokenPair.refreshToken, {
    expires,
    secure: true,
    sameSite: "strict",
  });

  if (role) {
    Cookies.set(ROLE_KEY, role, {
      expires,
      secure: true,
      sameSite: "strict",
    });
  }
}

/**
 * Retrieve access token from cookies
 */
export function getAccessToken(): string | null {
  return Cookies.get(TOKEN_KEY) || null;
}

/**
 * Retrieve refresh token from cookies
 */
export function getRefreshToken(): string | null {
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
}

/**
 * Get token pair for API calls
 */
export function getToken(): TokenPair | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

/**
 * Get user role from cookies
 */
export function getRole(): UserRole | null {
  return (Cookies.get(ROLE_KEY) as UserRole) || null;
}

/**
 * Clear all tokens from cookies
 */
export function clearTokens(): void {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}

/**
 * Check if tokens exist
 */
export function hasTokens(): boolean {
  return !!(getAccessToken() && getRefreshToken());
}

/**
 * Parse JWT token payload (without verification - for client-side use only)
 */
export function parseToken(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("[v0] Failed to parse token:", error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseToken(token);
  if (!payload || !payload.exp) return true;

  const expirationTime = payload.exp * 1000; // Convert to milliseconds
  return Date.now() >= expirationTime;
}
