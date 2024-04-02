import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'
import { Analytics } from '@vercel/analytics/react';
import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'
import { TopBar } from '@/components/TopBar';

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()
  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>BuilderBot.app Create a WhatsApp Chatbot, Without Limit</title>
        ) : (
          <title>{`${pageProps?.title || 'Documentation'} - BuilderBot.app`}</title>
        )}

        <meta name="description" content={pageProps.description} />
        <meta property="og:url" content="https://builderbot.app/"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content={pageProps?.title} />
        <meta property="og:description" content={pageProps.description}/>
        <meta property="og:image" content={pageProps?.ogImage ?? 'https://builderbot.vercel.app/assets/og-image-v4.png'}/>
        <meta property="og:image:secure_url" content="https://builderbot.vercel.app/assets/og-image-v4.png" />
        <meta property="og:image:width" content="1200"></meta>
        <meta property="og:image:height" content="630"></meta>
        <meta property="og:image:type" content="image/png"></meta>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta property="twitter:domain" content="builderbot.app"/>
        <meta property="twitter:url" content="https://builderbot.app/"/>
        <meta name="twitter:title" content="builderbot.app - a powerful workflow automation tool"/>
        <meta name="twitter:description" content="Get started with BuilderBot - a free and open source framework with an intuitive and extensible way to create chatbot and smart apps that connect to different communication channels like Whatsapp, Telegram and others. We have made an intuitive framework so you can have your first chatbot in minutes"/>
        <meta name="twitter:image" content="https://builderbot.vercel.app/assets/og-image-v4.png"/>

      </Head>
      <MDXProvider components={mdxComponents}>
      <Analytics />
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
    </>
  )
}
