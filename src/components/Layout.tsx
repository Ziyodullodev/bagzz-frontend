import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { bindBackButton } from '../lib/telegram'
import BottomNav from './BottomNav'
import Drawer from './Drawer'
import Header from './Header'
import { CartSheet, WishlistSheet } from './Sheets'

export type SheetName = 'wishlist' | 'cart'

const ROOTS = ['/home']

export default function Layout() {
  const { pathname, state } = useLocation()
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()
  const [menu, setMenu] = useState(false)

  const raw = params.get('sheet')
  const sheet: SheetName | null = raw === 'wishlist' || raw === 'cart' ? raw : null
  const pushedSheet = Boolean((state as { sheet?: boolean } | null)?.sheet)

  const openSheet = useCallback((name: SheetName) => {
    if (sheet === name) return
    // Switching between sheets replaces the entry so Back closes the sheet in one step.
    nav({ pathname, search: `?sheet=${name}` }, { state: { sheet: true }, replace: Boolean(sheet) && pushedSheet })
  }, [sheet, pushedSheet, nav, pathname])

  const closeSheet = useCallback(() => {
    if (pushedSheet) nav(-1)
    else setParams(p => { p.delete('sheet'); return p }, { replace: true })
  }, [pushedSheet, nav, setParams])

  const closeMenu = useCallback(() => setMenu(false), [])

  useEffect(() => {
    if (sheet) return bindBackButton(closeSheet)
    if (menu) return bindBackButton(closeMenu)
    if (ROOTS.includes(pathname)) return
    return bindBackButton(() => nav(-1))
  }, [sheet, menu, pathname, nav, closeSheet, closeMenu])

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  // The page behind an open sheet must not scroll.
  useEffect(() => {
    document.body.classList.toggle('no-scroll', Boolean(sheet) || menu)
  }, [sheet, menu])

  return (
    <>
      <div className={`page ${sheet ? 'is-blurred' : ''}`} inert={Boolean(sheet)}>
        <Header onMenu={() => setMenu(true)} />
        <Outlet />
      </div>
      {sheet === 'wishlist' && <WishlistSheet onClose={closeSheet} openCart={() => openSheet('cart')} />}
      {sheet === 'cart' && <CartSheet onClose={closeSheet} />}
      <BottomNav sheet={sheet} openSheet={openSheet} />
      <Drawer open={menu} onClose={closeMenu} />
    </>
  )
}
