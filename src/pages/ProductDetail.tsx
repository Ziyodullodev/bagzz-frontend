import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BagArt from '../components/BagArt'
import { HeartIcon } from '../components/Icons'
import { ErrorState, Spinner } from '../components/States'
import { api } from '../lib/api'
import { money } from '../lib/types'
import { useAsync } from '../lib/useAsync'
import { useStore } from '../context/Store'

const TABS = ['Description', 'Shipping info', 'Payment options'] as const
type Tab = (typeof TABS)[number]

const SHIPPING = (
  <>
    <p>Orders are packed within one working day and delivered by courier. You will get a Telegram message when your bag is on its way.</p>
    <h4>Return policy</h4>
    <p>You can return an unused bag in its original packaging within 14 days of delivery. Message us in the bot and we will arrange a pickup.</p>
  </>
)

const PAYMENT = (
  <>
    <p>We accept the following payment methods:</p>
    <ul>
      <li>Cash to the courier on delivery</li>
      <li>Card to the courier on delivery</li>
    </ul>
    <p>Nothing is charged when you place the order. We call to confirm it first, then send it out.</p>
  </>
)

const DEFAULT_CARE = 'Made from carefully selected materials. Handle with care for a longer life.'

/** Renders admin text: plain lines become paragraphs, lines starting with "- " become a list. */
function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) blocks.push(<ul key={blocks.length}>{list.map((li, i) => <li key={i}>{li}</li>)}</ul>)
    list = []
  }
  text.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
    if (line.startsWith('- ')) list.push(line.slice(2))
    else { flush(); blocks.push(<p key={blocks.length}>{line}</p>) }
  })
  flush()
  return <>{blocks}</>
}

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const nav = useNavigate()
  const { isFavorite, toggleFavorite, addToCart, lineFor } = useStore()
  const { data: p, error, loading, reload } = useAsync(() => api.product(slug), [slug])
  const [tab, setTab] = useState<Tab>('Description')

  if (error) return <main className="screen"><ErrorState message={error} onRetry={reload} /></main>
  if (loading || !p) return <Spinner />

  const soldOut = !p.in_stock
  const fav = isFavorite(p.slug)

  const buyNow = () => {
    if (!lineFor(p.slug)) addToCart(p)
    nav('/checkout')
  }

  return (
    <main className="screen fade-in">
      <section className="pd">
        <div className="pd__img"><BagArt product={p} /></div>
        <div className="pd__info">
          <button className={`card__fav pd__fav ${fav ? 'is-on' : ''}`} aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={fav} onClick={() => toggleFavorite(p)}>
            <HeartIcon size={20} filled={fav} />
          </button>
          <h1 className="pd__name">{p.name}</h1>
          <p className="pd__desc">{p.subtitle}</p>
          <p className="line__style">Style #{p.style_code}</p>
          <p className="pd__price">
            {money(p.price)}
            {p.old_price != null && p.old_price > p.price && <s>{money(p.old_price)}</s>}
          </p>
          <button className="btn btn--solid btn--sm" disabled={soldOut} onClick={buyNow}>{soldOut ? 'Sold out' : 'Buy now'}</button>
          <button className="link-cta pd__add" disabled={soldOut} onClick={() => addToCart(p)}>Add to cart</button>
        </div>
      </section>

      <div className="tabs" role="tablist">
        {TABS.map(t => (
          <button key={t} role="tab" aria-selected={tab === t} className={`tab ${tab === t ? 'is-on' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="prose" role="tabpanel" aria-label={tab}>
        {tab === 'Description' && (
          <>
            <RichText text={p.description || p.subtitle} />
            {p.color && <p><strong>Colour:</strong> {p.color}</p>}
            <h4>Material &amp; care</h4>
            <RichText text={p.material_care || DEFAULT_CARE} />
          </>
        )}
        {tab === 'Shipping info' && SHIPPING}
        {tab === 'Payment options' && PAYMENT}
      </div>
    </main>
  )
}
