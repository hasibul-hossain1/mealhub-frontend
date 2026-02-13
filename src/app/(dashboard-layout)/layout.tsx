import Dashboard from '@/components/dashboard/dashboard-layout'
import React from 'react'

function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <Dashboard>
            {children}
        </Dashboard>
    </div>
  )
}

export default DashboardLayout