"use client"

import Image from "next/image"
import { type ChangeEvent, type DragEvent, type KeyboardEvent, useEffect, useId, useRef, useState } from "react"
import { ImageIcon, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { env } from "@/env"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MAX_FILE_SIZE = 10 * 1024 * 1024

type ImageUploadFieldProps = {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  onUploadStateChange?: (isUploading: boolean) => void
  disabled?: boolean
  previewAlt: string
  className?: string
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Could not read the selected image."))
    }

    reader.onerror = () => {
      reject(new Error("Could not read the selected image."))
    }

    reader.readAsDataURL(file)
  })

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

export function ImageUploadField({
  id,
  name,
  value,
  onChange,
  onUploadStateChange,
  disabled = false,
  previewAlt,
  className,
}: ImageUploadFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  useEffect(() => {
    onUploadStateChange?.(isUploading)
  }, [isUploading, onUploadStateChange])

  useEffect(() => {
    if (isUploading) {
      return
    }

    const trimmedValue = value.trim()

    if (!trimmedValue) {
      setLocalPreview(null)
      return
    }

    if (localPreview?.startsWith("data:")) {
      return
    }

    if (localPreview !== trimmedValue) {
      setLocalPreview(trimmedValue)
    }
  }, [isUploading, localPreview, value])

  const previewSrc = localPreview ?? value.trim() ?? null

  const openFilePicker = () => {
    if (disabled || isUploading) {
      return
    }

    fileInputRef.current?.click()
  }

  const handleFileUpload = async (file?: File | null) => {
    if (!file) {
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image")
      return
    }

    setIsUploading(true)

    try {
      const preview = await readFileAsDataUrl(file)
      setLocalPreview(preview)

      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${env.NEXT_PUBLIC_IMAGEBB_API_KEY}`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (!response.ok || !data?.success) {
        throw new Error(data?.error?.message || "Image upload failed")
      }

      const nextImageUrl = typeof data?.data?.display_url === "string" ? data.data.display_url : ""

      if (!nextImageUrl) {
        throw new Error("Image upload failed")
      }

      setLocalPreview(nextImageUrl)
      onChange(nextImageUrl)
      toast.success("Image uploaded successfully")
    } catch (error) {
      setLocalPreview(null)
      toast.error(getErrorMessage(error, "Image upload failed"))
    } finally {
      setIsUploading(false)
      setIsDragging(false)
    }
  }

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await handleFileUpload(event.target.files?.[0])
    event.target.value = ""
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    if (disabled || isUploading) {
      return
    }

    await handleFileUpload(event.dataTransfer.files?.[0])
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return
    }

    event.preventDefault()
    openFilePicker()
  }

  const handleRemove = () => {
    if (disabled || isUploading) {
      return
    }

    setLocalPreview(null)
    onChange("")
  }

  return (
    <div className={cn("space-y-2", className)}>
      {name ? <input type="hidden" name={name} value={value} readOnly /> : null}

      {previewSrc ? (
        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border/70 bg-muted/30">
          <Image
            src={previewSrc}
            alt={previewAlt}
            height={192}
            width={192}
            className="h-full w-full object-cover"
            unoptimized={previewSrc.startsWith("data:")}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute right-2 top-2"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            Remove
          </Button>
          {isUploading ? (
            <div className="absolute inset-0 flex items-end bg-black/30 p-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                <LoaderCircle className="size-3.5 animate-spin" />
                Uploading image...
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled || isUploading ? -1 : 0}
          onClick={openFilePicker}
          onKeyDown={handleKeyDown}
          onDragOver={(event) => {
            event.preventDefault()
            if (!disabled && !isUploading) {
              setIsDragging(true)
            }
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 px-4 text-center transition",
            "border-gray-300 hover:bg-muted/40",
            isDragging && "border-primary bg-primary/5",
            (disabled || isUploading) && "cursor-not-allowed opacity-70"
          )}
        >
          {isUploading ? (
            <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-primary" />
          ) : (
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {isUploading ? "Uploading image..." : "Click to upload"}
            </span>
            {!isUploading ? " or drag and drop" : null}
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  )
}
