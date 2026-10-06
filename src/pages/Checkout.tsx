import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BagArt from '../components/BagArt'
import { CheckIcon } from '../components/Icons'
import { Empty } from '../components/States'
import { money, type Order } from '../lib/types'
import { useStore } from '../context/Store'

export default function Checkout() {
  const { cart, user, placeOrder } = useStore()
  const nav = useNavigate()
  const [placed, setPlaced] = useState<Order | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [form, setForm] = useState({
    full_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    phone: user?.phone ?? '',
    address: '',
    comment: '',
    payment_method: 'cash' as 'card' | 'cash',
  })
  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  if (placed) {
    return (
      <main className="screen">
        <div className="empty fade-in">
          <span className="done"><CheckIcon size={34} /></span>
          <h3>Order #{placed.id} placed</h3>
          <p>We sent the details to your Telegram chat and will call you to confirm delivery.</p>
          <button className="btn btn--solid" onClick={() => nav('/account', { replace: true })}>View my orders</button>
          <Link to="/home" replace className="link-cta">Continue shopping</Link>
        </div>
      </main>
    )
  }

  if (!cart.count) {
    return (
      <main className="screen">
        <Empty title="Your cart is empty" text="Add a bag before checking out.">
          <Link to="/shop" className="btn btn--outline">Go shopping</Link>
        </Empty>
      </main>
    )
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      setPlaced(await placeOrder(form))
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Could not place the order')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="screen">
      <h1 className="section-title section-title--top">Checkout</h1>
      <ul className="mini-lines">
        {cart.items.map(l => (
          <li key={l.product.slug}>
            <span className="mini-lines__img"><BagArt product={l.product} /></span>
            <span className="mini-lines__name">{l.product.name} <em>× {l.quantity}</em></span>
            <strong>{money(l.line_total)}</strong>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="form">
        <h4>Contact</h4>
        <input className="field" placeholder="Full name" autoComplete="name" value={form.full_name} onChange={set('full_name')} />
        <input className="field" placeholder="Phone, e.g. +998 90 123 45 67" type="tel" autoComplete="tel" required value={form.phone} onChange={set('phone')} />
        <h4>Delivery</h4>
        <input className="field" placeholder="Street, house, city" autoComplete="street-address" required value={form.address} onChange={set('address')} />
        <input className="field" placeholder="Note for the courier (optional)" value={form.comment} onChange={set('comment')} />
        <h4>Payment</h4>
        <div className="options" role="radiogroup" aria-label="Payment method">
          {(['cash', 'card'] as const).map(m => (
            <button type="button" role="radio" aria-checked={form.payment_method === m} key={m} className={`option ${form.payment_method === m ? 'is-on' : ''}`} onClick={() => setForm(f => ({ ...f, payment_method: m }))}>
              {m === 'card' ? 'Card on delivery' : 'Cash on delivery'}
            </button>
          ))}
        </div>

        <dl className="summary">
          <div><dt>Items ({cart.count})</dt><dd>{money(cart.subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>{cart.shipping_fee ? money(cart.shipping_fee) : 'Free'}</dd></div>
          <div className="summary__total"><dt>Total</dt><dd>{money(cart.total)}</dd></div>
        </dl>
        {err && <p className="form-error" role="alert">{err}</p>}
        <button className="btn btn--solid btn--block" type="submit" disabled={!form.phone.trim() || !form.address.trim() || busy}>
          {busy ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </main>
  )
}
