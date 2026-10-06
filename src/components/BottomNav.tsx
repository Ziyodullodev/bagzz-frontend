import { NavLink } from 'react-router-dom'
import { BasketIcon, HeartIcon, HomeIcon, SearchIcon } from './Icons'
import { useStore } from '../context/Store'
import type { SheetName } from './Layout'

type Props = { sheet: SheetName | null; openSheet: (s: SheetName) => void }

export default function BottomNav({ sheet, openSheet }: Props) {
  const { cart } = useStore()
  const cls = ({ isActive }: { isActive: boolean }) => `nav__item ${isActive && !sheet ? 'is-active' : ''}`
  return (
    <nav className="nav" aria-label="Main">
      <NavLink to="/home" className={cls} aria-label="Home"><HomeIcon size={24} /></NavLink>
      <NavLink to="/search" className={cls} aria-label="Search"><SearchIcon size={22} /></NavLink>
      <button className={`nav__item ${sheet === 'wishlist' ? 'is-active' : ''}`} aria-label="Wishlist" onClick={() => openSheet('wishlist')}>
        <HeartIcon size={24} filled />
      </button>
      <button className={`nav__item ${sheet === 'cart' ? 'is-active' : ''}`} aria-label={`Cart, ${cart.count} items`} onClick={() => openSheet('cart')}>
        <BasketIcon size={26} />
        {cart.count > 0 && <span className="nav__badge">{cart.count > 99 ? '99+' : cart.count}</span>}
      </button>
    </nav>
  )
}
