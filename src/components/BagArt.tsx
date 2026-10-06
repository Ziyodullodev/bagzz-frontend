import type { BagLook } from '../lib/types'

type Props = { product: { name: string; image: string | null; look: BagLook } }

/** Product photo when the admin uploaded one, otherwise a handbag drawn from the product's `look`. */
export default function BagArt({ product }: Props) {
  if (product.image) return <img src={product.image} alt={product.name} loading="lazy" />
  const { shape, body, trim, handle, hardware } = product.look
  return (
    <svg viewBox="0 0 160 140" role="img" aria-label={product.name}>
      <ellipse cx="80" cy="130" rx="56" ry="5" fill="rgba(0,0,0,.1)" />
      {shape === 'tote' ? (
        <>
          <path d="M50 58 C50 18 74 14 74 58 M86 58 C86 14 110 18 110 58" stroke={handle} strokeWidth="5" fill="none" />
          <path d="M34 58 H126 L118 124 H42 Z" fill={body} />
          <path d="M34 58 H126 L125 66 H35 Z" fill={trim} />
          <path d="M80 66 V124" stroke="rgba(0,0,0,.1)" strokeWidth="2" />
          <circle cx="80" cy="74" r="3" fill={hardware} />
        </>
      ) : shape === 'top_handle' ? (
        <>
          <path d="M58 50 V34 Q80 22 102 34 V50" stroke={handle} strokeWidth="6" fill="none" />
          <rect x="30" y="50" width="100" height="72" rx="6" fill={body} />
          <path d="M30 56 Q30 50 36 50 H124 Q130 50 130 56 V86 Q80 98 30 86 Z" fill={trim} />
          <rect x="72" y="80" width="16" height="12" rx="2" fill={hardware} />
          <path d="M36 112 H124" stroke="rgba(0,0,0,.12)" strokeWidth="2" />
        </>
      ) : (
        <>
          <path d="M52 52 C52 20 108 20 108 52" stroke={handle} strokeWidth="6" fill="none" />
          <path d="M28 60 Q80 44 132 60 L138 118 Q80 132 22 118 Z" fill={body} />
          <path d="M28 60 Q80 44 132 60 L131 70 Q80 56 29 70 Z" fill={trim} />
          <path d="M40 92 Q80 102 120 92" stroke="rgba(255,255,255,.18)" strokeWidth="2" fill="none" />
          <circle cx="112" cy="84" r="9" fill="none" stroke={hardware} strokeWidth="3" />
          <rect x="74" y="56" width="12" height="8" rx="2" fill={hardware} />
        </>
      )}
    </svg>
  )
}
