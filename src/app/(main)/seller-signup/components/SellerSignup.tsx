"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck, Sparkles, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ImageUploadField } from "@/components/ui/image-upload-field"
import { Input } from "@/components/ui/input"
import { createSeller } from "@/action/seller.action"
import Link from "next/link"

function SellerSignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isImageUploading) {
      toast.error("Please wait for the image upload to finish.")
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Creating seller account...")

    try {
      const { error } = await createSeller({ name, email, image, password })

      if (error) {
        return toast.error("Could not create account.", { id: toastId })
      }

      toast.success(
        "Your seller account has been created. Please verify your email to start selling on Tyme2eat.",
        { id: toastId }
      )

      router.push("/signin")
    } catch (error: any) {
      toast.error(
        error?.message || "An unexpected error occurred while signing up.",
        { id: toastId }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid w-full overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-xl backdrop-blur sm:max-w-4xl sm:grid-cols-2">
      {/* Left Marketing / Info Section */}
      <div className="relative hidden overflow-hidden border-r border-border/60 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.22),transparent_58%),linear-gradient(120deg,hsl(var(--accent)/0.3),hsl(var(--background)))] p-8 sm:block">
        <div className="absolute -left-16 top-6 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-4 right-3 h-44 w-44 rounded-full bg-accent/35 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Tyme2eat
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-foreground">
              Start selling your meals on Tyme2eat
            </h2>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Create your seller account to manage your menu, receive orders, and grow your food business.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-card/80 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <UserPlus className="size-4 text-primary" />
                Quick seller onboarding
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/80 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="size-4 text-primary" />
                Manage your menu & orders
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/80 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Secure seller dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="relative p-6 sm:p-8">
        <div className="mb-7">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Seller registration
          </p>
          <h1 className="mt-2 text-2xl font-bold text-foreground">
            Create your seller account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join Tyme2eat and start selling your delicious meals to customers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Name
            </label>
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
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
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
            <label htmlFor="image" className="text-sm font-medium text-foreground">
              Profile Image
            </label>
            <ImageUploadField
              id="image"
              value={image}
              onChange={setImage}
              onUploadStateChange={setIsImageUploading}
              disabled={isSubmitting}
              previewAlt="Seller profile image preview"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
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
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-2 h-11 w-full font-semibold"
            disabled={isSubmitting || isImageUploading}
          >
            {isSubmitting ? "Creating Account..." : "Create Seller Account"}
          </Button>
        </form>
        <p className="text-sm text-center font-medium mt-2">if you want to order food <Link href={'/signup'} className="text-red-500">click here</Link></p>
      </div>
    </div>
  )
}

export default SellerSignUp
