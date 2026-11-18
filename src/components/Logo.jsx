import { useId } from 'react'
import clsx from 'clsx'

const PATH_TOP =
  'M12.27 11.27 L12.27 11.27 Q11.00 10.00 11.00 8.50 L11.00 8.50 Q11.00 7.00 12.80 7.00 L32.20 7.00 Q34.00 7.00 35.27 8.27 L35.73 8.73 Q37.00 10.00 37.00 11.80 L37.00 15.20 Q37.00 17.00 35.73 18.27 L35.27 18.73 Q34.00 20.00 32.20 20.00 L22.80 20.00 Q21.00 20.00 19.73 18.73 Z'
const PATH_BOTTOM =
  'M12.27 32.27 L12.27 32.27 Q11.00 31.00 11.00 29.50 L11.00 29.50 Q11.00 28.00 12.80 28.00 L32.20 28.00 Q34.00 28.00 35.27 29.27 L35.73 29.73 Q37.00 31.00 37.00 32.80 L37.00 36.20 Q37.00 38.00 35.73 39.27 L35.27 39.73 Q34.00 41.00 32.20 41.00 L22.80 41.00 Q21.00 41.00 19.73 39.73 Z'

/** Builderbot "B" mark drawn with the brand gradient (cyan → indigo → violet). */
export function LogoMark({ className, strokeWidth = 5.2 }) {
  let id = useId().replace(/:/g, '')
  return (
    <svg aria-hidden="true" viewBox="8.4 4.4 31.2 39.2" className={clsx('overflow-visible', className)}>
      <defs>
        <linearGradient id={`bb-g-${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'rgb(var(--bb-l1))' }} />
          <stop offset=".5" style={{ stopColor: 'rgb(var(--bb-l2))' }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--bb-l3))' }} />
        </linearGradient>
      </defs>
      {[PATH_TOP, PATH_BOTTOM].map((d) => (
        <path
          key={d}
          className="bb-logo-path"
          pathLength="1"
          d={d}
          fill="none"
          stroke={`url(#bb-g-${id})`}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}

/** Wordmark: the mark replaces the "B" of "Builderbot", plus the Open source badge. */
export function Logo({ className, badge = true }) {
  return (
    <span className={clsx('flex items-center gap-2.5', className)}>
      <span className="inline-flex items-baseline whitespace-nowrap text-[21px] font-light leading-none tracking-[-0.02em] text-bb-head sm:text-2xl">
        <LogoMark className="mx-[0.06em] h-[0.84em] w-[0.669em] flex-none self-center" />
        <span>uilderbot</span>
        <span className="sr-only">BuilderBot</span>
      </span>
      {badge && (
        <span className="whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.06em] text-bb-ink2 ring-1 ring-inset ring-bb-line2 sm:px-2 sm:text-[10.5px]">
          Open source
        </span>
      )}
    </span>
  )
}
