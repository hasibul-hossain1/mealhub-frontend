import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { Role } from "@/constant/role";

export async function proxy(req: NextRequest) {
  const { session } = await userService.getSession();
  const pathname = req.nextUrl.pathname;

  const isAuthenticated = !!session;
  const role = session?.user?.role;
  const isDashboardPath =
    pathname === "/dashboard" ||
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/seller-dashboard");

  // 🚫 Not logged in → block dashboard
  if (isDashboardPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 🚫 Logged in → block signin
  if (
    (pathname.startsWith("/signin") || pathname.startsWith("/signup")) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔐 Role based dashboard routing
  if (isDashboardPath) {
    // Admin route protection
    if (pathname.startsWith("/admin-dashboard") && role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Seller route protection
    if (pathname.startsWith("/seller-dashboard") && role !== Role.SELLER) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Base user dashboard protection
    if (pathname === "/dashboard" && role !== Role.CUSTOMER) {
      if (role === Role.ADMIN) {
        return NextResponse.redirect(new URL("/admin-dashboard", req.url));
      }

      if (role === Role.SELLER) {
        return NextResponse.redirect(new URL("/seller-dashboard", req.url));
      }
    }

    // Optional redirect from role dashboards to their own route
    if (role === Role.ADMIN && pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }

    if (role === Role.SELLER && pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/seller-dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/dashboard", "/admin-dashboard/:path*", "/seller-dashboard/:path*"],
};
