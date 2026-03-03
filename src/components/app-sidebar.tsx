"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Loader2,
  Settings,
  ShoppingBasket,
  ShoppingBag,
  ShoppingCart,
  Store,
  Users,
  ListOrdered
} from "lucide-react"

import { Role } from "@/constant/role"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import SidebarLogo from "./dashboard/sidebar-logo"
import { authClient } from "@/lib/auth-client"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role: string
}

type SessionUserView = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const { data, error, isPending } = authClient.useSession()
  const sessionUser = data?.user as SessionUserView | undefined
  const resolvedRole = sessionUser?.role ?? role

  const userMenus = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Browse Meals", href: "/meals", icon: ShoppingBag },
    { title: "Restaurants", href: "/restaurants", icon: Store },
    {title:"My Orders", href:"/dashboard/my-orders", icon:ListOrdered},
    { title: "Cart", href: "/dashboard/cart", icon: ShoppingCart },
  ]

  const sellerMenus = [
    { title: "Seller Dashboard", href: "/seller-dashboard", icon: LayoutDashboard },
    { title: "My Meals", href: "/meals", icon: ShoppingBasket },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const adminMenus = [
    { title: "Admin Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { title: "Users", href: "/dashboard/users", icon: Users },
    { title: "Restaurants", href: "/restaurants", icon: Store },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const menus = resolvedRole === Role.ADMIN ? adminMenus : resolvedRole === Role.SELLER ? sellerMenus : userMenus

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <SidebarLogo/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {menus.map((menu) => (
              <SidebarMenuItem key={menu.title}>
                <SidebarMenuButton asChild isActive={pathname === menu.href}>
                  <Link href={menu.href}>
                    <menu.icon />
                    <span>{menu.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {isPending ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <Loader2 className="animate-spin" />
                <span>Loading session...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : error || !sessionUser ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/signin">
                  <span>Sign in</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <NavUser
            user={{
              name: sessionUser.name || "User",
              email: sessionUser.email || "No email",
              avatar: sessionUser.image || "",
              role: resolvedRole || "UNKNOWN",
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
