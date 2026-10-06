import { Link } from 'react-router-dom'
import { MenuIcon } from './Icons'
import { useStore } from '../context/Store'

export default function Header({ onMenu }: { onMenu: () => void }) {
  const { user } = useStore()
  const name = user?.display_name || 'Guest'
  return (
    <header className="header">
      <button className="icon-btn" aria-label="Open menu" onClick={onMenu}><MenuIcon size={26} /></button>
      <Link to="/home" className="logo">bagzz</Link>
      <Link to="/account" className="avatar" aria-label="My account">
        {user?.photo_url ? <img src={user.photo_url} alt="" /> : name.charAt(0).toUpperCase()}
      </Link>
    </header>
  )
}
