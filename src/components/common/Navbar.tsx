import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/dashboard/ModeToggle'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type NavLink = {label:string; href:string}
function Navbar() {

  const navLinks:NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Browse Meals', href: '/meals' },
    { label: 'Restaurants', href: '/restaurants' },
    { label: 'Contact', href: '/contact' },
    {label:"About", href:"/about"},
    {label:"Careers", href:"/careers"}
  ]

  return (
    <nav className="sticky top-0 w-full z-50 bg-background/95 border-b border-border shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Mobile menu + Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="md:hidden">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Browse all navigation items.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 px-4 pb-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-md px-3 py-2 text-foreground/80 hover:bg-accent hover:text-primary font-medium transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src="/logos/logo.png"
                alt="MealHub Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <Image
                src="/logos/name-logo.png"
                alt="MealHub"
                width={100}
                height={40}
                className="h-10 hidden sm:block"
              />
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200 text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right - Action buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />
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
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
