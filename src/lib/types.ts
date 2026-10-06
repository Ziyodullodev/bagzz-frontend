export type BagLook = { shape: 'satchel' | 'top_handle' | 'tote'; body: string; trim: string; handle: string; hardware: string }

export type Brand = { id: number; name: string; slug: string; logo: string | null }

export type CategoryRef = { id: number; name: string; slug: string }

export type Category = CategoryRef & {
  image: string | null
  product_count: number
  cover: { id: number; name: string; image: string | null; look: BagLook } | null
}

export type Product = {
  id: number
  slug: string
  name: string
  subtitle: string
  style_code: string
  color: string
  category: CategoryRef
  brand: Brand | null
  price: number
  old_price: number | null
  rating: number
  image: string | null
  look: BagLook
  in_stock: boolean
  is_featured: boolean
  is_favorite: boolean
  description?: string
  material_care?: string
  stock?: number
}

export type CartLine = { id: number; product: Product; quantity: number; line_total: number }

export type Cart = { items: CartLine[]; count: number; subtotal: number; shipping_fee: number; total: number }

export type User = {
  id: number
  telegram_id: number | null
  username: string
  first_name: string
  last_name: string
  display_name: string
  photo_url: string
  phone: string
}

export type OrderItem = { id: number; product_slug: string; product_name: string; style_code: string; price: number; quantity: number; line_total: number }

export type Order = {
  id: number
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  status_display: string
  payment_method: 'card' | 'cash'
  is_paid: boolean
  full_name: string
  phone: string
  address: string
  comment: string
  subtotal: number
  shipping_fee: number
  total: number
  items: OrderItem[]
  created_at: string
}

export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] }

export type OrderInput = { full_name?: string; phone: string; address: string; comment?: string; payment_method: 'card' | 'cash' }

export const money = (n: number) => `$${n.toFixed(2)}`
