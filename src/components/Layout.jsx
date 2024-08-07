import Link from 'next/link'
import { motion } from 'framer-motion'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Logo } from '@/components/Logo'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { SectionProvider } from '@/components/SectionProvider'
export function Layout({ children, sections = [] }) {
  return (
    <SectionProvider sections={sections}>
      <div className=''>
        <div className="lg:ml-72 xl:ml-80 ">
          <motion.header
            layoutScroll
            className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
          >
        
            <div className="contents  absolute top-0 left-0 right-0 bottom-0 h-[calc(100vh-40px)] lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80  scrollbar-thumb-zinc-300 scrollbar-track-neutral-100 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-800 scrollbar-thin overflow-y-scroll">
              <div className="hidden lg:flex">
                <Link href="/" aria-label="Home">
                  <Logo className="h-6" />
                </Link>
              </div>

              <Header />
              <Navigation className="hidden lg:mt-10 lg:block " />
            </div>
          </motion.header>
          <div className="relative px-4 pt-14 sm:px-6 lg:px-8  max-h-[calc(100vh-40px)] overflow-y-auto">
            <main className="py-16">
              <Prose as="article">{children}</Prose>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </SectionProvider>
  )
}
