// middleware/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { Role } from "@/constant/role";
import { extractSellerProfile, sellerService } from "@/services/seller.service";

export async function proxy(req: NextRequest) {
  const { user, session } = await userService.getSession();

  const pathname = req.nextUrl.pathname;

  const isAuthenticated = Boolean(user && session);
  const role = user?.role;
  const isBanned = user?.isActive === false;
  const isCompleteProfilePath = pathname.startsWith("/complete-profile");

  if (isBanned) {
    return NextResponse.redirect(new URL("/banned", req.url));
  }

  if (pathname.startsWith("/banned") && isBanned) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Dashboard paths
  const isDashboardPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/seller-dashboard");

  const isProfileRoute = pathname.startsWith("/dashboard/profile");

  // 🚫 Not logged in → block dashboard access
  if (isDashboardPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (isCompleteProfilePath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 🚫 Logged in → block signin/signup pages
  if (
    (pathname.startsWith("/signin") || pathname.startsWith("/signup")) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Authenticated but trying to access seller signup → block
  if (isAuthenticated && pathname.startsWith("/seller-signup")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isCompleteProfilePath && role !== Role.SELLER) {
    if (role === Role.ADMIN) {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }

    if (role === Role.CUSTOMER) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuthenticated && role === Role.SELLER) {
    const shouldCheckSellerProfile = isDashboardPath || isCompleteProfilePath;

    if (shouldCheckSellerProfile) {
      const { data } = await sellerService.getSellerProfile();
      const sellerProfile = extractSellerProfile(data);
      const isSellerProfileCompleted = sellerProfile?.isProfileCompleted === true;

      if (!isSellerProfileCompleted && !isCompleteProfilePath) {
        return NextResponse.redirect(new URL("/complete-profile", req.url));
      }

      if (isSellerProfileCompleted && isCompleteProfilePath) {
        return NextResponse.redirect(new URL("/seller-dashboard", req.url));
      }
    }
  }

  // 🔐 Role-based dashboard routing
  if (isDashboardPath && isAuthenticated) {
    // Admin route protection
    if (pathname.startsWith("/admin-dashboard") && role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Seller route protection
    if (pathname.startsWith("/seller-dashboard") && role !== Role.SELLER) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Base user dashboard protection
    if (pathname.startsWith("/dashboard") && role !== Role.CUSTOMER) {
      if (role === Role.ADMIN) {
        return NextResponse.redirect(new URL("/admin-dashboard", req.url));
      }

      if (role === Role.SELLER) {
        return NextResponse.redirect(new URL("/seller-dashboard", req.url));
      }
    }

    // Optional: redirect from base dashboard to role-specific dashboards
    if (role === Role.ADMIN && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }

    if (role === Role.SELLER && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/seller-dashboard", req.url));
    }
  }

  // Seller profile redirect
  if (role === Role.SELLER && isProfileRoute) {
    return NextResponse.redirect(new URL("/seller-dashboard/profile", req.url));
  }

  return NextResponse.next();
}

// Middleware matcher
export const config = {
  matcher: [
    "/",
    "/meals",
    "/signin",
    "/signup",
    "/seller-signup",
    "/complete-profile",
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
    "/seller-dashboard/:path*",
  ],
};
