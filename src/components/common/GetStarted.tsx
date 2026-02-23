"use client"
import Link from 'next/link'
import { Button } from '../ui/button'
import { authClient } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { LayoutDashboard, Loader2, LogOut } from 'lucide-react'
import { toast } from 'sonner'

type SessionUserView = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

function GetStarted() {
  const { data, error, isPending, isRefetching } = authClient.useSession()
  const user = data?.user as SessionUserView | undefined
  const roleLabel = user?.role ?? "USER"

  const initials = user?.name
    ? user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
    : "U"

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out...")
    try {
      const response = await authClient.signOut()
      if (response?.error) {
        toast.error(response.error.message || "Failed to sign out.", { id: toastId })
        return
      }
      toast.success("Signed out successfully.", { id: toastId })
    } catch (logoutError: any) {
      toast.error(logoutError?.message || "Failed to sign out.", { id: toastId })
    }
  }

  if (isPending) {
    return (
      <Button size="sm" variant="outline" disabled className="inline-flex border-orange-500 text-orange-500">
        <Loader2 className="size-4 animate-spin" />
        Checking session...
      </Button>
    )
  }

  if (error) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="inline-flex border-orange-500 text-orange-500 hover:text-primary hover:bg-primary/10"
          asChild
        >
          <Link href="/signin">Sign In</Link>
        </Button>
        <Button
          size="sm"
          className="inline-flex bg-orange-500 hover:bg-orange-600 text-white"
          asChild
        >
          <Link href={"/signup"}>Signup</Link>
        </Button>
      </>
    )
  }

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border hover:bg-accent"
              aria-label="Open user menu"
            >
              <Avatar size="sm">
                <AvatarImage src={user.image || ""} alt={user.name || "User avatar"} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="space-y-1">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              <p className="text-muted-foreground text-xs">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="space-y-1">
              <p className="text-muted-foreground text-xs">Role</p>
              <p className="text-sm font-medium">{roleLabel}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isRefetching} onClick={handleLogout} variant="destructive">
              {isRefetching ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              {isRefetching ? "Refreshing..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            className="inline-flex border-orange-500 text-orange-500 hover:text-primary hover:bg-primary/10"
            asChild
          >
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button
            size="sm"
            className="inline-flex bg-orange-500 hover:bg-orange-600 text-white"
            asChild
          >
            <Link href={"/signup"}>Signup</Link>
          </Button>
        </>
      )}
    </>
  )
}

export default GetStarted
