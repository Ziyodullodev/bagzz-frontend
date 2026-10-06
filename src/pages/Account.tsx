import { Link } from 'react-router-dom'
import { Empty, ErrorState, Spinner } from '../components/States'
import { api } from '../lib/api'
import { money } from '../lib/types'
import { useAsync } from '../lib/useAsync'
import { useStore } from '../context/Store'

export default function Account() {
  const { user, notify } = useStore()
  const { data, error, loading, reload, setData } = useAsync(() => api.orders(), [])
  const name = user?.display_name || 'Guest'

  const cancel = async (id: number) => {
    try {
      const updated = await api.cancelOrder(id)
      setData(list => list?.map(o => (o.id === id ? updated : o)) ?? null)
      notify(`Order #${id} cancelled`)
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Could not cancel')
    }
  }

  return (
    <main className="screen">
      <section className="profile">
        <span className="avatar avatar--lg">{user?.photo_url ? <img src={user.photo_url} alt="" /> : name.charAt(0).toUpperCase()}</span>
        <div>
          <h1 className="profile__name">{name}</h1>
          <p className="muted">{user?.username && !user.username.startsWith('tg_') ? `@${user.username}` : 'Telegram account'}{user?.phone ? ` · ${user.phone}` : ''}</p>
        </div>
      </section>

      <h2 className="section-title">My orders</h2>
      {error ? <ErrorState message={error} onRetry={reload} /> : loading ? <Spinner /> : !data?.length ? (
        <Empty title="No orders yet" text="Your orders will show up here.">
          <Link to="/shop" className="btn btn--outline">Start shopping</Link>
        </Empty>
      ) : (
        <ul className="orders">
          {data.map(o => (
            <li className="order fade-in" key={o.id}>
              <div className="order__head">
                <div>
                  <strong>Order #{o.id}</strong>
                  <p className="muted">{new Date(o.created_at).toLocaleString()}</p>
                </div>
                <span className={`status status--${o.status}`}>{o.status_display}</span>
              </div>
              <ul className="order__items">
                {o.items.map(i => <li key={i.id}>{i.product_name} × {i.quantity} · {money(i.line_total)}</li>)}
              </ul>
              <div className="order__foot">
                <strong>{money(o.total)}</strong>
                {o.status === 'new' && <button className="link-cta" onClick={() => cancel(o.id)}>Cancel order</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
