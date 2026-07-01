import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("_token")?.value;
    const role = request.cookies.get("_userRole")?.value;

    const isAdminRoute = pathname.startsWith("/admin");
    const isUserRoute = pathname.startsWith("/user");
    const isAuthRoute =
        pathname === "/login" || pathname === "/register" || pathname.startsWith("/auth") || pathname === "/verify-email";

    if ((isAdminRoute || isUserRoute) && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdminRoute && role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && role === "user" && !isUserRoute && !isAuthRoute) {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }

    if (token && isAuthRoute) {
        return NextResponse.redirect(
            new URL(role === "admin" ? "/admin/dashboard" : "/user/dashboard", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
