import type { ReactElement } from 'react'
import { Link, useParams } from 'react-router'
import { useReport } from '../api/queries'
import { ApiError } from '../api/http'
import { ErrorAlert } from '../components/Feedback'
import { SeverityBadge, StatusBadge } from '../components/StatusBadge'
import { VoteButton } from '../components/VoteButton'
import { useUiStore } from '../stores/uiStore'

export function ReportDetailPage(): ReactElement {
  const { id } = useParams<{ id: string }>()
  const reportId = Number(id)
  const { data, isLoading, isError, error, refetch } = useReport(reportId)
  const bookmarked = useUiStore((s) => s.bookmarkIds.includes(reportId))
  const toggleBookmark = useUiStore((s) => s.toggleBookmark)

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Link to="/reports" className="btn btn-ghost btn-sm">
        ← กลับไปรายการ
      </Link>

      {isLoading && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-3">
            <div className="skeleton h-6 w-1/4" />
            <div className="skeleton h-9 w-2/3" />
            <div className="skeleton h-24 w-full" />
          </div>
        </div>
      )}

      {isError && (
        <ErrorAlert
          message={error instanceof ApiError && error.status === 404 ? 'ไม่พบรายงานนี้' : error.message}
          onRetry={() => void refetch()}
        />
      )}

      {data && (
        <article className="card bg-base-100 border border-base-300 overflow-hidden">
          <div className="hero-gradient text-white px-6 py-8 space-y-3">
            <span className="badge badge-outline border-white/50 text-white">
              {data.category.icon} {data.category.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug">{data.title}</h1>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={data.status} />
              <SeverityBadge severity={data.severity} />
            </div>
          </div>
          <div className="card-body gap-5">
            <p className="whitespace-pre-line leading-relaxed">{data.description}</p>
            <dl className="grid gap-4 sm:grid-cols-2 text-sm bg-base-200 rounded-box p-4">
              <div>
                <dt className="text-base-content/60">📍 สถานที่</dt>
                <dd className="font-medium">{data.location}</dd>
              </div>
              <div>
                <dt className="text-base-content/60">👤 ผู้แจ้ง</dt>
                <dd className="font-medium">{data.author.name}</dd>
              </div>
              <div>
                <dt className="text-base-content/60">🕒 แจ้งเมื่อ</dt>
                <dd className="font-medium">{new Date(data.createdAt).toLocaleString('th-TH')}</dd>
              </div>
              <div>
                <dt className="text-base-content/60">🔄 อัปเดตล่าสุด</dt>
                <dd className="font-medium">{new Date(data.updatedAt).toLocaleString('th-TH')}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center gap-3">
              <VoteButton reportId={data.id} count={data._count.votes} />
              <span className="text-sm text-base-content/60">โหวตเพื่อสนับสนุนให้แก้ไขเร็วขึ้น</span>
              <button
                type="button"
                className="btn btn-outline btn-sm ml-auto"
                onClick={() => toggleBookmark(data.id)}
              >
                {bookmarked ? '★ บุ๊กมาร์กแล้ว' : '☆ บุ๊กมาร์ก'}
              </button>
            </div>
          </div>
        </article>
      )}
    </div>
  )
}
