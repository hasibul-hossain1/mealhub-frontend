import Dashboard from '@/components/dashboard/dashboard-layout'
import { Role } from '@/constant/role'
import { userService } from '@/services/user.service'
import React from 'react'

async function DashboardLayout({user,admin,seller}: {user: React.ReactNode,admin:React.ReactNode, seller: React.ReactNode}) {
  const {session} = await userService.getSession()
  const userInfo = session.user
  return (
    <div>
        <Dashboard>
            {userInfo.role === Role.ADMIN ? admin : userInfo.role === Role.SELLER ? seller : user}
        </Dashboard>
    </div>
  )
}

export default DashboardLayout