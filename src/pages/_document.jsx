import { Head, Html, Main, NextScript } from 'next/document'

const modeScript = `
  updateMode()
  window.addEventListener('storage', updateModeWithoutTransitions)

  function updateMode() {
    /* Dark is the default; light only when the user explicitly picks it */
    let isDarkMode = window.localStorage.isDarkMode !== 'false'

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`

export default function Document({ __NEXT_DATA__ }) {
  const pathname = __NEXT_DATA__?.page ?? '/'
  const lang = ['en', 'es', 'pt'].find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)) ?? 'en'

  return (
    <Html lang={lang}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preload" href="/fonts/CalSansUI-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/GeistMono-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48 64x64" />
        <link rel="icon" href="/brand/app-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#111214" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fafaf8" media="(prefers-color-scheme: light)" />
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </Head>
      <body className="bg-bb-bg text-bb-ink antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
