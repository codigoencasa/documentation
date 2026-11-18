import clsx from 'clsx'

export const brandIconPaths = {
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
  code: 'M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16',
  plug: 'M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z',
  box: 'M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
}

/** 40px tile with a stroke icon tinted by the brand gradient. */
export function BrandIcon({ name, className }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'grid h-10 w-10 flex-none place-items-center rounded-xl bg-[linear-gradient(135deg,rgb(34_211_238/.16),rgb(129_140_248/.12)_50%,rgb(192_132_252/.18))] text-bb-l2 ring-1 ring-inset ring-bb-line',
        className
      )}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={brandIconPaths[name]} />
      </svg>
    </span>
  )
}
