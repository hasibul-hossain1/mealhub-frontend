import React from "react"
import Link from "next/link"

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-12 border-t border-border bg-muted/60 dark:bg-muted/40">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <section>
          <h3 className="text-base font-semibold text-foreground">MealHub</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Discover meals from trusted kitchens, place orders quickly, and enjoy reliable delivery across your area.
          </p>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li><Link href="/meals" className="hover:text-foreground">Browse Meals</Link></li>
            <li><Link href="/restaurants" className="hover:text-foreground">Restaurants</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-foreground">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>help@mealhub.com</li>
            <li>+1 (555) 014-2289</li>
            <li>Live chat: 9:00 AM - 10:00 PM</li>
            <li>Service area: Citywide delivery</li>
          </ul>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-foreground">Business Hours</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Mon - Thu: 9:00 AM - 10:00 PM</li>
            <li>Fri - Sat: 9:00 AM - 11:30 PM</li>
            <li>Sunday: 10:00 AM - 10:00 PM</li>
          </ul>
        </section>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {year} MealHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
