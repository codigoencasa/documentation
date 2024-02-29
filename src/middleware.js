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
    const listLanguages = ['en', 'pt']
    const isValid = listLanguages.includes(parseLanguageDefault)

    if (languageDefault || !isValid) {
        return NextResponse.redirect(
            new URL(`/${listLanguages[0]}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
        )
    }
    return;
}