type P = { size?: number; filled?: boolean }
const base = (size = 24) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true })

export const MenuIcon = ({ size }: P) => (
  <svg {...base(size)} strokeWidth={2}><path d="M3 6h18M3 12h11M3 18h18M18 12h3" /></svg>
)
export const SearchIcon = ({ size }: P) => (
  <svg {...base(size)} strokeWidth={3}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.5-4.5" /></svg>
)
export const HeartIcon = ({ size, filled }: P) => (
  <svg {...base(size)} strokeWidth={1.6} fill={filled ? 'currentColor' : 'none'}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" /></svg>
)
export const HomeIcon = ({ size }: P) => (
  <svg {...base(size)} fill="currentColor" stroke="none"><path d="M12 2.5 3 10v11.5h6V15a3 3 0 0 1 6 0v6.5h6V10z" /></svg>
)
export const BasketIcon = ({ size }: P) => (
  <svg {...base(size)} fill="currentColor" stroke="none"><path d="M8.3 2.6 4.6 9H2v3h1l1.8 9.2A1 1 0 0 0 5.8 22h12.4a1 1 0 0 0 1-.8L21 12h1V9h-2.6l-3.7-6.4-1.7 1L17.1 9H6.9l3.1-5.4zM8 13.5h2v6H8zm3 0h2v6h-2zm3 0h2v6h-2z" /></svg>
)
export const ArrowLeft = ({ size }: P) => (
  <svg {...base(size)} strokeWidth={2}><path d="M20 12H4M10 6l-6 6 6 6" /></svg>
)
export const ArrowRight = ({ size }: P) => (
  <svg {...base(size)} strokeWidth={2}><path d="M4 12h16M14 6l6 6-6 6" /></svg>
)
export const CloseIcon = ({ size = 20 }: P) => (
  <svg {...base(size)} strokeWidth={3}><path d="M18 6 6 18M6 6l12 12" /></svg>
)
export const CheckIcon = ({ size = 20 }: P) => (
  <svg {...base(size)} strokeWidth={2.5}><path d="M20 6 9 17l-5-5" /></svg>
)
