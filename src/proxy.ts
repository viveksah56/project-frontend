import { NextRequest, NextResponse } from "next/server";

export type UserRole = "admin" | "professional" | "user";

interface RouteConfig {
  public: string[];
  protected: string[];
  roleRoutes: Record<UserRole, string[]>;
}

const routeConfig: RouteConfig = {
  public: ["/auth/login", "/auth/register", "/auth/forgot-password", "/"],
  protected: ["/dashboard", "/settings", "/profile"],
  roleRoutes: {
    admin: ["/dashboard/admin", "/admin"],
    professional: ["/dashboard/professional", "/professional"],
    user: ["/dashboard/user", "/user"],
  },
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("userRole")?.value as UserRole | undefined;

  // Allow public routes
  const isPublicRoute = routeConfig.public.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  if (isPublicRoute) {
    // Redirect authenticated users away from auth pages
    if (token && pathname.startsWith("/auth/")) {
      const dashboardUrl = getDashboardByRole(userRole);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Role-based route protection
  if (!isAuthorizedRoute(pathname, userRole)) {
    const dashboardUrl = getDashboardByRole(userRole);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  return NextResponse.next();
}

function isAuthorizedRoute(pathname: string, userRole: UserRole | undefined): boolean {
  if (!userRole) return false;

  const authorizedRoutes = routeConfig.roleRoutes[userRole] || [];
  return authorizedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );
}

function getDashboardByRole(role: UserRole | undefined): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "professional":
      return "/dashboard/professional";
    case "user":
    default:
      return "/dashboard/user";
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};
