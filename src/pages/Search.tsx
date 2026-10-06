import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CloseIcon } from '../components/Icons'
import { Spinner } from '../components/States'
import { api } from '../lib/api'
import { useAsync } from '../lib/useAsync'

export default function Search() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [term, setTerm] = useState('')

  useEffect(() => {
    const t = window.setTimeout(() => setTerm(q.trim()), 250)
    return () => window.clearTimeout(t)
  }, [q])

  const { data, loading, error } = useAsync(
    () => (term ? api.products({ search: term }).then(r => r.results) : Promise.resolve([])),
    [term],
  )

  const close = () => (window.history.length > 1 ? nav(-1) : nav('/home'))

  return (
    <main className="screen search">
      <button className="icon-btn search__close" aria-label="Close search" onClick={close}><CloseIcon size={22} /></button>
      <form className="search__field" role="search" onSubmit={e => { e.preventDefault(); setTerm(q.trim()) }}>
        <input
          autoFocus
          type="search"
          aria-label="Search bags"
          placeholder="Type here to search"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        {q && <button type="button" className="search__clear" aria-label="Clear" onClick={() => setQ('')}><CloseIcon size={16} /></button>}
      </form>
      {term && (loading ? <Spinner /> : error ? <p className="muted">{error}</p> : !data?.length ? (
        <p className="muted">No bags match “{term}”.</p>
      ) : (
        <ul className="search__results">
          {data.map(p => <li key={p.slug}><Link to={`/product/${p.slug}`}>{p.name}</Link></li>)}
        </ul>
      ))}
    </main>
  )
}
