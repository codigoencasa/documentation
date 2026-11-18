import Link from 'next/link'
import cn from 'clsx'

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
      />
    </svg>
  )
}

const variantStyles = {
  primary:
    'rounded-full bg-bb-btn py-1.5 px-4 text-bb-btnfg hover:opacity-90',
  secondary:
    'rounded-full bg-bb-chip py-1 px-3 text-bb-head ring-1 ring-inset ring-bb-line hover:ring-bb-line2',
  filled:
    'rounded-full bg-bb-btn py-1.5 px-4 text-bb-btnfg hover:opacity-90',
  outline:
    'rounded-full py-1 px-3 text-bb-ink ring-1 ring-inset ring-bb-line2 hover:bg-bb-chip hover:text-bb-head',
  text: 'text-bb-head underline decoration-bb-line2 underline-offset-[6px] hover:decoration-bb-l2',
}

export function Button({
  variant = 'primary',
  className,
  children,
  arrow,
  ...props
}) {
  let Component = props.href ? Link : 'button'

  className = cn(
    'inline-flex max-w-full items-center gap-0.5 justify-center overflow-hidden whitespace-nowrap text-sm font-medium transition',
    variantStyles[variant],
    className
  )

  let arrowIcon = (
    <ArrowIcon
      className={cn(
        'h-5 w-5 flex-none',
        variant === 'text' && 'relative top-px',
        arrow === 'left' && '-ml-1 rotate-180',
        arrow === 'right' && '-mr-1'
      )}
    />
  )

  return (
    <Component className={className} {...props}>
      {arrow === 'left' && arrowIcon}
      <span className="min-w-0 truncate">{children}</span>
      {arrow === 'right' && arrowIcon}
    </Component>
  )
}
