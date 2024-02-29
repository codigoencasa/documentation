import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req) {
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return
    }

    const parseLanguageDefault = `${req.nextUrl.pathname}`.split('/')[1]
    const languageDefault = !parseLanguageDefault.length
    const listLanguages = ['en', 'pt', 'es']
    const isValid = listLanguages.includes(parseLanguageDefault)

    if (languageDefault || !isValid) {
        const locale = 'en'
        const parseNewUrl = `/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`.replace('//', '/')
        return NextResponse.redirect(
            new URL(parseNewUrl, req.url)
        )
    }
    return;
}