import clsx from 'clsx'

/**
 * Builderbot docs icon set (see the "Sistema" board in the design canvas).
 * 24 px grid, 1.6 px rounded stroke, radius 2, containers carry the 45° cut of the "B".
 * Use one color (currentColor); sizes 16, 20 or 24.
 */
export const iconPaths = {
  "sidebar-close": "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9.5 4v16M16 9.5 13.5 12l2.5 2.5",
  "sidebar-open": "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9.5 4v16M13.5 9.5 16 12l-2.5 2.5",
  "book": "M5 5.5A1.5 1.5 0 0 1 6.5 4H18v13H7.5A2.5 2.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H18v-4",
  "bolt": "M13 3 5 13.5h6L10 21l8-10.5h-6L13 3z",
  "blocks": "M8 4h10a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H9L5 6.5A2 2 0 0 1 8 4zM8 14h10a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H9l-4-3.5A2 2 0 0 1 8 14z",
  "examples": "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM16.5 13.5v6M13.5 16.5h6",
  "functions": "M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16",
  "context": "M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 1 0 0-10zM12 11.2a.8.8 0 1 0 0 1.6.8.8 0 1 0 0-1.6z",
  "terminal": "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8l-4-4V6a2 2 0 0 1 2-2zM8 9l3 3-3 3M13 15h3",
  "events": "M12 12h.01M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8",
  "database": "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  "plug": "M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v5",
  "cloud": "M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6.2 9.5 4.3 4.3 0 0 0 7 18z",
  "phone": "M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z",
  "qr": "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h.01M18 14h2",
  "browser": "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8l-4-4V6a2 2 0 0 1 2-2zM4 9h16M7 6.5h.01M10 6.5h.01",
  "upload": "M12 17V9M8.5 12.5 12 9l3.5 3.5M7 20h10a4 4 0 0 0 .6-8A6 6 0 0 0 6.2 11.5 4.3 4.3 0 0 0 7 20z",
  "layers": "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5",
  "container": "M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8",
  "server": "M6 3h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM6 13h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8l-4-4v-2a2 2 0 0 1 2-2zM8 7h.01M8 17h.01",
  "queue": "M4 6h12M4 11h12M4 16h8M20 4v16",
  "modules": "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  "fast": "M4 6l7 6-7 6V6zM13 6l7 6-7 6V6z",
  "clock": "M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM12 7v5l3 2",
  "reboot": "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 8v4l2.5 1.5",
  "swap": "M7 4 3 8l4 4M3 8h14M17 12l4 4-4 4M21 16H7",
  "bell": "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2zM10 21h4",
  "human": "M9 11a4 4 0 1 0 0-8 4 4 0 1 0 0 8zM2 21a7 7 0 0 1 14 0M17 8h5M19.5 5.5 22 8l-2.5 2.5",
  "branch": "M6 3v12M6 15a3 3 0 1 0 0 6 3 3 0 1 0 0-6zM18 9a3 3 0 1 0 0-6 3 3 0 1 0 0 6zM18 9a9 9 0 0 1-9 9",
  "messages": "M5 4h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3V6a2 2 0 0 1 0-2zM21 9v8a1 1 0 0 1-1 1h-1v3l-4-3h-5",
  "migrate": "M4 4h7v16H4zM14 12h7M18 8l4 4-4 4",
  "api": "M9 4H7.5A2.5 2.5 0 0 0 5 6.5v3L3 12l2 2.5v3A2.5 2.5 0 0 0 7.5 20H9M15 4h1.5A2.5 2.5 0 0 1 19 6.5v3l2 2.5-2 2.5v3a2.5 2.5 0 0 1-2.5 2.5H15M14 8l-4 8",
  "sparkle": "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z",
  "link": "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  "doc": "M6 3h8l6 6v10a2 2 0 0 1-2 2H8l-4-4V5a2 2 0 0 1 2-2zM14 3v6h6M8 13h8M8 17h5",
  "chip": "M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4",
  "shapes": "M4 4h7v7H4zM17.5 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zM7.5 13 11 20H4l3.5-7zM14 14h6v6h-6z",
  "send": "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z",
  "bag": "M5 8h14l-1 13H6L5 8zM9 8V6a3 3 0 0 1 6 0v2",
  "agent": "M5 7h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6l-3-3V9a2 2 0 0 1 2-2zM14 7h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V7zM8 11v2M17 11v2",
  "search": "M11 4a7 7 0 1 0 0 14 7 7 0 1 0 0-14zM20 20l-3.5-3.5",
  "copy": "M10 9h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zM5 15H4.5A1.5 1.5 0 0 1 3 13.5V5a2 2 0 0 1 2-2h8.5A1.5 1.5 0 0 1 15 4.5V5",
  "check": "M5 12.5l4.5 4.5L19 7",
  "external": "M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4",
  "arrow": "M5 12h14M13 6l6 6-6 6",
  "chevron": "M6 9l6 6 6-6",
  "menu": "M4 6h16M4 12h16M4 18h10",
  "close": "M6 6l12 12M18 6 6 18",
  "sun": "M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  "moon": "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
  "edit": "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  "info": "M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM12 11v5M12 8h.01",
  "warning": "M12 4 2.5 20h19L12 4zM12 10v4M12 17h.01",
  "play": "M7 5v14l12-7z",
  "globe": "M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
}

export function Icon({ name, size = 20, className, strokeWidth = 1.6, title, ...props }) {
  let d = iconPaths[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      className={clsx('flex-none', className)}
      {...props}
    >
      {title && <title>{title}</title>}
      <path d={d} />
    </svg>
  )
}
