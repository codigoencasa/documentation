/**
 * LAYER: Interface (Edge Middleware)
 * Contains: Locale routing, Markdown content negotiation (`Accept: text/markdown`),
 *   and `llms.txt` HTTP discovery headers (`Link` + `X-Llms-Txt`).
 * Rules: Edge-compatible only. Never intercept `/_next`, `/api`, or static assets
 *   unless redirecting a locale-less `.md` request.
 * GOAL: Seamless routing for both human browsers and AI coding agents.
 */
import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/
const LOCALES = ['en', 'pt', 'es']

function prefersMarkdown(acceptHeader = '') {
  const accept = acceptHeader.toLowerCase()
  if (!accept.includes('text/markdown') && !accept.includes('text/x-markdown')) return false
  const mdIdx = accept.indexOf('text/markdown')
  const htmlIdx = accept.indexOf('text/html')
  return htmlIdx === -1 || (mdIdx !== -1 && mdIdx < htmlIdx)
}

function withLlmsHeaders(response, locale, routePath) {
  const cleanRoute = routePath === '/' || !routePath ? '/index' : routePath
  const mdPath = `/${locale}${cleanRoute}.md`
  response.headers.set(
    'Link',
    `<${mdPath}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/markdown", </llms-full.txt>; rel="llms-full-txt"`
  )
  response.headers.set('X-Llms-Txt', '/llms.txt')
  return response
}

export async function middleware(req) {
  const { pathname, search } = req.nextUrl

  if (pathname.startsWith('/_next') || pathname.includes('/api/')) {
    return
  }

  const firstSegment = pathname.split('/')[1] || ''
  const hasLocale = LOCALES.includes(firstSegment)

  // Support locale-less .md requests, e.g. /quickstart.md -> /en/quickstart.md
  if (pathname.endsWith('.md') && !hasLocale) {
    const target = `/en${pathname}${search}`.replace('//', '/')
    return NextResponse.redirect(new URL(target, req.url))
  }

  if (PUBLIC_FILE.test(pathname)) {
    return
  }

  if (!hasLocale) {
    const locale = 'en'
    const parseNewUrl = `/${locale}${pathname === '/' ? '' : pathname}${search}`.replace('//', '/')
    return NextResponse.redirect(new URL(parseNewUrl, req.url))
  }

  const routeAfterLocale = `/${pathname.split('/').slice(2).join('/')}`.replace(/\/+$/, '') || '/'

  // Content negotiation: serve clean Markdown when `Accept: text/markdown` is requested
  if (prefersMarkdown(req.headers.get('accept') || '')) {
    const mdTarget =
      routeAfterLocale === '/'
        ? `/${firstSegment}/index.md`
        : `/${firstSegment}${routeAfterLocale}.md`
    return withLlmsHeaders(NextResponse.rewrite(new URL(mdTarget, req.url)), firstSegment, routeAfterLocale)
  }

  return withLlmsHeaders(NextResponse.next(), firstSegment, routeAfterLocale)
}
