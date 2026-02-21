import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { Role } from "@/constant/role";

export async function proxy(req: NextRequest) {
  const { session } = await userService.getSession();
  const pathname = req.nextUrl.pathname;

  const isAuthenticated = !!session;
  const role = session?.user?.role;

  // 🚫 Not logged in → block dashboard
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 🚫 Logged in → block signin
  if (pathname.startsWith("/signin") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔐 Role based dashboard routing
  if (pathname.startsWith("/dashboard")) {
    if (role === Role.ADMIN && !pathname.startsWith("/dashboard/admin")) {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }

    if (role === Role.SELLER && !pathname.startsWith("/dashboard/seller")) {
      return NextResponse.redirect(new URL("/dashboard/seller", req.url));
    }

    // normal user cannot access dashboard
    if (role !== Role.ADMIN && role !== Role.SELLER) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/dashboard/:path*"],
};