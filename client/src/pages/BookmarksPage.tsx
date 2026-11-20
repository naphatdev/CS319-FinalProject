import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { useQueries } from '@tanstack/react-query'
import { http } from '../api/http'
import { queryKeys } from '../api/queries'
import { CardGridSkeleton, ErrorAlert } from '../components/Feedback'
import { ReportCard } from '../components/ReportCard'
import { useUiStore } from '../stores/uiStore'
import type { Report } from '../types'

export function BookmarksPage(): ReactElement {
  const ids = useUiStore((s) => s.bookmarkIds)
  // Zustand stores only the ids; the report data itself comes from the server cache.
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.report(id),
      queryFn: () => http<Report>(`/reports/${id}`),
    })),
  })

  const loading = results.some((r) => r.isLoading)
  const failed = results.find((r) => r.isError)
  const reports = results.flatMap((r) => (r.data ? [r.data] : []))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">บุ๊กมาร์กของฉัน</h1>
      {ids.length === 0 && (
        <div className="alert">
          ยังไม่มีบุ๊กมาร์ก <Link to="/reports" className="link">ไปเลือกรายการ</Link>
        </div>
      )}
      {loading && <CardGridSkeleton count={Math.min(ids.length, 6)} />}
      {failed?.error && <ErrorAlert message={failed.error.message} />}
      {reports.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  )
}
