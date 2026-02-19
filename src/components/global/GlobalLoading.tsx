"use client"

function GlobalLoading() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/45 backdrop-blur-[1px]'>
      <div className='h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500' />
    </div>
  )
}

export default GlobalLoading
