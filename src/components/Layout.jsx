import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import { PageHeader } from '@/components/PageHeader'
import { Prose } from '@/components/Prose'
import { SectionProvider } from '@/components/SectionProvider'
import { TableOfContents } from '@/components/TableOfContents'

export function Layout({ children, sections = [], title, sourcePath }) {
  return (
    <SectionProvider sections={sections}>
      <Header />
      <aside
        aria-label="Documentation"
        className="fixed bottom-0 left-0 top-[84px] z-30 hidden w-72 overflow-y-auto border-r border-bb-line px-6 pb-10 pt-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-bb-line2 lg:block xl:w-80"
      >
        <Navigation />
      </aside>
      <div className="relative max-h-[calc(100vh-40px)] overflow-y-auto overflow-x-clip lg:ml-72 xl:ml-80">
        <div className="mx-auto flex max-w-[1180px] gap-10 px-4 pt-[84px] sm:px-6 lg:px-12">
          <div className="min-w-0 flex-1">
            <main className="py-12 lg:py-16">
              <Prose as="article">
                <PageHeader title={title} sourcePath={sourcePath} />
                {children}
              </Prose>
            </main>
            <Footer />
          </div>
          <div className="hidden w-52 flex-none xl:block">
            <div className="sticky top-[100px] pt-16">
              <TableOfContents />
            </div>
          </div>
        </div>
      </div>
    </SectionProvider>
  )
}
