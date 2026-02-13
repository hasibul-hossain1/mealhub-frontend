import Navbar from '@/components/common/Navbar'
import React from 'react'

function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <>
    <Navbar/>
        {children}
    </>
  )
}

export default MainLayout