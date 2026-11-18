import { useEffect } from 'react'
import clsx from 'clsx'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Icon } from '@/components/Icon'
import { Navigation } from '@/components/Navigation'
import { PageHeader } from '@/components/PageHeader'
import { Prose } from '@/components/Prose'
import { SectionProvider } from '@/components/SectionProvider'
import { useSidebarStore } from '@/components/SidebarStore'
import { TableOfContents } from '@/components/TableOfContents'

export function Layout({ children, sections = [], title, sourcePath, wide = false }) {
  let { collapsed, toggle, hydrate } = useSidebarStore()
  useEffect(() => hydrate(), [hydrate])

  return (
    <SectionProvider sections={sections}>
      <Header />
      <aside
        aria-label="Documentation"
        className={clsx(
          'fixed bottom-0 left-0 top-[84px] z-30 hidden overflow-y-auto overflow-x-hidden border-r border-bb-line pb-10 transition-[width,padding] duration-300 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-bb-line2 lg:block',
          collapsed ? 'w-[68px] px-3' : 'w-72 px-6 xl:w-80'
        )}
      >
        <div className={clsx('sticky top-0 z-10', collapsed ? 'bg-bb-bg pb-3 pt-6' : 'h-0')}>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={clsx(
              'grid place-items-center rounded-lg text-bb-mute transition hover:bg-bb-chip hover:text-bb-head',
              collapsed ? 'h-9 w-full' : 'absolute -right-2 top-[18px] h-8 w-8 bg-bb-bg'
            )}
          >
            <Icon name={collapsed ? 'sidebar-open' : 'sidebar-close'} size={18} />
          </button>
        </div>
        <Navigation collapsed={collapsed} />
      </aside>
      <div
        className={clsx(
          'relative max-h-[calc(100vh-40px)] overflow-y-auto overflow-x-clip transition-[margin] duration-300',
          collapsed ? 'lg:ml-[68px]' : 'lg:ml-72 xl:ml-80'
        )}
      >
        <div className={clsx('mx-auto flex gap-10 px-4 pt-[84px] sm:px-6 lg:px-12', wide ? 'max-w-[1480px]' : collapsed ? 'max-w-[1240px]' : 'max-w-[1180px]')}>
          <div className="min-w-0 flex-1">
            <main className="py-8 lg:py-16">
              <Prose as="article" className={wide ? 'lg:[&>*]:!ml-0' : undefined}>
                <PageHeader title={title} sourcePath={sourcePath} />
                {children}
              </Prose>
            </main>
            <Footer />
          </div>
          <div className={clsx('hidden w-52 flex-none', !wide && 'xl:block')}>
            <div className="sticky top-[100px] pt-16">
              <TableOfContents />
            </div>
          </div>
        </div>
      </div>
    </SectionProvider>
  )
}
