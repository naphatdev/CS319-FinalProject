import type { ReactElement } from 'react'
import { Link } from 'react-router'
import { useCategories, useReports, useStats } from '../api/queries'
import { CardGridSkeleton, ErrorAlert } from '../components/Feedback'
import { ReportCard } from '../components/ReportCard'
import { useUiStore } from '../stores/uiStore'
import type { ReportFilters } from '../types'

const latestFilters: ReportFilters = { search: '', status: '', categoryId: null, page: 1 }

export function HomePage(): ReactElement {
  const stats = useStats()
  const latest = useReports(latestFilters, 6)
  const categories = useCategories()
  const setFilters = useUiStore((s) => s.setFilters)

  const items = [
    { label: 'รายงานทั้งหมด', icon: '📋', value: stats.data?.total, cls: 'text-primary' },
    { label: 'รอดำเนินการ', icon: '⏳', value: stats.data?.pending, cls: 'text-warning' },
    { label: 'กำลังแก้ไข', icon: '🛠️', value: stats.data?.inProgress, cls: 'text-info' },
    { label: 'แก้ไขแล้ว', icon: '✅', value: stats.data?.resolved, cls: 'text-success' },
  ]

  return (
    <div className="space-y-10">
      <section className="hero-gradient rounded-box text-white overflow-hidden relative">
        <div className="px-6 py-14 sm:px-12 sm:py-20 max-w-2xl space-y-5 relative z-10">
          <span className="badge badge-outline border-white/50 text-white">ชุมชนเข้มแข็ง เริ่มที่เรา</span>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            เห็นปัญหาในชุมชน
            <br />
            แจ้งได้ในไม่กี่คลิก
          </h1>
          <p className="text-white/85 text-lg">
            ไฟดับ ถนนพัง น้ำท่วม ขยะล้น — รวมทุกเรื่องไว้ที่เดียว ให้เพื่อนบ้านโหวตสนับสนุน
            และให้หน่วยงานเห็นปัญหาที่เร่งด่วนที่สุด
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/reports/new" className="btn btn-secondary btn-lg">
              ＋ แจ้งปัญหาใหม่
            </Link>
            <Link to="/reports" className="btn btn-lg bg-white/15 border-white/40 text-white hover:bg-white/25">
              ดูรายการปัญหา
            </Link>
          </div>
        </div>
        <div className="hidden md:block absolute right-8 bottom-4 text-[9rem] opacity-25 select-none" aria-hidden>
          🏘️
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((it) => (
          <div key={it.label} className="card bg-base-100 border border-base-300 card-lift">
            <div className="card-body p-4 sm:p-5 gap-1">
              <div className="text-2xl">{it.icon}</div>
              <div className={`text-3xl sm:text-4xl font-bold ${it.cls}`}>
                {stats.isLoading ? <span className="skeleton h-9 w-14 inline-block" /> : (it.value ?? '-')}
              </div>
              <div className="text-sm text-base-content/70">{it.label}</div>
            </div>
          </div>
        ))}
      </section>
      {stats.isError && <ErrorAlert message={stats.error.message} onRetry={() => void stats.refetch()} />}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">หมวดหมู่ปัญหา</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.isLoading &&
            Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton h-24 rounded-box" />)}
          {categories.data?.map((c) => (
            <Link
              key={c.id}
              to="/reports"
              onClick={() => setFilters({ categoryId: c.id, search: '', status: '' })}
              className="card bg-base-100 border border-base-300 card-lift text-center"
            >
              <div className="card-body p-4 items-center gap-1">
                <span className="text-3xl">{c.icon}</span>
                <span className="text-sm font-medium">{c.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">ปัญหาล่าสุด</h2>
          <Link to="/reports" className="link link-primary text-sm">
            ดูทั้งหมด →
          </Link>
        </div>
        {latest.isLoading && <CardGridSkeleton count={6} />}
        {latest.isError && <ErrorAlert message={latest.error.message} onRetry={() => void latest.refetch()} />}
        {latest.data && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.data.data.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
