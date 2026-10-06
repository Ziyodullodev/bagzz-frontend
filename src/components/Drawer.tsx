import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { CloseIcon } from './Icons'
import { isTelegram, tg } from '../lib/telegram'
import { useStore } from '../context/Store'

const LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/shop', label: 'Shop all' },
  { to: '/categories', label: 'Categories' },
  { to: '/search', label: 'Search' },
  { to: '/account', label: 'My orders' },
]

export default function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useStore()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div className={`backdrop ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden />
      <aside className={`drawer ${open ? 'is-open' : ''}`} aria-label="Menu" aria-hidden={!open} inert={!open}>
        <div className="drawer__top">
          <span className="logo">bagzz</span>
          <button className="icon-btn" aria-label="Close menu" onClick={onClose}><CloseIcon size={22} /></button>
        </div>
        {user && <p className="drawer__hello">Hello, {user.first_name || user.display_name}</p>}
        <ul className="drawer__links">
          {LINKS.map(l => (
            <li key={l.to}><NavLink to={l.to} onClick={onClose}>{l.label}</NavLink></li>
          ))}
        </ul>
        {isTelegram && <button className="link-cta drawer__close" onClick={() => tg!.close()}>Close app</button>}
      </aside>
    </>
  )
}
