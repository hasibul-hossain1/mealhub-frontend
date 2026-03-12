"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck, Sparkles, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const toastId = toast.loading("Creating account...")

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      })

      if (error) {
        return toast.error(error.message || "Could not create account.", { id: toastId })
      }

      toast.success("Account created. We sent a verification email. Please verify your account.", { id: toastId })
      router.push("/signin")
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred while signing up.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid w-full overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-xl backdrop-blur sm:max-w-4xl sm:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-border/60 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.22),transparent_58%),linear-gradient(120deg,hsl(var(--accent)/0.3),hsl(var(--background)))] p-8 sm:block">
        <div className="absolute -left-16 top-6 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-4 right-3 h-44 w-44 rounded-full bg-accent/35 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              MealHub
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-foreground">
              Create your account and start ordering faster.
            </h2>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Save addresses, track deliveries, and keep your favorite meals in one place.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-card/80 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <UserPlus className="size-4 text-primary" />
                Quick account setup
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/80 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="size-4 text-primary" />
                Personalized meal recommendations
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/80 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Secure authentication flow
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="mb-7">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Create account</p>
          <h1 className="mt-2 text-2xl font-bold text-foreground">Sign up</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your details to create a new MealHub account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="h-11 bg-background/70 transition focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-11 bg-background/70 transition focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-foreground">Image URL</label>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              autoComplete="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              className="h-11 bg-background/70 transition focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11 bg-background/70 pr-12 transition focus-visible:ring-primary/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="mt-2 h-11 w-full font-semibold" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign up"}
          </Button>
        </form>
       <p className="text-sm text-center font-medium mt-2">if you want be a seller <Link href={'/seller-signup'} className="text-red-500">click here</Link></p>
      </div>
    </div>
  )
}

export default Signup
