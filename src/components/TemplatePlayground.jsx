/**
 * LAYER: Interface
 * Contains: TemplatePlayground — the button on each template card that opens a live demo of that
 *   template's flow in a dialog, running the real @builderbot/bot core in the browser.
 * Rules: Presentation only. Demo snippets live in src/lib/template-demos.mjs. The Playground (and the
 *   bundled engine) is loaded on demand so the templates page stays light.
 * GOAL: Go from "this is the popular automation" to "I just talked to it" without leaving the page.
 */
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Dialog } from '@headlessui/react'
import clsx from 'clsx'

import { Icon } from '@/components/Icon'

const Playground = dynamic(() => import('@/components/Playground').then((mod) => mod.Playground), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl bg-bb-bg2 ring-1 ring-inset ring-bb-line">
      <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-bb-mute">Loading engine…</span>
    </div>
  ),
})

const COPY = {
  en: {
    open: 'Try it live',
    title: 'Try this template',
    close: 'Close',
    note: 'The network calls of this template are replaced by fixed data so it can run in your browser. The flow, the events and the state are the same code you see on the card.',
  },
  es: {
    open: 'Probar en vivo',
    title: 'Prueba esta plantilla',
    close: 'Cerrar',
    note: 'Las llamadas de red de esta plantilla se sustituyen por datos fijos para que corra en tu navegador. El flow, los eventos y el state son el mismo código que ves en la tarjeta.',
  },
  pt: {
    open: 'Testar ao vivo',
    title: 'Teste este template',
    close: 'Fechar',
    note: 'As chamadas de rede deste template são substituídas por dados fixos para rodar no seu navegador. O flow, os eventos e o state são o mesmo código que você vê no card.',
  },
}

export function TemplatePlayground({ template, demo, locale = 'en' }) {
  const t = COPY[locale] ?? COPY.en
  const [open, setOpen] = useState(false)

  // Lock the page scroll while the dialog is open, like the docs search does
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!demo) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full bg-bb-l2/10 px-3 py-1 font-mono text-[11.5px] font-medium text-bb-l2',
          'ring-1 ring-inset ring-bb-l2/30 transition hover:bg-bb-l2/15 hover:text-bb-head hover:ring-bb-l2/50'
        )}
      >
        <Icon name="play" size={11} />
        {t.open}
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-[60]">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 overflow-y-auto p-3 sm:p-6">
          <Dialog.Panel className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 rounded-2xl bg-bb-bg p-4 ring-1 ring-bb-line sm:p-6">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="bb-kicker">{t.title}</p>
                <Dialog.Title className="mt-1 text-lg font-light leading-snug text-bb-head">
                  {template.title}
                </Dialog.Title>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 flex-none items-center gap-1.5 rounded-full px-3 text-[13px] text-bb-ink2 ring-1 ring-inset ring-bb-line transition hover:bg-bb-chip hover:text-bb-head"
              >
                <Icon name="close" size={13} />
                {t.close}
              </button>
            </div>

            <p className="rounded-xl bg-bb-frame/70 px-4 py-2.5 text-[12.5px] font-light leading-relaxed text-bb-ink2 ring-1 ring-inset ring-bb-line/70">
              {t.note}
            </p>

            {open && <Playground locale={locale} single custom={demo} />}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
