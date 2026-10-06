import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { Empty, ErrorState, SkeletonGrid } from '../components/States'
import { api } from '../lib/api'
import { useAsync } from '../lib/useAsync'

const SORTS = [
  { value: '-created_at', label: 'Newest' },
  { value: '-sold_count', label: 'Popular' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: '-rating', label: 'Top rated' },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const ordering = params.get('ordering') ?? '-created_at'
  const categories = useAsync(() => api.categories(), [])
  const products = useAsync(() => api.products({ category, ordering }), [category, ordering])

  const set = (key: string, value: string) => setParams(p => {
    if (value) p.set(key, value); else p.delete(key)
    return p
  }, { replace: true })

  const title = categories.data?.find(c => c.slug === category)?.name ?? 'All bags'

  return (
    <main className="screen">
      <h1 className="section-title section-title--top">{title}</h1>
      <div className="chips" role="tablist" aria-label="Categories">
        <button role="tab" aria-selected={!category} className={`chip ${!category ? 'is-on' : ''}`} onClick={() => set('category', '')}>All</button>
        {categories.data?.map(c => (
          <button role="tab" key={c.slug} aria-selected={category === c.slug} className={`chip ${category === c.slug ? 'is-on' : ''}`} onClick={() => set('category', c.slug)}>{c.name}</button>
        ))}
      </div>
      <label className="sort">
        <span>Sort by</span>
        <select value={ordering} onChange={e => set('ordering', e.target.value)}>
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </label>
      {products.error ? <ErrorState message={products.error} onRetry={products.reload} />
        : products.loading ? <SkeletonGrid count={6} />
        : !products.data?.results.length ? <Empty title="Nothing here yet" text="Try another category." />
        : <div className="grid">{products.data.results.map(p => <ProductCard key={p.slug} product={p} />)}</div>}
    </main>
  )
}
