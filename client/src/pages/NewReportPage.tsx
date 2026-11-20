import { useState } from 'react'
import type { FormEvent, ReactElement } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCategories, useCreateReport } from '../api/queries'
import { ErrorAlert } from '../components/Feedback'
import { useAuthStore } from '../stores/authStore'
import type { Severity } from '../types'

const severities: { value: Severity; label: string }[] = [
  { value: 'LOW', label: 'ต่ำ' },
  { value: 'MEDIUM', label: 'ปานกลาง' },
  { value: 'HIGH', label: 'รุนแรง' },
]

export function NewReportPage(): ReactElement {
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const categories = useCategories()
  const create = useCreateReport()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [severity, setSeverity] = useState<Severity>('MEDIUM')

  if (!token) {
    return (
      <div className="card bg-base-100 border border-base-300 max-w-lg mx-auto">
        <div className="card-body items-center text-center gap-3">
          <span className="text-5xl">🔐</span>
          <p>กรุณาเข้าสู่ระบบก่อนแจ้งปัญหา</p>
          <Link to="/login" className="btn btn-primary">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    )
  }
  const onSubmit = (e: FormEvent): void => {
    e.preventDefault()
    create.mutate(
      { title, description, location, severity, categoryId: Number(categoryId) },
      { onSuccess: (report) => void navigate(`/reports/${report.id}`) },
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-3xl font-bold">แจ้งปัญหาในชุมชน</h1>
        <p className="text-base-content/70">บอกเล่าปัญหาที่พบ เพื่อให้เพื่อนบ้านและหน่วยงานรับรู้</p>
      </div>
      <form className="card bg-base-100 border border-base-300" onSubmit={onSubmit}>
        <div className="card-body gap-4">
          <label className="form-control w-full">
            <span className="label font-medium">หัวข้อปัญหา *</span>
            <input
              className="input input-bordered w-full"
              placeholder="เช่น ไฟถนนดับหลายดวง"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={150}
            />
          </label>
          <label className="form-control w-full">
            <span className="label font-medium">หมวดหมู่ *</span>
            <select
              className="select select-bordered w-full"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                เลือกหมวดหมู่
              </option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-full">
            <span className="label font-medium">สถานที่ *</span>
            <input
              className="input input-bordered w-full"
              placeholder="เช่น ซอยลาดพร้าว 71 หน้าตลาด"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              minLength={2}
              maxLength={200}
            />
          </label>
          <label className="form-control w-full">
            <span className="label font-medium">รายละเอียด *</span>
            <textarea
              className="textarea textarea-bordered w-full h-32"
              placeholder="อธิบายปัญหา ระยะเวลาที่เกิด และผลกระทบ"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={5}
              maxLength={2000}
            />
          </label>
          <fieldset>
            <legend className="label font-medium">ระดับความรุนแรง</legend>
            <div className="join">
              {severities.map((s) => (
                <input
                  key={s.value}
                  type="radio"
                  name="severity"
                  className="join-item btn"
                  aria-label={s.label}
                  checked={severity === s.value}
                  onChange={() => setSeverity(s.value)}
                />
              ))}
            </div>
          </fieldset>
          {create.isError && <ErrorAlert message={create.error.message} />}
          <div className="card-actions justify-end">
            <Link to="/reports" className="btn btn-ghost">
              ยกเลิก
            </Link>
            <button type="submit" className="btn btn-primary" disabled={create.isPending}>
              {create.isPending && <span className="loading loading-spinner loading-sm" />}
              ส่งรายงาน
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
