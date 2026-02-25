import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { ModeToggle } from "./ModeToggle"

export default function Dashboard({ children, role }: { children: React.ReactNode; role: string }) {
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="flex bg-sidebar relative shadow-[0_4px_6px_rgba(0,0,0,0.1)] h-16 justify-between px-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <SidebarTrigger className="z-50" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 hidden max-md:block">
            <Image
              src="/logos/name-logo.png"
              alt="Logo"
              className="md:hidden"
              width={120}
              height={50}
            />
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button asChild variant="outline" size="sm">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </header>
        {/* Here the children will render */}
        <div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
