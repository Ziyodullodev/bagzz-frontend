import type { ReactNode } from 'react'

export function Spinner({ full }: { full?: boolean }) {
  return <div className={full ? 'spinner-wrap spinner-wrap--full' : 'spinner-wrap'}><span className="spinner" aria-label="Loading" /></div>
}

export function Empty({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Empty title="Something went wrong" text={message}>
      {onRetry && <button className="btn btn--outline" onClick={onRetry}>Try again</button>}
    </Empty>
  )
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid">
      {Array.from({ length: count }, (_, i) => <div key={i} className="tile skeleton" style={{ height: 180 }} />)}
    </div>
  )
}
