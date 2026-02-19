"use client"

import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const INPUT_DEBOUNCE_MS = 300

type AutoQueryNumberInputProps = {
  id: string
  name: string
  defaultValue: number
  min?: number
  max?: number
  step?: number
}

function AutoQueryNumberInput({ id, name, defaultValue, min, max, step = 1 }: AutoQueryNumberInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const defaultValueAsText = String(defaultValue)
  const [value, setValue] = useState(() => searchParams.get(name) ?? defaultValueAsText)
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const handleValueChange = (nextValue: string) => {
    setValue(nextValue)

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")
      const normalizedValue = nextValue.trim()
      const shouldDelete = !normalizedValue || normalizedValue === defaultValueAsText

      if (shouldDelete) {
        params.delete(name)
      } else {
        params.set(name, normalizedValue)
      }

      const currentQuery = searchParams.toString()
      const nextQuery = params.toString()
      if (currentQuery === nextQuery) {
        return
      }

      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
    }, INPUT_DEBOUNCE_MS)
  }

  return (
    <Input
      id={id}
      name={name}
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => handleValueChange(event.target.value)}
    />
  )
}

export default AutoQueryNumberInput
