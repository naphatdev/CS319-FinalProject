import type { ReactElement } from 'react'

export function CardSkeleton(): ReactElement {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body gap-3 p-5">
        <div className="skeleton h-6 w-1/3" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-8 w-24" />
      </div>
    </div>
  )
}

export function CardGridSkeleton({ count = 6 }: { count?: number }): ReactElement {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ErrorAlert({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}): ReactElement {
  return (
    <div role="alert" className="alert alert-error alert-soft">
      <span>⚠️ เกิดข้อผิดพลาด: {message}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm" onClick={onRetry}>
          ลองอีกครั้ง
        </button>
      )}
    </div>
  )
}
