'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { MealCategory } from '@/types/meal.type'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { createCategory, deleteCategories } from '@/action/meal.action'
import { toast } from 'sonner'

type CategoriesProps = {
  categories: MealCategory[]
}

const dateTime = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return dateTime.format(date)
}

export default function Categories({ categories }: CategoriesProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState({ name: '', imageUrl: '' })
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; imageUrl?: string }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  const getErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (error instanceof Error && error.message) {
      return error.message
    }

    if (typeof error === 'string' && error.trim()) {
      return error
    }

    return fallbackMessage
  }

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  const validateForm = () => {
    const nextErrors: { name?: string; imageUrl?: string } = {}
    const name = formState.name.trim()
    const imageUrl = formState.imageUrl.trim()

    if (!name) {
      nextErrors.name = 'Category name is required.'
    } else if (name.length < 2) {
      nextErrors.name = 'Category name must be at least 2 characters.'
    }

    if (!imageUrl) {
      nextErrors.imageUrl = 'Image URL is required.'
    } else if (!isValidUrl(imageUrl)) {
      nextErrors.imageUrl = 'Enter a valid image URL.'
    }

    return nextErrors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors = validateForm()
    setFieldErrors(nextErrors)
    setSubmitError(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading('Creating category...')

    try {
      const { error } = await createCategory({
        name: formState.name.trim(),
        imageUrl: formState.imageUrl.trim(),
      })

      if (error) {
        throw error
      }

      toast.success('Category created successfully.', { id: toastId })
      setFormState({ name: '', imageUrl: '' })
      router.refresh()
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to create category.')
      setSubmitError(message)
      toast.error(message, { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id?: string) => {
    if (!id) {
      toast.error('Category id is missing.')
      return
    }

    if (deletingId) return

    setDeletingId(id)
    const toastId = toast.loading('Deleting category...')

    try {
      const { error } = await deleteCategories({ categoryId: id })
      if (error) {
        throw error
      }

      toast.success('Category deleted successfully.', { id: toastId })
      router.refresh()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete category.'), { id: toastId })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className='space-y-6'>
      <form
        onSubmit={handleSubmit}
        className='overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xs'
      >
        <div className='grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.1fr_1.6fr] lg:gap-10'>
          <div className='relative overflow-hidden rounded-2xl border border-border/60 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_55%),linear-gradient(135deg,hsl(var(--accent)/0.2),hsl(var(--background)))] p-5 text-foreground shadow-sm'>
            <p className='text-xs font-semibold tracking-[0.2em] text-primary uppercase'>
              Manage Categories
            </p>
            <h2 className='mt-3 text-2xl font-extrabold leading-tight'>
              Create a fresh category
            </h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              Give your menu more structure. Add a name and a hero image that represents the
              category.
            </p>
            <div className='mt-4 rounded-xl border border-border/60 bg-background/70 p-3'>
              <p className='text-xs font-semibold text-muted-foreground'>Live preview</p>
              <div className='mt-3 flex items-center gap-3'>
                <div className='relative size-14 overflow-hidden rounded-xl border border-border/70 bg-muted/40'>
                  {isValidUrl(formState.imageUrl) ? (
                    <Image
                      src={formState.imageUrl}
                      alt='Category preview'
                      width={80}
                      height={80}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground'>
                      {formState.name.trim().slice(0, 1).toUpperCase() || 'C'}
                    </div>
                  )}
                </div>
                <div>
                  <p className='text-sm font-semibold text-foreground'>
                    {formState.name.trim() || 'Category name'}
                  </p>
                  <p className='text-xs text-muted-foreground'>Image preview</p>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h3 className='text-lg font-bold text-foreground'>Category Details</h3>
                <p className='text-sm text-muted-foreground'>
                  Keep names short and images crisp for a better browsing experience.
                </p>
              </div>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </Button>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='category-name'>Category Name</Label>
                <Input
                  id='category-name'
                  placeholder='e.g. Burgers'
                  value={formState.name}
                  onChange={(event) => {
                    setFormState((previous) => ({ ...previous, name: event.target.value }))
                    setFieldErrors((prev) => ({ ...prev, name: undefined }))
                    setSubmitError(null)
                  }}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name ? (
                  <p className='text-xs text-rose-600'>{fieldErrors.name}</p>
                ) : null}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category-image'>Image URL</Label>
                <Input
                  id='category-image'
                  placeholder='https://...'
                  value={formState.imageUrl}
                  onChange={(event) => {
                    setFormState((previous) => ({ ...previous, imageUrl: event.target.value }))
                    setFieldErrors((prev) => ({ ...prev, imageUrl: undefined }))
                    setSubmitError(null)
                  }}
                  aria-invalid={Boolean(fieldErrors.imageUrl)}
                />
                {fieldErrors.imageUrl ? (
                  <p className='text-xs text-rose-600'>{fieldErrors.imageUrl}</p>
                ) : null}
              </div>
            </div>

            {submitError ? (
              <div className='rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700'>
                {submitError}
              </div>
            ) : null}
          </div>
        </div>
      </form>

      {categories.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground'>
          No categories found.
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {categories.map((category) => {
            const key = category.id ?? category.name
            const updatedAt = category.updatedAt ?? category.createdAt

            return (
              <article
                key={key}
                className='group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
              >
                <div className='pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-emerald-200 via-sky-200 to-indigo-200 opacity-70' />
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={deletingId === category.id}
                  className='absolute right-3 top-3 z-10 opacity-100 shadow-sm hover:opacity-100 lg:opacity-0 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto'
                >
                  <X className='size-4' />
                </Button>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-200'>
                      Category
                    </p>
                    <h3 className='mt-2 text-lg font-bold text-foreground line-clamp-1'>
                      {category.name}
                    </h3>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      ID: {category.id ? `${category.id.slice(0, 10)}...` : 'N/A'}
                    </p>
                  </div>
                  <div className='relative size-14 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/40'>
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        width={80}
                        height={80}
                        className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground'>
                        {category.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className='mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2'>
                  <div className='rounded-lg border border-border/60 bg-muted/30 p-2'>
                    <p className='text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground'>
                      Created
                    </p>
                    <p className='mt-1 text-sm font-medium text-foreground'>
                      {formatDateTime(category.createdAt)}
                    </p>
                  </div>
                  <div className='rounded-lg border border-border/60 bg-muted/30 p-2'>
                    <p className='text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground'>
                      Updated
                    </p>
                    <p className='mt-1 text-sm font-medium text-foreground'>
                      {formatDateTime(updatedAt)}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
