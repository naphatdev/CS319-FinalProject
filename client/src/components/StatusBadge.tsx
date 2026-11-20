import type { ReactElement } from 'react'
import type { ReportStatus, Severity } from '../types'

// Solid backgrounds + dark/white text for strong contrast on white cards.
export const statusMap: Record<ReportStatus, { label: string; cls: string }> = {
  PENDING: { label: 'รอดำเนินการ', cls: 'bg-amber-400 text-amber-950' },
  IN_PROGRESS: { label: 'กำลังแก้ไข', cls: 'bg-sky-600 text-white' },
  RESOLVED: { label: 'แก้ไขแล้ว', cls: 'bg-emerald-600 text-white' },
}

export const severityMap: Record<Severity, { label: string; cls: string; border: string }> = {
  LOW: { label: 'ความรุนแรงต่ำ', cls: 'bg-slate-200 text-slate-800', border: 'border-t-slate-400' },
  MEDIUM: { label: 'ปานกลาง', cls: 'bg-orange-100 text-orange-900 border-orange-400', border: 'border-t-orange-400' },
  HIGH: { label: 'รุนแรง', cls: 'bg-red-600 text-white', border: 'border-t-red-600' },
}

const base = 'badge badge-md border font-medium'

export function StatusBadge({ status }: { status: ReportStatus }): ReactElement {
  const { label, cls } = statusMap[status]
  return <span className={`${base} border-transparent ${cls}`}>{label}</span>
}

export function SeverityBadge({ severity }: { severity: Severity }): ReactElement {
  const { label, cls } = severityMap[severity]
  return <span className={`${base} border-transparent ${cls}`}>{label}</span>
}
