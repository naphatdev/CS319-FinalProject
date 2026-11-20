import { useState } from 'react'
import type { FormEvent, ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../api/queries'
import { ErrorAlert } from '../components/Feedback'

export function LoginPage(): ReactElement {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const auth = useAuth(mode)

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault()
    auth.mutate(
      { email, password, ...(mode === 'register' ? { name } : {}) },
      { onSuccess: (res) => void navigate(res.user.role === 'ADMIN' ? '/admin' : '/reports') },
    )
  }

  return (
    <div className="card bg-base-100 border border-base-300 shadow-lg max-w-md mx-auto mt-6 overflow-hidden">
      <div className="hero-gradient text-white text-center py-6">
        <div className="text-4xl">🏘️</div>
        <p className="font-semibold">แจ้งปัญหาชุมชน</p>
      </div>
      <form className="card-body gap-3" onSubmit={onSubmit}>
        <h1 className="card-title text-2xl">{mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h1>
        {mode === 'register' && (
          <input
            className="input input-bordered w-full"
            placeholder="ชื่อ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
        )}
        <input
          type="email"
          className="input input-bordered w-full"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={mode === 'register' ? 6 : 1}
        />
        {auth.isError && <ErrorAlert message={auth.error.message} />}
        <button type="submit" className="btn btn-primary" disabled={auth.isPending}>
          {auth.isPending && <span className="loading loading-spinner loading-sm" />}
          {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </button>
        <button
          type="button"
          className="btn btn-link btn-sm"
          onClick={() => {
            auth.reset()
            setMode(mode === 'login' ? 'register' : 'login')
          }}
        >
          {mode === 'login' ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  )
}
