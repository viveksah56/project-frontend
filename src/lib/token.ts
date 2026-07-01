/**
 * Token Management Utility
 * Handles secure storage and retrieval of JWT tokens with refresh logic
 */

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Store tokens securely in httpOnly cookies via document.cookie
 */
export function setTokens(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean = false
): void {
  const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 24 hours

  // Store in secure cookies only
  document.cookie = `${TOKEN_KEY}=${accessToken}; path=/; max-age=${maxAge}; SameSite=Strict; Secure`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Strict; Secure`;
}

/**
 * Retrieve access token from cookies
 */
export function getAccessToken(): string | null {
  return getCookieValue(TOKEN_KEY);
}

/**
 * Retrieve refresh token from cookies
 */
export function getRefreshToken(): string | null {
  return getCookieValue(REFRESH_TOKEN_KEY);
}

/**
 * Get token pair for API calls
 */
export function getTokens(): TokenPair | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

/**
 * Clear all tokens from cookies
 */
export function clearTokens(): void {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0`;
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

/**
 * Get cookie value by name
 */
function getCookieValue(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
