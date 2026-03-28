"use client"

import { type FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BadgeDollarSign, ImageIcon, Layers3, Soup, Sparkles } from "lucide-react"
import { addMeal, getCategories } from "@/action/seller.action"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { ImageUploadField } from "@/components/ui/image-upload-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AddMealFormState = {
  categoryId: string
  name: string
  description: string
  price: string
  imageUrl: string
}

type AddMealFieldErrors = Partial<Record<keyof AddMealFormState, string>>

const INITIAL_FORM_STATE: AddMealFormState = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  imageUrl: "",
}

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

function AddMeal() {
  const [formState, setFormState] = useState<AddMealFormState>(INITIAL_FORM_STATE)
  const [fieldErrors, setFieldErrors] = useState<AddMealFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [isCategoryLoading, setIsCategoryLoading] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      setIsCategoryLoading(true)
      setCategoryError(null)

      try {
        const { data, error } = await getCategories()

        if (error) {
          throw error
        }

        const categoryList = (data ?? [])
          .filter((category) => typeof category.id === "string")
          .map((category) => ({ id: category.id as string, name: category.name }))

        if (!isMounted) {
          return
        }

        setCategories(categoryList)

        if (categoryList.length === 0) {
          setCategoryError("No categories are available right now.")
        }
      } catch (error) {
        if (!isMounted) {
          return
        }

        setCategoryError(getErrorMessage(error, "Failed to load categories. Please refresh and try again."))
      } finally {
        if (isMounted) {
          setIsCategoryLoading(false)
        }
      }
    }

    void loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (field: keyof AddMealFormState, value: string) => {
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }))
    setSubmitError(null)
    setFormState((previous) => ({ ...previous, [field]: value }))
  }

  const validateForm = () => {
    const nextErrors: AddMealFieldErrors = {}

    const categoryId = formState.categoryId.trim()
    const name = formState.name.trim()
    const imageUrl = formState.imageUrl.trim()
    const rawPrice = formState.price.trim()
    const price = Number(formState.price)

    if (!categoryId) {
      nextErrors.categoryId = "Please select a category."
    }

    if (!name) {
      nextErrors.name = "Meal name is required."
    }

    if (!rawPrice) {
      nextErrors.price = "Price is required."
    } else if (!Number.isFinite(price) || price <= 0) {
      nextErrors.price = "Price must be a positive number."
    }

    if (!imageUrl) {
      nextErrors.imageUrl = "Image URL is required."
    } else if (!isValidUrl(imageUrl)) {
      nextErrors.imageUrl = "Please provide a valid image URL."
    }

    setFieldErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isImageUploading) {
      toast.error("Please wait for the image upload to finish.")
      return
    }

    setSubmitError(null)

    if (!validateForm()) {
      toast.error("Please fix the highlighted form errors.")
      return
    }

    const categoryId = formState.categoryId.trim()
    const name = formState.name.trim()
    const description = formState.description.trim()
    const imageUrl = formState.imageUrl.trim()
    const price = Number(formState.price)

    setIsSubmitting(true)
    const toastId = toast.loading("Adding meal...")

    try {
      const { error } = await addMeal({
        categoryId,
        name,
        description: description || undefined,
        price,
        imageUrl,
      })

      if (error) {
        throw error
      }

      toast.success("Meal added successfully.", { id: toastId })
      setFormState(INITIAL_FORM_STATE)
      setFieldErrors({})
      setSubmitError(null)
      router.refresh()
    } catch (error) {
      const message = getErrorMessage(error, "Failed to add meal.")
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
                Seller Dashboard
              </p>
              <h1 className="mt-4 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                Add New Meal
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Publish a new menu item with complete details so customers can discover it quickly.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border/70 bg-card/80 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="size-4 text-primary" />
                  Highlight meals with a clear name and image.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/80 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <BadgeDollarSign className="size-4 text-primary" />
                  Set accurate pricing to reduce order confusion.
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
                  <Label htmlFor="categoryId" className="flex items-center gap-2">
                    <Layers3 className="size-4 text-primary" />
                    Category
                  </Label>
                  
                  <Select
                    value={formState.categoryId}
                    onValueChange={(value) => handleChange("categoryId", value)}
                    disabled={isSubmitting || isCategoryLoading || categories.length === 0}
                  >
                    <SelectTrigger
                      id="categoryId"
                      aria-invalid={Boolean(fieldErrors.categoryId || categoryError)}
                      className="h-11 w-full bg-background/80"
                    >
                      <SelectValue
                        placeholder={
                          isCategoryLoading
                            ? "Loading categories..."
                            : categories.length === 0
                              ? "No categories found"
                              : "Select a category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category)=>{
                          return <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldErrors.categoryId || categoryError}</FieldError>
                </Field>

                <Field className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <BadgeDollarSign className="size-4 text-primary" />
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.price}
                    onChange={(event) => handleChange("price", event.target.value)}
                    placeholder="12.99"
                    aria-invalid={Boolean(fieldErrors.price)}
                    className="h-11 bg-background/80"
                    required
                  />
                  <FieldError>{fieldErrors.price}</FieldError>
                </Field>
              </div>

              <Field className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Soup className="size-4 text-primary" />
                  Meal Name
                </Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="Chicken Biryani"
                  aria-invalid={Boolean(fieldErrors.name)}
                  className="h-11 bg-background/80"
                  required
                />
                <FieldError>{fieldErrors.name}</FieldError>
              </Field>

              <Field className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={formState.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  placeholder="Aromatic basmati rice with chicken and spices."
                  className="h-11 bg-background/80"
                />
              </Field>

              <Field className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-2">
                  <ImageIcon className="size-4 text-primary" />
                  Meal Image
                </Label>
                <ImageUploadField
                  id="imageUrl"
                  value={formState.imageUrl}
                  onChange={(value) => handleChange("imageUrl", value)}
                  onUploadStateChange={setIsImageUploading}
                  disabled={isSubmitting}
                  previewAlt="Meal image preview"
                />
                <FieldError>{fieldErrors.imageUrl}</FieldError>
              </Field>
            </FieldGroup>

            <div className="pt-1">
              {submitError && (
                <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {submitError}
                </p>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || isCategoryLoading || isImageUploading}
                className="h-11 font-semibold"
              >
                {isSubmitting ? "Adding..." : "Add Meal"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddMeal
