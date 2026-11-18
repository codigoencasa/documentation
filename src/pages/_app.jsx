import Head from 'next/head'
import { Router } from 'next/router'
import { MDXProvider } from '@mdx-js/react'
import { Analytics } from '@vercel/analytics/react';
import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { TopBar } from '@/components/TopBar'
import { Seo } from '@/components/Seo'

import '@/styles/tailwind.css'
import 'focus-visible'

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

export default function App({ Component, pageProps }) {
  return (
    <>
      <Seo pageTitle={pageProps?.title} description={pageProps?.description} />
      <MDXProvider components={mdxComponents}>
        <Analytics />
        <TopBar />
        <div className="translate-y-0 h-[calc(100vh-40px)] overflow-y-auto">
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </div>
      </MDXProvider>
    </>
  )
}
