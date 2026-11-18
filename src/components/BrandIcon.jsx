import clsx from 'clsx'

import { Icon } from '@/components/Icon'

/** 40px neutral tile with an icon from the docs set (no gradient: that is reserved for the logo). */
export function BrandIcon({ name, className }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'grid h-10 w-10 flex-none place-items-center rounded-xl bg-bb-chip text-bb-head ring-1 ring-inset ring-bb-line',
        className
      )}
    >
      <Icon name={name} size={20} />
    </span>
  )
}
