# bagzz — Frontend

Telegram Mini App for a bag shop, built with React 19, TypeScript and Vite from the
"Bagzz – Shopping app UI kit (Community)" Figma design. Backend: `../bagzz-backend` (Django).

## Run locally

Start the backend first (it listens on `127.0.0.1:8020`), then:

```bash
npm install
npm run dev
```

Vite proxies `/api` and `/media` to the backend. With `TELEGRAM_DEV_AUTH=true` in the backend `.env`
the app works in a normal browser as a "Dev User"; otherwise it shows an "Open in Telegram" screen.

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend API base for production builds, e.g. `https://api.example.com/api`. Empty uses the dev proxy. |
| `VITE_BOT_URL` | `https://t.me/your_bot`, shown when the app is opened outside Telegram. |

## Screens

| Route | Screen |
| --- | --- |
| `/home` | Hero carousel, latest bags, shop by categories |
| `/shop?brand=&ordering=` | All bags with category chips and sorting |
| `/categories` | All categories |
| `/search` | Live search |
| `/product/:slug` | Product with Description / Shipping info / Payment options tabs |
| `/checkout` | Contact, address, payment, place order |
| `/account`, `/orders` | Telegram profile and order history |
| `?sheet=wishlist`, `?sheet=cart` | Wishlist and cart bottom sheets over any page (blurred background, as in Figma) |

Bags without an uploaded photo are drawn as SVG handbags from the product's `look` (shape and colours).
`/orders` opens the account page, so the bot's "My orders" button lands there.

## Structure

- `src/lib/` API client, Telegram WebApp wrapper, types.
- `src/context/Store.tsx` user, cart and wishlist with optimistic updates.
- `src/components/` header, floating bottom nav, drawer menu, sheets, cards.
- `src/pages/` one file per screen. `src/index.css` design tokens at the top.

## Build

```bash
npm run build
```

On PythonAnywhere the backend serves `dist/` itself (`FRONTEND_DIST`), see `../bagzz-backend/deploy/PYTHONANYWHERE.md`.
Any other static host works too, with HTTPS and an SPA fallback to `index.html`.
