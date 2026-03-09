'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useMemo, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { FaRegEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { toast } from 'sonner'
import { deleteMeal } from '@/action/seller.action'

type Meal = {
  id: string
  sellerId: string
  categoryId: string
  category?: {
    name?: string
  }
  foodName: string
  description: string | null
  price: number
  imageUrl: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

type MyMealsTableProps = {
  meals: Meal[]
}

const ITEMS_PER_PAGE = 6

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  return date.toLocaleString()
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

function MyMealsTable({ meals }: MyMealsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingMealId, setDeletingMealId] = useState<string | null>(null)
  const router = useRouter()
  const totalPages = Math.max(1, Math.ceil(meals.length / ITEMS_PER_PAGE))

  const pageNumbers = useMemo(
    () =>
      Array.from(
        new Set(
          [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(
            (page): page is number => page >= 1 && page <= totalPages,
          ),
        ),
      ).sort((a, b) => a - b),
    [currentPage, totalPages],
  )

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedMeals = meals.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }

    setCurrentPage(page)
  }

  const handleDeleteMeal = async (id: string) => {
    if (deletingMealId) {
      return
    }

    setDeletingMealId(id)
    const toastId = toast.loading('Deleting meal...')

    try {
      const { error } = await deleteMeal(id)

      if (error) {
        throw error
      }

      toast.success('Meal deleted successfully.', { id: toastId })
      router.refresh()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete meal.'), { id: toastId })
    } finally {
      setDeletingMealId(null)
    }
  }

  return (
    <div className='rounded-md border bg-background lg:p-4'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-265 text-sm'>
          <thead className='bg-muted/50'>
            <tr className='border-b text-left'>
              <th className='px-4 py-3 font-medium'>Image</th>
              <th className='px-4 py-3 font-medium'>Food Name</th>
              <th className='px-4 py-3 font-medium'>Category</th>
              <th className='px-4 py-3 font-medium'>Price</th>
              <th className='px-4 py-3 font-medium'>Available</th>
              <th className='px-4 py-3 font-medium'>Description</th>
              <th className='px-4 py-3 font-medium'>Last Updated</th>
              <th className='px-4 py-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMeals.map((meal) => (
              <tr key={meal.id} className='border-b align-top'>
                <td className='px-4 py-3'>
                  <Image
                    width={64}
                    height={48}
                    src={meal.imageUrl}
                    alt={meal.foodName}
                    className='h-12 w-16 rounded object-cover'
                    unoptimized
                  />
                </td>
                <td className='px-4 py-3 font-medium'>{meal.foodName}</td>
                <td className='px-4 py-3'>{meal.category?.name ?? 'N/A'}</td>
                <td className='px-4 py-3'>${meal.price}</td>
                <td className='px-4 py-3'>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${meal.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {meal.isAvailable ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className='max-w-65 px-4 py-3 text-muted-foreground'>
                  {meal.description ?? 'N/A'}
                </td>
                <td className='px-4 py-3'>{formatDateTime(meal.updatedAt)}</td>
                <td className='px-4 py-3'>
                  <div className='space-x-2 flex items-center'>
                    <Link href={`/seller-dashboard/edit-meal?id=${meal.id}`} aria-label={`Edit ${meal.foodName}`}>
                      <FaRegEdit size={24} />
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className='cursor-pointer' type='button' disabled={Boolean(deletingMealId)}>
                          <MdDelete size={24} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this meal?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove <span className='font-bold'>{meal.foodName}</span> from your
                            menu.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={Boolean(deletingMealId)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                          className='mt-2'
                            disabled={Boolean(deletingMealId)}
                            onClick={() => void handleDeleteMeal(meal.id)}
                          >
                            {deletingMealId === meal.id ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <Pagination className='mt-6'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={(event) => {
                  event.preventDefault()
                  goToPage(currentPage - 1)
                }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>

            {pageNumbers.map((page, index) => (
              <Fragment key={page}>
                {index > 0 && pageNumbers[index - 1] !== page - 1 ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}

                <PaginationItem>
                  <PaginationLink
                    href='#'
                    isActive={currentPage === page}
                    onClick={(event) => {
                      event.preventDefault()
                      goToPage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </Fragment>
            ))}

            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={(event) => {
                  event.preventDefault()
                  goToPage(currentPage + 1)
                }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  )
}

export default MyMealsTable
