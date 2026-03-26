"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, MapPin, Phone, Sparkles, Store, Text } from "lucide-react"
import { toast } from "sonner"
import { completeProfile } from "@/action/seller.action"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type CompleteProfileFormState = {
  restaurantName: string
  description: string
  address: string
  phoneNumber: string
}

type CompleteProfileFieldErrors = Partial<Record<keyof CompleteProfileFormState, string>>

type CompleteProfileFormProps = {
  initialValues?: Partial<CompleteProfileFormState>
}

const INITIAL_FORM_STATE: CompleteProfileFormState = {
  restaurantName: "",
  description: "",
  address: "",
  phoneNumber: "",
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

function CompleteProfileForm({ initialValues }: CompleteProfileFormProps) {
  const [formState, setFormState] = useState<CompleteProfileFormState>({
    ...INITIAL_FORM_STATE,
    ...initialValues,
  })
  const [fieldErrors, setFieldErrors] = useState<CompleteProfileFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (field: keyof CompleteProfileFormState, value: string) => {
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }))
    setSubmitError(null)
    setFormState((previous) => ({ ...previous, [field]: value }))
  }

  const validateForm = () => {
    const nextErrors: CompleteProfileFieldErrors = {}

    if (!formState.restaurantName.trim()) {
      nextErrors.restaurantName = "Restaurant name is required."
    }

    if (!formState.address.trim()) {
      nextErrors.address = "Address is required."
    }

    if (!formState.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required."
    }

    setFieldErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitError(null)

    if (!validateForm()) {
      toast.error("Please fix the highlighted form errors.")
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Saving restaurant profile...")

    try {
      const { error } = await completeProfile({
        restaurantName: formState.restaurantName.trim(),
        description: formState.description.trim(),
        address: formState.address.trim(),
        phoneNumber: formState.phoneNumber.trim(),
      })

      if (error) {
        throw error
      }

      toast.success("Restaurant profile completed successfully.", { id: toastId })
      router.replace("/seller-dashboard")
      router.refresh()
    } catch (error) {
      const message = getErrorMessage(error, "Failed to complete profile.")
      setSubmitError(message)
      toast.error(message, { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl">
      <div className="relative grid lg:grid-cols-[0.95fr_1.2fr]">
        <div className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.22),transparent_58%),linear-gradient(120deg,hsl(var(--accent)/0.3),hsl(var(--background)))] p-6 sm:p-8 lg:border-r lg:border-b-0">
          <div className="absolute -left-16 top-6 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-4 right-3 h-44 w-44 rounded-full bg-accent/35 blur-3xl" />

          <div className="relative z-10 space-y-5">
            <div>
              <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Seller Onboarding
              </p>
              <h1 className="mt-4 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                Complete Restaurant Profile
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your restaurant details so customers can trust your store and start ordering with confidence.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border/70 bg-card/80 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="size-4 text-primary" />
                  A clear restaurant name helps people recognize your brand quickly.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/80 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="size-4 text-primary" />
                  Add the correct address and phone number so support and delivery stay smooth.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-5">
            <FieldGroup className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field className="space-y-2">
                  <Label htmlFor="restaurantName" className="flex items-center gap-2">
                    <Store className="size-4 text-primary" />
                    Restaurant Name
                  </Label>
                  <Input
                    id="restaurantName"
                    value={formState.restaurantName}
                    onChange={(event) => handleChange("restaurantName", event.target.value)}
                    placeholder="Enter your restaurant name"
                    aria-invalid={Boolean(fieldErrors.restaurantName)}
                    className="h-11 bg-background/80"
                    required
                  />
                  <FieldError>{fieldErrors.restaurantName}</FieldError>
                </Field>

                <Field className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                    <Phone className="size-4 text-primary" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formState.phoneNumber}
                    onChange={(event) => handleChange("phoneNumber", event.target.value)}
                    placeholder="Enter your business phone number"
                    aria-invalid={Boolean(fieldErrors.phoneNumber)}
                    className="h-11 bg-background/80"
                    required
                  />
                  <FieldError>{fieldErrors.phoneNumber}</FieldError>
                </Field>
              </div>

              <Field className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={formState.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                  placeholder="Enter your restaurant address"
                  aria-invalid={Boolean(fieldErrors.address)}
                  className="h-11 bg-background/80"
                  required
                />
                <FieldError>{fieldErrors.address}</FieldError>
              </Field>

              <Field className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <Text className="size-4 text-primary" />
                  Description (optional)
                </Label>
                <Textarea
                  id="description"
                  value={formState.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  placeholder="Describe your restaurant, cuisine, and what makes it special"
                  className="min-h-32 resize-y bg-background/80"
                />
              </Field>
            </FieldGroup>

            <div className="pt-1">
              {submitError && (
                <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {submitError}
                </p>
              )}
              <Button type="submit" disabled={isSubmitting} className="h-11 font-semibold">
                {isSubmitting ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfileForm
