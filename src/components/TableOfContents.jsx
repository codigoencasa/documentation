import Link from 'next/link'
import clsx from 'clsx'

import { useSectionStore } from '@/components/SectionProvider'

/** Right-hand "On this page" index built from the page's h2 sections. */
export function TableOfContents() {
  let sections = useSectionStore((s) => s.sections).filter((s) => !s?.not)
  let visibleSections = useSectionStore((s) => s.visibleSections)
  let activeId = visibleSections.find((id) => id !== '_top') ?? sections[0]?.id

  if (sections.length === 0) {
    return null
  }

  return (
    <nav aria-label="On this page" className="flex flex-col gap-2.5">
      <p className="bb-kicker mb-1">On this page</p>
      <ul role="list" className="flex flex-col gap-2.5">
        {sections.map((section) => {
          let active = section.id === activeId
          return (
            <li key={section.id}>
              <Link
                href={`#${section.id}`}
                aria-current={active ? 'location' : undefined}
                className={clsx(
                  '-ml-3 block border-l-2 pl-2.5 text-[13.5px] leading-snug transition',
                  active
                    ? 'border-bb-l2 text-bb-head'
                    : 'border-transparent text-bb-mute hover:text-bb-head'
                )}
              >
                {section.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
