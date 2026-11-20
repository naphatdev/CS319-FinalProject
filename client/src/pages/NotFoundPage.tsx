import type { ReactElement } from 'react'
import { Link } from 'react-router'

export function NotFoundPage(): ReactElement {
  return (
    <div className="text-center py-20 space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p>ไม่พบหน้าที่ต้องการ</p>
      <Link to="/" className="btn btn-primary">
        กลับหน้าแรก
      </Link>
    </div>
  )
}
