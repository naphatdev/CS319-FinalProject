import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { useReports, useStats, useUpdateReportStatus, useDeleteReport } from '../api/queries'
import { ErrorAlert } from '../components/Feedback'
import { useUiStore } from '../stores/uiStore'
import type { ReportStatus } from '../types'

const ADMIN_PAGE_SIZE = 10

export function AdminPage(): ReactElement {
  const filters = useUiStore((s) => s.filters)
  const setFilters = useUiStore((s) => s.setFilters)
  const stats = useStats()
  const reports = useReports(filters, ADMIN_PAGE_SIZE)
  const updateStatus = useUpdateReportStatus()
  const remove = useDeleteReport()

  const onDelete = (id: number, title: string): void => {
    if (window.confirm(`ลบรายงาน "${title}" ?`)) remove.mutate(id)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">จัดการระบบ (ผู้ดูแล)</h1>

      <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-100 w-full">
        <div className="stat">
          <div className="stat-title">ทั้งหมด</div>
          <div className="stat-value">{stats.data?.total ?? '-'}</div>
        </div>
        <div className="stat">
          <div className="stat-title">รอดำเนินการ</div>
          <div className="stat-value">{stats.data?.pending ?? '-'}</div>
        </div>
        <div className="stat">
          <div className="stat-title">กำลังแก้ไข</div>
          <div className="stat-value">{stats.data?.inProgress ?? '-'}</div>
        </div>
        <div className="stat">
          <div className="stat-title">แก้ไขแล้ว</div>
          <div className="stat-value">{stats.data?.resolved ?? '-'}</div>
        </div>
      </div>

      <input
        type="search"
        className="input input-bordered w-full sm:max-w-sm"
        placeholder="ค้นหารายงาน"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />

      {(updateStatus.isError || remove.isError) && (
        <ErrorAlert message={(updateStatus.error ?? remove.error)?.message ?? 'เกิดข้อผิดพลาด'} />
      )}
      {reports.isError && <ErrorAlert message={reports.error.message} onRetry={() => void reports.refetch()} />}

      <div className="overflow-x-auto bg-base-100 rounded-box shadow-sm">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>หัวข้อ</th>
              <th>หมวดหมู่</th>
              <th>👍</th>
              <th>สถานะ</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {reports.isLoading &&
              Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td colSpan={6}>
                    <div className="skeleton h-6 w-full" />
                  </td>
                </tr>
              ))}
            {reports.data?.data.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>
                  <Link to={`/reports/${r.id}`} className="link">
                    {r.title}
                  </Link>
                </td>
                <td>{r.category.icon} {r.category.name}</td>
                <td>{r._count.votes}</td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={r.status}
                    disabled={updateStatus.isPending}
                    onChange={(e) => updateStatus.mutate({ id: r.id, status: e.target.value as ReportStatus })}
                  >
                    <option value="PENDING">รอดำเนินการ</option>
                    <option value="IN_PROGRESS">กำลังแก้ไข</option>
                    <option value="RESOLVED">แก้ไขแล้ว</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-error btn-outline btn-sm"
                    disabled={remove.isPending}
                    onClick={() => onDelete(r.id, r.title)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reports.data && (
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
      )}
    </div>
  )
}
