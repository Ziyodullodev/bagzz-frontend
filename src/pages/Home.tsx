import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BagArt from '../components/BagArt'
import CategoryTile from '../components/CategoryTile'
import ProductCard from '../components/ProductCard'
import { ArrowLeft, ArrowRight } from '../components/Icons'
import { ErrorState, SkeletonGrid } from '../components/States'
import { api } from '../lib/api'
import { haptic } from '../lib/telegram'
import type { Product } from '../lib/types'
import { useAsync } from '../lib/useAsync'

function Hero({ slides }: { slides: Product[] }) {
  const [i, setI] = useState(0)
  const nav = useNavigate()
  const touchX = useRef<number | null>(null)
  if (!slides.length) return <div className="hero skeleton" />

  const go = (d: number) => { haptic.select(); setI(n => (n + d + slides.length) % slides.length) }
  const p = slides[i]

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="This season's latest"
      onTouchStart={e => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchX.current == null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
    >
      <button
        key={p.slug}
        className="hero__slide fade-in"
        style={{ '--tint': p.look.body } as CSSProperties}
        onClick={() => nav(`/product/${p.slug}`)}
        aria-label={`${p.name}, slide ${i + 1} of ${slides.length}`}
      >
        <BagArt product={p} />
      </button>
      <h2 className="hero__title"><span>This</span><span>season’s</span><span>latest</span></h2>
      {slides.length > 1 && (
        <div className="hero__arrows">
          <button aria-label="Previous" onClick={() => go(-1)}><ArrowLeft size={26} /></button>
          <button aria-label="Next" onClick={() => go(1)}><ArrowRight size={26} /></button>
        </div>
      )}
    </section>
  )
}

export default function Home() {
  const products = useAsync(() => api.products({ ordering: '-sold_count' }), [])
  const featured = useAsync(() => api.products({ featured: 'true' }), [])
  const categories = useAsync(() => api.categories(), [])
  const list = useMemo(() => products.data?.results ?? [], [products.data])
  const slides = useMemo(() => (featured.data?.results.length ? featured.data.results : list).slice(0, 5), [featured.data, list])

  if (products.error) return <main className="screen"><ErrorState message={products.error} onRetry={products.reload} /></main>

  return (
    <main className="screen">
      <Hero slides={slides} />

      {products.loading ? <SkeletonGrid /> : (
        <div className="grid">{list.slice(0, 4).map(p => <ProductCard key={p.slug} product={p} />)}</div>
      )}
      <Link to="/shop" className="btn btn--outline btn--center">Check all latest</Link>

      {!!categories.data?.length && (
        <section>
          <h2 className="section-title">Shop by categories</h2>
          <div className="grid">
            {categories.data.slice(0, 4).map(c => <CategoryTile key={c.slug} category={c} />)}
          </div>
          <Link to="/categories" className="btn btn--outline btn--center">Browse all categories</Link>
        </section>
      )}
    </main>
  )
}
