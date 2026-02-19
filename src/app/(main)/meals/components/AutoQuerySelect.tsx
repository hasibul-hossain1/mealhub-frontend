"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

type AutoQuerySelectProps = {
  id: string
  name: string
  options: Array<{ label: string; value: string }>
  defaultValue: string
  deleteValue?: string
  className?: string
}

function AutoQuerySelect({ id, name, options, defaultValue, deleteValue, className }: AutoQuerySelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(() => searchParams.get(name) ?? defaultValue)

  const handleValueChange = (nextValue: string) => {
    setValue(nextValue)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("page")
    const shouldDelete = !nextValue || (deleteValue !== undefined && nextValue === deleteValue)

    if (shouldDelete) {
      params.delete(name)
    } else {
      params.set(name, nextValue)
    }

    const currentQuery = searchParams.toString()
    const nextQuery = params.toString()
    if (currentQuery === nextQuery) {
      return
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(event) => handleValueChange(event.target.value)}
      className={className}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default AutoQuerySelect
