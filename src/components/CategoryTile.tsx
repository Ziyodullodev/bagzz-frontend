import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import BagArt from './BagArt'
import type { Category } from '../lib/types'

/** A category card: its photo, or the top bag drawn on a tinted background, with the name in a black label. */
export default function CategoryTile({ category }: { category: Category }) {
  const { cover } = category
  const style = { '--tint': cover?.look.body ?? '#999' } as CSSProperties
  return (
    <Link to={`/shop?category=${category.slug}`} className="category fade-in" style={style}>
      {category.image ? <img src={category.image} alt="" loading="lazy" /> : cover && <BagArt product={cover} />}
      <span className="category__label">{category.name}</span>
    </Link>
  )
}
