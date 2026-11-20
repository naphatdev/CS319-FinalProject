import type { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useMe } from '../api/queries'
import { useAuthStore } from '../stores/authStore'

export function RequireAdmin(): ReactElement {
  const token = useAuthStore((s) => s.token)
  const me = useMe()

  if (!token) return <Navigate to="/login" replace />
  if (me.isLoading) return <div className="skeleton h-40 w-full" />
  if (me.data?.role !== 'ADMIN') {
    return (
      <div role="alert" className="alert alert-error">
        <span>เฉพาะผู้ดูแลระบบเท่านั้นที่เข้าหน้านี้ได้</span>
      </div>
    )
  }
  return <Outlet />
}
