import Dashboard from '@/components/dashboard/dashboard-layout'
import { Role } from '@/constant/role'
import { userService } from '@/services/user.service'
import { redirect } from 'next/navigation'
import React from 'react'

export const dynamic = "force-dynamic"

async function DashboardLayout({user,admin,seller}: {user: React.ReactNode,admin:React.ReactNode, seller: React.ReactNode}) {
  const { user: userInfo } = await userService.getSession()

  if (!userInfo) {
    redirect("/signin")
  }

  return (
    <div>
        <Dashboard role={userInfo.role!}>
            {userInfo.role === Role.ADMIN ? admin : userInfo.role === Role.SELLER ? seller : user}
        </Dashboard>
    </div>
  )
}

export default DashboardLayout
