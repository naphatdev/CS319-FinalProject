import type { ReactElement } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useMe } from '../api/queries'
import { useAuthStore } from '../stores/authStore'
import { useUiStore } from '../stores/uiStore'

const navClass = ({ isActive }: { isActive: boolean }): string => (isActive ? 'menu-active font-semibold' : '')

export function Layout(): ReactElement {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const bookmarkCount = useUiStore((s) => s.bookmarkIds.length)
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const me = useMe()
  const isAdmin = me.data?.role === 'ADMIN'

  const onLogout = (): void => {
    logout()
    qc.removeQueries({ queryKey: ['me'] })
    qc.removeQueries({ queryKey: ['myVotes'] })
    void navigate('/')
  }

  const links = (
    <>
      <li>
        <NavLink to="/" end className={navClass}>
          หน้าแรก
        </NavLink>
      </li>
      <li>
        <NavLink to="/reports" end className={navClass}>
          รายการปัญหา
        </NavLink>
      </li>
      <li>
        <NavLink to="/bookmarks" className={navClass}>
          บุ๊กมาร์ก
          {bookmarkCount > 0 && <span className="badge badge-sm badge-secondary">{bookmarkCount}</span>}
        </NavLink>
      </li>
      {isAdmin && (
        <li>
          <NavLink to="/admin" className={navClass}>
            จัดการระบบ
          </NavLink>
        </li>
      )}
    </>
  )

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/85 backdrop-blur">
        <div className="navbar max-w-6xl mx-auto px-4">
          <div className="navbar-start">
            <div className="dropdown lg:hidden">
              <button type="button" className="btn btn-ghost btn-square" aria-label="เมนู">
                ☰
              </button>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 p-2 shadow-lg">
                {links}
              </ul>
            </div>
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content">🏘️</span>
              <span className="hidden sm:inline">แจ้งปัญหาชุมชน</span>
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-1">{links}</ul>
          </div>
          <div className="navbar-end gap-2">
            <Link to="/reports/new" className="btn btn-secondary btn-sm sm:btn-md">
              ＋ แจ้งปัญหา
            </Link>
            {token ? (
              <div className="dropdown dropdown-end">
                <button type="button" className="btn btn-ghost btn-circle avatar placeholder">
                  <span className="bg-primary text-primary-content w-9 rounded-full grid place-items-center">
                    {me.data?.name.charAt(0) ?? '?'}
                  </span>
                </button>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg">
                  <li className="menu-title">{me.data?.name}</li>
                  <li>
                    <button type="button" onClick={onLogout}>
                      ออกจากระบบ
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md">
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
      <footer className="bg-neutral text-neutral-content">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm flex flex-col sm:flex-row justify-between gap-2">
          <span>🏘️ แจ้งปัญหาชุมชน — ช่วยกันดูแลชุมชนของเรา</span>
          <span className="opacity-70">CS319 Final Project · Phase 1</span>
        </div>
      </footer>
    </div>
  )
}
