/**
 * LAYER: Interface
 * Contains: TopBar — audience switch between the open source docs and BuilderBot Cloud (no-code)
 * Rules: Presentation only. Keep the bar 40px tall: Layout offsets (100vh - 40px) depend on it.
 * GOAL: Let people who don't want to code find the no-code SaaS without getting in the way of the docs.
 */
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { Icon } from '@/components/Icon'
import { LogoMark } from '@/components/Logo'

const CLOUD_URL = 'https://builderbot.cloud'

const COPY = {
  en: {
    nav: 'Choose how to build',
    question: 'How do you want to build?',
    code: 'With code',
    cloud: 'Without code',
    pitch: 'Same engine, visual builder, free trial',
    cta: 'Try Cloud',
  },
  es: {
    nav: 'Elige cómo construir',
    question: '¿Cómo quieres construir?',
    code: 'Con código',
    cloud: 'Sin código',
    pitch: 'Mismo motor, editor visual, prueba gratis',
    cta: 'Probar Cloud',
  },
  pt: {
    nav: 'Escolha como construir',
    question: 'Como você quer construir?',
    code: 'Com código',
    cloud: 'Sem código',
    pitch: 'Mesmo motor, editor visual, teste grátis',
    cta: 'Testar Cloud',
  },
}

const SEGMENT = 'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12.5px] sm:px-3'

export function TopBar() {
  const { pathname } = useRouter()
  const locale = pathname.split('/')[1]
  const t = COPY[locale] ?? COPY.en

  return (
    <div className="flex h-10 items-center justify-center gap-3 overflow-hidden border-b border-bb-line bg-bb-bg2 px-3 text-[13px] text-bb-ink sm:gap-3.5 sm:px-4">
      <span className="hidden whitespace-nowrap text-bb-mute md:inline">{t.question}</span>

      <nav aria-label={t.nav} className="flex flex-none gap-0.5 rounded-full bg-bb-chip p-[3px]">
        <span
          aria-current="page"
          className={clsx(SEGMENT, 'bg-bb-bg text-bb-head shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_0_0_1px_rgb(var(--bb-line))]')}
        >
          <Icon name="functions" size={14} />
          <span>
            {t.code}
            <span className="hidden lg:inline"> · Open source</span>
          </span>
        </span>
        <a href={CLOUD_URL} target="_blank" rel="noopener noreferrer" className={clsx(SEGMENT, 'text-bb-ink2 transition hover:text-bb-head')}>
          <LogoMark className="h-[13px] w-[11px]" />
          <span>
            {t.cloud}
            <span className="hidden lg:inline"> · Cloud</span>
          </span>
        </a>
      </nav>

      <span className="hidden whitespace-nowrap text-bb-mute xl:inline">{t.pitch}</span>
      <a
        href={CLOUD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden flex-none items-center gap-1 whitespace-nowrap text-[12.5px] text-bb-l2 transition hover:text-bb-head lg:inline-flex"
      >
        {t.cta}
        <Icon name="arrow" size={12} />
      </a>
    </div>
  )
}
