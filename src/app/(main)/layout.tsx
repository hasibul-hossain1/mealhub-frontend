import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import React from 'react'

function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <>
    <Navbar/>
        {children}
    <Footer />
    </>
  )
}

export default MainLayout
