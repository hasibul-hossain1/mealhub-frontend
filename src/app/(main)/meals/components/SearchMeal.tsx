"use client"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const SEARCH_DEBOUNCE_MS = 300

function SearchMeal() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "")
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const handleSearchChange = (value: string) => {
    setSearch(value)

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")
      const trimmedSearch = value.trim()

      if (trimmedSearch) {
        params.set("search", trimmedSearch)
      } else {
        params.delete("search")
      }

      const currentQuery = searchParams.toString()
      const nextQuery = params.toString()
      if (currentQuery === nextQuery) {
        return
      }

      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
    }, SEARCH_DEBOUNCE_MS)
  }

  return (
    <Input
      id="meal-search"
      name="search"
      value={search}
      onChange={(e) => handleSearchChange(e.target.value)}
      placeholder="Search by name or description..."
    />
  )
}

export default SearchMeal
