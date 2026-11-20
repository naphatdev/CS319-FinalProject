import type { ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { useMyVotes, useToggleVote } from '../api/queries'
import { useAuthStore } from '../stores/authStore'

export function VoteButton({ reportId, count }: { reportId: number; count: number }): ReactElement {
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const myVotes = useMyVotes()
  const toggle = useToggleVote()
  const voted = myVotes.data?.includes(reportId) ?? false

  const onClick = (): void => {
    if (!token) {
      void navigate('/login')
      return
    }
    toggle.mutate(reportId)
  }

  return (
    <button
      type="button"
      className={`btn btn-sm ${voted ? 'btn-primary' : 'btn-outline'}`}
      disabled={toggle.isPending}
      onClick={onClick}
      title={token ? undefined : 'เข้าสู่ระบบเพื่อโหวต'}
    >
      👍 {count}
    </button>
  )
}
