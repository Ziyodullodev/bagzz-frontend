import { useEffect, useMemo, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BagArt from './BagArt'
import { Empty, ErrorState, Spinner } from './States'
import { api } from '../lib/api'
import { money, type Product } from '../lib/types'
import { useAsync } from '../lib/useAsync'
import { useStore } from '../context/Store'

function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden />
      <section className="sheet" role="dialog" aria-modal="true" aria-label={label}>
        <button className="sheet__handle" aria-label="Close" onClick={onClose} />
        {children}
      </section>
    </>
  )
}

function Line({ product, close, aside, children }: { product: Product; close: () => void; aside?: ReactNode; children: ReactNode }) {
  return (
    <li className="line">
      <div className="line__media">
        <Link to={`/product/${product.slug}`} onClick={close} className="line__img"><BagArt product={product} /></Link>
        {aside}
      </div>
      <div className="line__body">
        <Link to={`/product/${product.slug}`} onClick={close} className="line__name">{product.name}</Link>
        <p className="line__desc">{product.subtitle}</p>
        <p className="line__style">Style #{product.style_code}</p>
        {children}
      </div>
    </li>
  )
}

export function WishlistSheet({ onClose, openCart }: { onClose: () => void; openCart: () => void }) {
  const { isFavorite, toggleFavorite, addToCart, lineFor } = useStore()
  const { data, error, loading, reload } = useAsync(() => api.favorites(), [])
  // Removing an item only flips the local flag, so filter here instead of refetching.
  const items = useMemo(() => (data ?? []).filter(p => isFavorite(p.slug)), [data, isFavorite])
  const buyable = items.filter(p => p.in_stock && !lineFor(p.slug))

  const addAll = () => {
    buyable.forEach(p => addToCart(p))
    openCart()
  }

  return (
    <Sheet label="Wishlist" onClose={onClose}>
      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? <Spinner /> : !items.length ? (
        <Empty title="Your wishlist is empty" text="Tap the heart on any bag to save it here." />
      ) : (
        <>
          <ul className="lines">
            {items.map(p => (
              <Line key={p.slug} product={p} close={onClose}>
                <button className="link-cta" onClick={() => toggleFavorite(p)}>Remove</button>
              </Line>
            ))}
          </ul>
          <button className="btn btn--solid sheet__cta" disabled={!buyable.length} onClick={addAll}>
            {buyable.length || !items.some(p => p.in_stock) ? 'Add all to cart' : 'All in your cart'}
          </button>
        </>
      )}
    </Sheet>
  )
}

export function CartSheet({ onClose }: { onClose: () => void }) {
  const { cart, changeQty } = useStore()
  const nav = useNavigate()

  return (
    <Sheet label="Cart" onClose={onClose}>
      {!cart.items.length ? (
        <Empty title="Your cart is empty" text="Bags you add will show up here." />
      ) : (
        <>
          <ul className="lines">
            {cart.items.map(l => (
              <Line
                key={l.product.slug}
                product={l.product}
                close={onClose}
                aside={
                  <div className="stepper" role="group" aria-label={`Quantity of ${l.product.name}`}>
                    <button aria-label="Decrease" onClick={() => changeQty(l.product, -1)}>−</button>
                    <span aria-live="polite">{l.quantity}</span>
                    <button aria-label="Increase" onClick={() => changeQty(l.product, 1)}>+</button>
                  </div>
                }
              >
                <p className="line__price">{money(l.line_total)}</p>
              </Line>
            ))}
          </ul>
          <div className="sheet__total"><span>Total</span><strong>{money(cart.subtotal)}</strong></div>
          <button className="btn btn--solid sheet__cta" onClick={() => nav('/checkout', { replace: true })}>Proceed to buy</button>
        </>
      )}
    </Sheet>
  )
}
