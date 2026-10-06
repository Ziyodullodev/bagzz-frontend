import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider, useStore } from './context/Store'
import Layout from './components/Layout'
import Toast from './components/Toast'
import { Empty, ErrorState, Spinner } from './components/States'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Categories from './pages/Categories'
import Search from './pages/Search'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Account from './pages/Account'

const BOT_URL = import.meta.env.VITE_BOT_URL as string | undefined

function Gate() {
  const { status, error, retry } = useStore()

  if (status === 'loading') return <Spinner full />
  if (status === 'error') return <main className="screen screen--center"><ErrorState message={error ?? ''} onRetry={retry} /></main>
  if (status === 'outside') {
    return (
      <main className="screen screen--center">
        <Empty title="Open in Telegram" text="bagzz works as a Telegram Mini App. Open it from our bot to continue.">
          <span className="logo logo--lg">bagzz</span>
          {BOT_URL && <a className="btn btn--solid" href={BOT_URL}>Open the bot</a>}
        </Empty>
      </main>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Account />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app">
          <Gate />
          <Toast />
        </div>
      </BrowserRouter>
    </StoreProvider>
  )
}
