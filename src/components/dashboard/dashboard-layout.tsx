import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "../ui/button"

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex shadow-[0_4px_6px_rgba(0,0,0,0.1)] h-16 md:justify-start justify-center shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center justify-between w-full px-4 md:w-auto md:justify-start md:gap-2">
            <SidebarTrigger className="-ml-6 z-50" />
            <div className="flex justify-between md:hidden">
              <div></div>
              <Image
                src="/logos/name-logo.png"
                alt="Logo"
                width={120}
                height={50}
              />
            </div>
            <Button className="md:hidden inline-block">Profile</Button>
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
