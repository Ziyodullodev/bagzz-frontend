import { Link } from 'react-router-dom'
import BagArt from './BagArt'
import { HeartIcon } from './Icons'
import type { Product } from '../lib/types'
import { useStore } from '../context/Store'

export default function ProductCard({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useStore()
  const fav = isFavorite(product.slug)
  return (
    <article className="tile card fade-in">
      <button
        className={`card__fav ${fav ? 'is-on' : ''}`}
        aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={fav}
        onClick={() => toggleFavorite(product)}
      >
        <HeartIcon size={18} filled={fav} />
      </button>
      <Link to={`/product/${product.slug}`} className="card__link">
        <div className="card__img"><BagArt product={product} /></div>
        <h3 className="card__name">{product.name}</h3>
        <span className="link-cta">Shop now</span>
      </Link>
    </article>
  )
}
