import CategoryTile from '../components/CategoryTile'
import { ErrorState, SkeletonGrid } from '../components/States'
import { api } from '../lib/api'
import { useAsync } from '../lib/useAsync'

export default function Categories() {
  const { data, error, loading, reload } = useAsync(() => api.categories(), [])
  return (
    <main className="screen">
      <h1 className="section-title section-title--top">Shop by categories</h1>
      {error ? <ErrorState message={error} onRetry={reload} />
        : loading ? <SkeletonGrid />
        : <div className="grid">{data!.map(c => <CategoryTile key={c.slug} category={c} />)}</div>}
    </main>
  )
}
