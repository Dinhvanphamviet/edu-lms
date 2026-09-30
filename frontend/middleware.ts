import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Danh sách các route yêu cầu đăng nhập
const protectedRoutes = ["/profile", "/my-courses", "/dashboard", "/checkout", "/teacher", "/admin"];

// Danh sách các route dành cho khách (chưa đăng nhập)
const authRoutes = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Kiểm tra cookie refresh_token do backend set (HttpOnly)
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isAuthenticated = !!refreshToken;

  // 1. Đã đăng nhập nhưng cố vào trang Login / Register -> Đẩy về trang chủ
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Cấu hình các pattern Regex cho route động
  const isLectureRoute = pathname.match(/^\/courses\/[^/]+\/bai-giang/);

  // 2. Chưa đăng nhập mà cố vào trang yêu cầu quyền (Protected Routes) -> Đẩy ra trang Login
  if (protectedRoutes.some(route => pathname.startsWith(route)) || isLectureRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      // Lưu lại URL cũ để đăng nhập xong quay lại (nếu cần)
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Chạy middleware trên tất cả các route ngoại trừ:
     * - api (API routes nếu có trên frontend)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, .svg, .png... (các file tĩnh)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};
