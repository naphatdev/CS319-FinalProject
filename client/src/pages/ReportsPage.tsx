import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { useCategories, useReports } from '../api/queries'
import { CardGridSkeleton, ErrorAlert } from '../components/Feedback'
import { ReportCard } from '../components/ReportCard'
import { useUiStore } from '../stores/uiStore'
import type { ReportStatus } from '../types'

export function ReportsPage(): ReactElement {
  const filters = useUiStore((s) => s.filters)
  const setFilters = useUiStore((s) => s.setFilters)
  const resetFilters = useUiStore((s) => s.resetFilters)
  const categories = useCategories()
  const reports = useReports(filters)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">รายการปัญหาในชุมชน</h1>
          <p className="text-base-content/70">ค้นหา กรอง และโหวตสนับสนุนปัญหาที่ควรแก้ไขก่อน</p>
        </div>
        <Link to="/reports/new" className="btn btn-secondary">
          ＋ แจ้งปัญหา
        </Link>
      </div>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body p-4 gap-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="search"
              className="input input-bordered w-full lg:col-span-2"
              placeholder="🔍 ค้นหาหัวข้อ รายละเอียด หรือสถานที่"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
            <select
              className="select select-bordered w-full"
              value={filters.categoryId ?? ''}
              onChange={(e) => setFilters({ categoryId: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">ทุกหมวดหมู่</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered w-full"
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value as ReportStatus | '' })}
            >
              <option value="">ทุกสถานะ</option>
              <option value="PENDING">รอดำเนินการ</option>
              <option value="IN_PROGRESS">กำลังแก้ไข</option>
              <option value="RESOLVED">แก้ไขแล้ว</option>
            </select>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/70">{reports.data ? `พบ ${reports.data.meta.total} รายการ` : ' '}</span>
            <button type="button" className="btn btn-ghost btn-xs" onClick={resetFilters}>
              ล้างตัวกรอง
            </button>
          </div>
        </div>
      </div>

      {reports.isLoading && <CardGridSkeleton count={9} />}
      {reports.isError && (
        <ErrorAlert message={reports.error.message} onRetry={() => void reports.refetch()} />
      )}
      {reports.data && (
        <>
          {reports.data.data.length === 0 ? (
            <div className="card bg-base-100 border border-dashed border-base-300">
              <div className="card-body items-center text-center">
                <span className="text-5xl">🔎</span>
                <p>ไม่พบรายการที่ตรงกับตัวกรอง</p>
              </div>
            </div>
          ) : (
            <div
              className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity ${reports.isPlaceholderData ? 'opacity-60' : ''}`}
            >
              {reports.data.data.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          )}
          <div className="join flex justify-center">
            <button
              type="button"
              className="join-item btn"
              disabled={filters.page <= 1}
              onClick={() => setFilters({ page: filters.page - 1 })}
            >
              «
            </button>
            <span className="join-item btn btn-disabled">
              หน้า {reports.data.meta.page} / {Math.max(reports.data.meta.totalPages, 1)}
            </span>
            <button
              type="button"
              className="join-item btn"
              disabled={filters.page >= reports.data.meta.totalPages}
              onClick={() => setFilters({ page: filters.page + 1 })}
            >
              »
            </button>
          </div>
        </>
      )}
    </div>
  )
}
