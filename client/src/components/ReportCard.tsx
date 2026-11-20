import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { useUiStore } from '../stores/uiStore'
import type { Report } from '../types'
import { SeverityBadge, StatusBadge, severityMap } from './StatusBadge'
import { VoteButton } from './VoteButton'

export function ReportCard({ report }: { report: Report }): ReactElement {
  const bookmarked = useUiStore((s) => s.bookmarkIds.includes(report.id))
  const toggleBookmark = useUiStore((s) => s.toggleBookmark)

  return (
    <div
      className={`card card-lift bg-base-100 border border-base-300 border-t-4 ${severityMap[report.severity].border}`}
    >
      <div className="card-body gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-md gap-1 border-primary/30 bg-primary/15 font-medium text-teal-900">
            {report.category.icon} {report.category.name}
          </span>
          <button
            type="button"
            className={`btn btn-circle btn-ghost btn-sm text-lg ${bookmarked ? 'text-secondary' : ''}`}
            aria-label={bookmarked ? 'ลบบุ๊กมาร์ก' : 'บุ๊กมาร์ก'}
            onClick={() => toggleBookmark(report.id)}
          >
            {bookmarked ? '★' : '☆'}
          </button>
        </div>
        <Link to={`/reports/${report.id}`} className="hover:text-primary transition-colors">
          <h2 className="card-title text-lg leading-snug">{report.title}</h2>
        </Link>
        <div className="rounded-xl bg-base-200 border border-base-300 p-3 space-y-2 text-sm text-base-content/90">
          <p className="line-clamp-2">{report.description}</p>
          <div className="border-t border-base-300 pt-2 space-y-1">
            <p>📍 {report.location}</p>
            <p>
              🕒 แจ้งเมื่อ{' '}
              <time dateTime={report.createdAt}>
                {new Date(report.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
              </time>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={report.status} />
          <SeverityBadge severity={report.severity} />
        </div>
        <div className="divider my-0 before:bg-base-300 after:bg-base-300" />
        <div className="flex items-center justify-between">
          <VoteButton reportId={report.id} count={report._count.votes} />
          <Link to={`/reports/${report.id}`} className="btn btn-primary btn-sm">
            ดูรายละเอียด →
          </Link>
        </div>
      </div>
    </div>
  )
}
