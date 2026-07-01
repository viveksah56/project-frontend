# RBAC Authentication Implementation Guide

## Overview
This project implements professional Role-Based Access Control (RBAC) authentication using:
- **js-cookie** for secure token management
- **Next.js 16 Proxy** (middleware) for route protection
- **React Context** for auth state management
- **Axios Interceptors** for automatic token injection and refresh

## Authentication Flow

### 1. Login Process
```
User Login (Email/Google)
    ↓
Backend Auth Endpoint
    ↓
Response: { success, message, role, tokens: { accessToken, refreshToken } }
    ↓
Store Tokens (js-cookie)
    ↓
Update Auth Context
    ↓
Redirect to Role-Based Dashboard
```

### 2. Token Storage (js-cookie)
Tokens are stored as secure cookies with the following keys:
- `_token`: Access Token (expires: 1 day or 7 days if "Remember me")
- `_refreshToken`: Refresh Token (same expiration)
- `_role`: User Role (admin/professional/user)

Cookie Settings:
```javascript
{
  secure: true,      // HTTPS only
  sameSite: "strict" // CSRF protection
}
```

## Components

### Token Utility (`src/lib/token.ts`)
```typescript
// Store tokens
setToken(
  { accessToken: string, refreshToken: string },
  role: UserRole,
  rememberMe: boolean = false
)

// Retrieve tokens
getToken()          // Returns TokenPair
getAccessToken()    // Returns access token only
getRole()          // Returns user role
hasTokens()        // Check if tokens exist
clearTokens()      // Clear all tokens
```

### Auth Context (`src/context/auth.context.tsx`)
Provides authentication state across the app:
```typescript
const { user, isAuthenticated, setUser, logout, hasRole } = useAuth()

// Check user role
if (useAuth().hasRole('admin')) { /* admin only */ }
if (useAuth().hasRole(['admin', 'professional'])) { /* multi-role */ }
```

### Proxy/Middleware (`src/proxy.ts`)
Route protection with automatic redirects:
- Public routes: `/auth/login`, `/auth/register`, `/`
- Protected routes: `/dashboard/*`, `/settings`, `/profile`
- Role-based access: Each role can only access their dashboard

### API Interceptor (`src/lib/api-interceptor.ts`)
Axios instance with automatic token injection:
1. Injects `Authorization: Bearer {token}` on all requests
2. Handles 401 responses with automatic token refresh
3. Queues requests during token refresh
4. Redirects to login on refresh failure

## Usage Examples

### Login Form
```typescript
const handleLogin = async (email: string, password: string) => {
  const response = await authService.login({ email, password });
  const { role, tokens } = response.data;
  
  // Store tokens and role
  setToken(
    { 
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken 
    },
    role as UserRole,
    rememberMe
  );
  
  // Redirect based on role
  router.push(getRoleRoute(role)); // /dashboard/admin, /dashboard/professional, etc.
};
```

### Protected Components
```typescript
import { useAuth } from "@/context/auth.context";

export function AdminPanel() {
  const { user, hasRole } = useAuth();
  
  if (!hasRole("admin")) {
    return <div>Unauthorized</div>;
  }
  
  return <div>Admin Dashboard for {user?.email}</div>;
}
```

### API Calls
```typescript
import api from "@/lib/api-interceptor";

// Token is automatically injected
const response = await api.get("/api/protected-endpoint");

// On 401, token is automatically refreshed
// Failed refresh redirects to login
```

## Role Dashboards

### Admin Dashboard
- Route: `/dashboard/admin`
- Access: Admin users only
- Features: System analytics, user management, security controls

### Professional Dashboard
- Route: `/dashboard/professional`
- Access: Professional users only
- Features: Projects, earnings, ratings

### User Dashboard
- Route: `/dashboard/user`
- Access: Standard users only
- Features: Profile, quick actions

## Logout Flow
```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout(); // Clears user state and all cookies
  router.push("/auth/login");
};
```

## Security Features

✅ **Secure Token Storage**
- js-cookie with secure and sameSite flags
- No localStorage usage

✅ **Automatic Token Refresh**
- Intercepts 401 responses
- Silently refreshes before expiration
- Request queuing during refresh

✅ **CSRF Protection**
- SameSite=Strict cookies
- Prevents token theft

✅ **Route Protection**
- Server-side proxy validation
- Role-based access control
- Automatic redirects for unauthorized access

✅ **Secure Headers**
- Authorization: Bearer {token}
- Content-Type validation

## Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-api.com
```

## Troubleshooting

### Tokens Not Persisting
- Check browser console for cookie errors
- Verify `secure: true` only works on HTTPS
- Check sameSite cookie policy

### 401 After Login
- Verify token refresh endpoint returns correct format
- Check token expiration times
- Ensure refreshToken is valid

### Role-Based Redirect Not Working
- Verify role value matches UserRole type (admin/professional/user)
- Check proxy.ts route configuration
- Verify cookie is being set correctly

## Testing

```typescript
// Test token storage
import { setToken, getToken, getRole } from "@/lib/token";

const tokens = { accessToken: "...", refreshToken: "..." };
setToken(tokens, "professional");

console.log(getToken()); // Should return tokens
console.log(getRole()); // Should return "professional"
```
