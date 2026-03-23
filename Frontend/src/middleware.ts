import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// Define the JWT token structure
interface JWTPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  role: string;
}

// Define route configurations
const publicRoutes = [
  "/signin",
  "/signup",
  "/service",
  "/about",
  "/attorneys",
  "/cases",
  "/blog",
  "/contact",
];

const adminRoutes = ["/admin", "/appointments", "/lawyers", "/users"];

const clientRoutes = [
  "/dashboard",
  "/book-appointment",
  "/my-appointments",
  "/messages",
  "/profile",
];

const lawyerRoutes = [
  "/dashboard",
  "/my-appointments",
  "/messages",
  "/profile",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Current pathname:", pathname);

  // Get the token from cookies
  const token = request.cookies.get("access_token")?.value;

  // Function to check if the current path exactly matches or starts with any of the routes
  const pathStartsWith = (paths: string[]) =>
    paths.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

  // Create base response
  let response = NextResponse.next();

  // Special case for root path
  if (pathname === "/") {
    if (!token) {
      return response;
    }
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const role = decoded.role;

      // Check token expiration
      if (decoded.exp < Date.now() / 1000) {
        response = NextResponse.redirect(new URL("/signin", request.url));
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }

      // Redirect based on role
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (role === "lawyer" || role === "client") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    } catch {
      response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  // Not logged in - only allow public routes
  if (!token) {
    if (pathStartsWith(publicRoutes)) {
      return response;
    }
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // For protected routes, decode token to get role
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const role = decoded.role;

    // Check token expiration
    if (decoded.exp < Date.now() / 1000) {
      response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    // Handle public routes for logged in users
    if (pathStartsWith(publicRoutes)) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Handle admin access
    if (role === "admin") {
      if (pathStartsWith(adminRoutes)) {
        return response;
      }
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Handle lawyer access
    if (role === "lawyer") {
      if (pathStartsWith(lawyerRoutes)) {
        return response;
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Handle client access
    if (role === "client") {
      if (pathStartsWith(clientRoutes)) {
        return response;
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If role is not recognized, clear cookies and redirect to signin
    response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  } catch {
    // If token can't be decoded, clear cookies and redirect to signin
    response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, or other public files
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|images|assets|logoBg.png|logo.png|.*\\.(?:jpg|jpeg|gif|png|svg|ico)$|api).*)",
  ],
};
