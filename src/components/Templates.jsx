/**
 * LAYER: Interface
 * Contains: Templates — catalog of complete BuilderBot flows, each card showing one pasteable file
 *   and a button to run that same flow in the browser playground.
 * Rules: Presentation only. Data lives in src/lib/templates.mjs. No fetching at runtime.
 * GOAL: Go from "this is what a chatbot is asked to do" to "I just talked to it" on one screen.
 */
import { useMemo, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { Icon } from '@/components/Icon'
import { TemplatePlayground } from '@/components/TemplatePlayground'
import routes from '@/lib/generated/routes.json'
import { TEMPLATE_CATEGORIES, TEMPLATES, UPDATED } from '@/lib/templates.mjs'
import { demoFor } from '@/lib/template-demos.mjs'

/** Doc links must point to a page that exists in the current locale, otherwise fall back to /en. */
function docsHrefFor(docs, locale) {
  const [route, hash = ''] = docs.split('#')
  const locales = routes[route] ?? ['en']
  const target = locale !== 'en' && locales.includes(locale) ? `/${locale}${route}` : route
  return hash ? `${target}#${hash}` : target
}

const COPY = {
  en: {
    search: 'Search by idea: PDF, leads, voice...',
    all: 'All',
    build: 'How it works',
    docs: 'Read the docs',
    copy: 'Copy',
    copied: 'Copied',
    show: 'Show the code',
    hide: 'Hide the code',
    empty: 'No template matches that search.',
    clear: 'Clear filters',
    stats: [
      { value: '10', label: 'complete templates, one file each' },
      { value: '3', label: 'providers — WhatsApp, Telegram or Twilio — same flow' },
      { value: '10', label: 'of them run in your browser, no key needed' },
    ],
    note: 'Updated',
  },
  es: {
    search: 'Busca por idea: PDF, leads, voz...',
    all: 'Todas',
    build: 'Cómo funciona',
    docs: 'Leer la documentación',
    copy: 'Copiar',
    copied: 'Copiado',
    show: 'Ver el código',
    hide: 'Ocultar el código',
    empty: 'Ninguna plantilla coincide con esa búsqueda.',
    clear: 'Limpiar filtros',
    stats: [
      { value: '10', label: 'plantillas completas, un archivo cada una' },
      { value: '3', label: 'providers — WhatsApp, Telegram o Twilio — con el mismo flow' },
      { value: '10', label: 'corren en tu navegador, sin claves' },
    ],
    note: 'Actualizado',
  },
  pt: {
    search: 'Busque por ideia: PDF, leads, voz...',
    all: 'Todas',
    build: 'Como funciona',
    docs: 'Ler a documentação',
    copy: 'Copiar',
    copied: 'Copiado',
    show: 'Ver o código',
    hide: 'Ocultar o código',
    empty: 'Nenhum template corresponde a essa busca.',
    clear: 'Limpar filtros',
    stats: [
      { value: '10', label: 'templates completos, um arquivo cada' },
      { value: '3', label: 'providers — WhatsApp, Telegram ou Twilio — com o mesmo flow' },
      { value: '10', label: 'rodam no seu navegador, sem chaves' },
    ],
    note: 'Atualizado',
  },
}

function CopyButton({ code, labels }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={clsx(
        'flex flex-none items-center gap-1.5 rounded-lg px-2 py-1 font-mono text-[11px] transition',
        copied ? 'bg-[#818cf8]/15 text-[#c7d2fe]' : 'bg-white/5 text-[#9a998f] hover:bg-white/10 hover:text-[#ecebe4]'
      )}
    >
      <Icon name={copied ? 'check' : 'copy'} size={12} />
      {copied ? labels.copied : labels.copy}
    </button>
  )
}

function CodePanel({ file, code, labels }) {
  return (
    <div className="bb-hairline overflow-hidden rounded-xl bg-[#0e0f11] ring-1 ring-inset ring-white/5">
      <div className="flex items-center gap-3 border-b border-white/5 px-3 py-2">
        <span aria-hidden="true" className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-[#9a998f]">{file}</span>
        <CopyButton code={code} labels={labels} />
      </div>
      <pre className="overflow-x-auto px-4 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <code className="font-mono text-[12.5px] leading-[1.7] text-[#ecebe4]">{code}</code>
      </pre>
    </div>
  )
}

function TemplateCard({ template, locale, labels }) {
  const category = TEMPLATE_CATEGORIES.find((c) => c.id === template.category)
  const [open, setOpen] = useState(false)
  const docsHref = docsHrefFor(template.docs, locale)

  return (
    <article className="bb-gcard flex flex-col gap-5 rounded-2xl bg-bb-bg2 p-5 ring-1 ring-inset ring-bb-line sm:p-6">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-bb-chip text-bb-ink ring-1 ring-inset ring-bb-line"
        >
          <Icon name={category?.icon ?? 'sparkle'} size={17} className="text-bb-soft" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-normal leading-snug text-bb-head">{template.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-bb-mute">
            {category && <span>{category.label[locale] ?? category.label.en}</span>}
            <span aria-hidden="true" className="text-bb-soft">·</span>
            <span className="truncate">{template.file}</span>
          </div>
        </div>
        <Link
          href={docsHref}
          className="hidden flex-none items-center gap-1.5 text-[13px] font-medium text-bb-head underline decoration-bb-line2 underline-offset-[6px] transition hover:decoration-bb-l2 sm:inline-flex"
        >
          {labels.docs}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <p className="text-sm font-light leading-relaxed text-bb-ink2">
          {template.summary[locale] ?? template.summary.en}
        </p>
        <div className="rounded-xl bg-bb-frame/70 px-4 py-3 ring-1 ring-inset ring-bb-line/70">
          <p className="bb-kicker mb-1.5">{labels.build}</p>
          <p className="text-[13.5px] font-light leading-relaxed text-bb-ink">
            {template.recipe[locale] ?? template.recipe.en}
          </p>
        </div>
      </div>

      {open && <CodePanel file={template.file} code={template.code} labels={labels} />}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]">
        <TemplatePlayground template={template} demo={demoFor(template)} locale={locale} />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-full bg-bb-chip px-3 py-1 font-mono text-[11.5px] text-bb-ink transition hover:text-bb-head hover:ring-1 hover:ring-inset hover:ring-bb-line2"
        >
          <Icon name="functions" size={13} className="text-bb-mute" />
          {open ? labels.hide : labels.show}
          <span aria-hidden="true" className={clsx('transition-transform', open && 'rotate-180')}>
            ⌄
          </span>
        </button>
        <Link
          href={docsHref}
          className="inline-flex items-center gap-1.5 font-medium text-bb-head underline decoration-bb-line2 underline-offset-[6px] transition hover:decoration-bb-l2 sm:hidden"
        >
          {labels.docs}
        </Link>
      </div>
    </article>
  )
}

export function Templates({ locale = 'en' }) {
  const labels = COPY[locale] ?? COPY.en
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TEMPLATES.filter((template) => {
      if (category !== 'all' && template.category !== category) return false
      if (!q) return true
      const haystack = [
        template.title,
        template.summary[locale] ?? template.summary.en,
        template.recipe[locale] ?? '',
        template.file,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [query, category, locale])

  return (
    <div className="not-prose">
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-bb-line sm:grid-cols-3">
        {labels.stats.map((stat) => (
          <div key={stat.label} className="bg-bb-bg2 px-5 py-4">
            <p className="text-2xl font-light tracking-[-0.02em] text-bb-head">{stat.value}</p>
            <p className="mt-1 text-[12.5px] font-light leading-snug text-bb-mute">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-bb-soft">
        {labels.note} {UPDATED} · @builderbot/bot
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">{labels.search}</span>
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bb-mute"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.search}
            className="h-11 w-full rounded-full bg-bb-bg2 pl-11 pr-4 text-sm text-bb-ink ring-1 ring-inset ring-bb-line transition placeholder:text-bb-soft focus:outline-none focus:ring-2 focus:ring-bb-l2"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', label: labels.all }, ...TEMPLATE_CATEGORIES.map((c) => ({ id: c.id, label: c.label[locale] ?? c.label.en, icon: c.icon }))].map(
            (chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setCategory(chip.id)}
                aria-pressed={category === chip.id}
                className={clsx(
                  'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] transition',
                  category === chip.id
                    ? 'bg-bb-btn text-bb-btnfg'
                    : 'bg-bb-chip text-bb-ink2 ring-1 ring-inset ring-bb-line hover:text-bb-head hover:ring-bb-line2'
                )}
              >
                {chip.icon && <Icon name={chip.icon} size={13} />}
                {chip.label}
              </button>
            )
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-bb-bg2 px-6 py-10 text-center ring-1 ring-inset ring-bb-line">
          <p className="text-sm text-bb-ink2">{labels.empty}</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('all')
            }}
            className="mt-3 text-sm font-medium text-bb-head underline decoration-bb-line2 underline-offset-[6px] hover:decoration-bb-l2"
          >
            {labels.clear}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5">
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} locale={locale} labels={labels} />
          ))}
        </div>
      )}
    </div>
  )
}
