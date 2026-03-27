import { cn } from '@/lib/utils'
import { useTheme } from './ThemeProvider'

interface OlonMarkProps {
  size?: number
  className?: string
}

interface OlonWordmarkProps {
  markSize?: number
  className?: string
}

/* ── Mark only ──────────────────────────────────────────── */
export function OlonMark({ size = 32, className }: OlonMarkProps) {
  const { theme } = useTheme()

  // Dark:  nucleus = Parchment #E2D5B0 (warm, human)
  // Light: nucleus = Primary   #1E1814 (brand, on white bg)
  const nucleusFill = theme === 'dark' ? '#E2D5B0' : '#1E1814'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="olon-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8A4E0" />
          <stop offset="100%" stopColor="#5B3F9A" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" stroke="url(#olon-ring)" strokeWidth="20" />
      <circle cx="50" cy="50" r="15" fill={nucleusFill} style={{ transition: 'fill 0.2s ease' }} />
    </svg>
  )
}

/* ── Wordmark — mark + "Olon" as live SVG text (DM Serif Display) ── */
export function OlonWordmark({ markSize = 48, className }: OlonWordmarkProps) {
  const scale = markSize / 48
  const w = 168 * scale
  const h = 52 * scale

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 168 52"
      fill="none"
      overflow="visible"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="olon-wm-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8A4E0" />
          <stop offset="100%" stopColor="#5B3F9A" />
        </linearGradient>
      </defs>

      {/* Mark */}
      <circle cx="24" cy="24" r="18.24" stroke="url(#olon-wm-ring)" strokeWidth="9.6" />
      <circle cx="24" cy="24" r="7.2" fill="#E2D5B0" />

      {/* "Olon" — Merriweather via --wordmark-* tokens (style prop required for var() in SVG) */}
      <text
        x="57"
        y="38"
        fill="#E2D5B0"
        style={{
          fontFamily:           'var(--wordmark-font)',
          fontSize:             '48px',
          letterSpacing:        'var(--wordmark-tracking)',
          fontWeight:           'var(--wordmark-weight)',
          fontVariationSettings: '"wdth" var(--wordmark-width)',
        }}
      >
        Olon
      </text>
    </svg>
  )
}
