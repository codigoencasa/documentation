/**
 * LAYER: Interface
 * Contains: Playground — flow code editor + chat running the real @builderbot/bot core in the browser
 * Rules: Presentation only. Compiling and running flows lives in `@/lib/playground/runtime`.
 * GOAL: Let a reader edit a documented flow and talk to it right away.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { Icon } from '@/components/Icon'
import { EXAMPLES, findExample } from '@/lib/playground/examples'
import { BOT_VERSION, INBOUND_EVENT, startBot } from '@/lib/playground/runtime'

const KICKER = 'font-mono text-[10.5px] font-medium uppercase tracking-[0.06em]'
const COPY = {
  en: {
    examples: 'Examples',
    run: 'Run',
    reset: 'Reset code',
    docs: 'Read the docs',
    editor: 'Flow code',
    log: 'Engine log',
    running: `@builderbot/bot ${BOT_VERSION} · running`,
    changed: 'Code changed · ⌘/Ctrl + Enter to run',
    restarted: 'Bot restarted with your code',
    placeholder: 'Write a message…',
    send: 'Send',
    tryLabel: 'Try',
    chatTitle: 'Your bot',
    chatSub: 'MemoryDB · playground provider',
    today: 'Today',
    error: 'Error',
    events: { media: 'Image', voice: 'Voice note', document: 'Document', location: 'Location' },
    logIn: 'in',
    logOut: 'out',
  },
  es: {
    examples: 'Ejemplos',
    run: 'Ejecutar',
    reset: 'Restaurar código',
    docs: 'Ver la documentación',
    editor: 'Código del flujo',
    log: 'Log del motor',
    running: `@builderbot/bot ${BOT_VERSION} · en marcha`,
    changed: 'El código cambió · ⌘/Ctrl + Enter para ejecutar',
    restarted: 'Bot reiniciado con tu código',
    placeholder: 'Escribe un mensaje…',
    send: 'Enviar',
    tryLabel: 'Prueba',
    chatTitle: 'Tu bot',
    chatSub: 'MemoryDB · provider del playground',
    today: 'Hoy',
    error: 'Error',
    events: { media: 'Imagen', voice: 'Nota de voz', document: 'Documento', location: 'Ubicación' },
    logIn: 'entra',
    logOut: 'sale',
  },
  pt: {
    examples: 'Exemplos',
    run: 'Executar',
    reset: 'Restaurar código',
    docs: 'Ler a documentação',
    editor: 'Código do fluxo',
    log: 'Log do motor',
    running: `@builderbot/bot ${BOT_VERSION} · rodando`,
    changed: 'O código mudou · ⌘/Ctrl + Enter para executar',
    restarted: 'Bot reiniciado com o seu código',
    placeholder: 'Escreva uma mensagem…',
    send: 'Enviar',
    tryLabel: 'Teste',
    chatTitle: 'Seu bot',
    chatSub: 'MemoryDB · provider do playground',
    today: 'Hoje',
    error: 'Erro',
    events: { media: 'Imagem', voice: 'Nota de voz', document: 'Documento', location: 'Localização' },
    logIn: 'entra',
    logOut: 'sai',
  },
}

const EVENT_NAME = { media: 'MEDIA', voice: 'VOICE_NOTE', document: 'DOCUMENT', location: 'LOCATION' }

/** The quoted words of the English hint are the messages worth trying (“hi”, “register”…). */
const suggestionsOf = (example) => [...example.hint.en.matchAll(/“([^”]+)”/g)].map((m) => m[1])

/** WhatsApp-style `*bold*` and `_italic_`, nothing else. */
function RichText({ text }) {
  return String(text)
    .split(/(\*[^*\n]+\*|_[^_\n]+_)/g)
    .map((part, i) => {
      if (/^\*[^*]+\*$/.test(part)) return <strong key={i}>{part.slice(1, -1)}</strong>
      if (/^_[^_]+_$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>
      return part
    })
}

function Chip({ onClick, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-7 max-w-full items-center truncate whitespace-nowrap rounded-full bg-white px-3 text-xs text-[#1d1d1b] ring-1 ring-inset ring-[#e2e0d8] transition hover:ring-[#818cf8]"
    >
      {children}
    </button>
  )
}

function Message({ item, t, onTap }) {
  if (item.type === 'note') {
    return (
      <p
        className={clsx(
          'self-center rounded-lg px-2.5 py-1 text-center text-[11.5px]',
          item.error ? 'bg-red-50 text-red-700' : 'bg-white/80 text-[#5f5e57]'
        )}
      >
        {item.text}
      </p>
    )
  }
  if (item.type === 'user') {
    return (
      <p className="max-w-[85%] self-end whitespace-pre-wrap rounded-[10px] rounded-tr-sm bg-[#d9fdd3] px-3 py-2 text-sm leading-snug shadow-sm">
        {item.event ? (
          <span className="inline-flex items-center gap-1.5 text-[#3d3c38]">
            <Icon name="events" size={14} />
            {t.events[item.event]}
          </span>
        ) : (
          item.text
        )}
      </p>
    )
  }
  const buttons = item.options.buttons ?? []
  return (
    <div className="flex max-w-[85%] flex-col gap-1.5 self-start">
      <div className="whitespace-pre-wrap rounded-[10px] rounded-tl-sm bg-white px-3 py-2 text-sm leading-snug shadow-sm">
        {item.options.media && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.options.media} alt="" loading="lazy" className="mb-1.5 max-h-48 w-full rounded-md object-cover" />
        )}
        <RichText text={item.text} />
      </div>
      {buttons.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {buttons.map((button) => (
            <Chip key={button.body} onClick={() => onTap(button.body)}>
              {button.body}
            </Chip>
          ))}
        </div>
      )}
    </div>
  )
}

function CodeEditor({ value, onChange, onRun, label }) {
  const host = useRef(null)
  const editor = useRef(null)
  const handlers = useRef({ onChange, onRun })
  const [ready, setReady] = useState(false)
  handlers.current = { onChange, onRun }

  useEffect(() => {
    let cancelled = false
    import('@/lib/playground/editor').then(({ createCodeEditor }) => {
      if (cancelled || !host.current) return
      editor.current = createCodeEditor({
        parent: host.current,
        doc: value,
        label,
        onChange: (next) => handlers.current.onChange(next),
        onRun: () => handlers.current.onRun(),
      })
      setReady(true)
    })
    return () => {
      cancelled = true
      editor.current?.destroy()
      editor.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    editor.current?.setValue(value)
  }, [value])

  return (
    <div className="relative min-h-[360px] flex-1 font-mono lg:min-h-0">
      <div ref={host} className="absolute inset-0" />
      {!ready && (
        <pre className="absolute inset-0 overflow-hidden py-4 pl-[calc(40px+3ch)] pr-5 text-[13px] leading-[1.7] text-[#ecebe4]">
          {value}
        </pre>
      )}
    </div>
  )
}

function EngineLog({ entries, t }) {
  const list = useRef(null)
  useEffect(() => {
    const box = list.current
    if (box) box.scrollTop = box.scrollHeight
  }, [entries.length])
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-bb-bg2 ring-1 ring-inset ring-bb-line">
      <p className={clsx('flex h-10 flex-none items-center border-b border-bb-line px-4 text-bb-mute', KICKER)}>{t.log}</p>
      <ol ref={list} className="min-h-0 flex-1 overflow-y-auto px-4 py-2 font-mono text-[11.5px] leading-relaxed">
        {entries.map((entry) => (
          <li key={entry.key} className="flex gap-3">
            <span className="w-14 flex-none tabular-nums text-bb-soft">{entry.at}</span>
            <span
              className={clsx(
                'w-9 flex-none',
                entry.kind === 'in' && 'text-bb-l1',
                entry.kind === 'out' && 'text-bb-l2',
                entry.kind === 'error' && 'text-red-500'
              )}
            >
              {entry.kind === 'in' ? t.logIn : entry.kind === 'out' ? t.logOut : entry.kind === 'error' ? '!' : '·'}
            </span>
            <span className="min-w-0 flex-1 truncate text-bb-ink2" title={entry.text}>
              {entry.text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Playground({ locale = 'en', example = EXAMPLES[0].id, single = false }) {
  const t = COPY[locale] ?? COPY.en
  const [exampleId, setExampleId] = useState(example)
  const current = findExample(exampleId)
  const [code, setCode] = useState(current.code)
  const [ranCode, setRanCode] = useState(null)
  const [items, setItems] = useState([])
  const [log, setLog] = useState([])
  const [text, setText] = useState('')
  const bot = useRef(null)
  const scroller = useRef(null)
  const seq = useRef(0)
  const startedAt = useRef(0)

  const push = useCallback((item) => setItems((list) => [...list, { key: seq.current++, ...item }]), [])
  const trace = useCallback((kind, text) => {
    const at = `${((Date.now() - startedAt.current) / 1000).toFixed(2)}s`
    setLog((list) => [...list.slice(-199), { key: seq.current++, at, kind, text }])
  }, [])

  const fail = useCallback(
    (message) => {
      push({ type: 'note', error: true, text: `${t.error}: ${message}` })
      trace('error', message)
    },
    [push, trace, t]
  )

  const run = useCallback(
    async (source, { fresh = false } = {}) => {
      bot.current?.stop()
      bot.current = null
      startedAt.current = Date.now()
      setRanCode(source)
      setLog([])
      if (fresh) setItems([])
      else push({ type: 'note', text: t.restarted })
      try {
        bot.current = await startBot(source, {
          onMessage: ({ message, options }) => {
            push({ type: 'bot', text: message, options })
            const extras = [options.media && 'media', options.delay && `delay ${options.delay}`, options.capture && 'capture']
            trace('out', [JSON.stringify(message), ...extras.filter(Boolean)].join('  '))
          },
        })
        trace('info', `createBot · ${t.running}`)
      } catch (error) {
        fail(error.message)
      }
    },
    [push, trace, fail, t]
  )

  useEffect(() => {
    const next = findExample(exampleId).code
    setCode(next)
    run(next, { fresh: true })
  }, [exampleId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => bot.current?.stop(), [])

  useEffect(() => {
    const onRejection = (event) => bot.current && fail(event.reason?.message ?? String(event.reason))
    window.addEventListener('unhandledrejection', onRejection)
    return () => window.removeEventListener('unhandledrejection', onRejection)
  }, [fail])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [items.length])

  const send = (value) => {
    const body = value.trim()
    if (!body || !bot.current) return
    push({ type: 'user', text: body })
    trace('in', JSON.stringify(body))
    bot.current.send(body)
  }

  const sendEvent = (kind) => {
    if (!bot.current) return
    push({ type: 'user', event: kind })
    trace('in', `EVENTS.${EVENT_NAME[kind]}`)
    bot.current.sendEvent(kind)
  }

  const restore = () => {
    setCode(current.code)
    run(current.code)
  }

  const dirty = ranCode !== null && code !== ranCode
  const suggestions = suggestionsOf(current)

  return (
    <section className="not-prose my-10 flex flex-col gap-4 lg:!mx-0 lg:!max-w-none">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
        <span className={clsx('text-bb-mute', KICKER)}>Playground</span>
        <span className={clsx('rounded-full px-1.5 py-0.5 text-[9.5px] text-bb-mute ring-1 ring-inset ring-bb-line2', KICKER)}>
          @builderbot/bot {BOT_VERSION}
        </span>
        {!single && (
          <>
            <span aria-hidden="true" className="hidden text-bb-soft sm:inline">/</span>
            <label className="relative flex w-full min-w-0 items-center sm:inline-flex sm:w-auto 2xl:hidden">
              <span className="sr-only">{t.examples}</span>
              <select
                value={exampleId}
                onChange={(e) => setExampleId(e.target.value)}
                className="h-11 w-full min-w-0 appearance-none truncate rounded-full sm:h-10 sm:w-auto sm:max-w-[260px] bg-bb-bg2 pl-4 pr-9 font-mono text-sm text-bb-head ring-1 ring-inset ring-bb-line transition hover:ring-bb-line2 focus:outline-none focus:ring-bb-l2"
              >
                {EXAMPLES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title[locale] ?? item.title.en}
                  </option>
                ))}
              </select>
              <Icon name="chevron" size={16} className="pointer-events-none absolute right-3 text-bb-mute" />
            </label>
          </>
        )}
        <span className="hidden flex-1 sm:block" />
        <div className="flex w-full gap-2 sm:w-auto">
        {current.doc && (
          <Link
            href={`/${locale}${current.doc}`}
            className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-[13px] text-bb-ink ring-1 sm:h-10 sm:flex-none ring-inset ring-bb-line2 transition hover:bg-bb-chip"
          >
            <Icon name="book" size={15} />
            {t.docs}
          </Link>
        )}
        <button
          type="button"
          onClick={() => run(code)}
          className="inline-flex h-11 flex-none items-center justify-center gap-2 whitespace-nowrap rounded-full bg-bb-btn px-5 text-[13px] text-bb-btnfg transition hover:opacity-90 sm:h-10 sm:flex-none"
        >
          <Icon name="play" size={15} />
          {t.run}
        </button>
        </div>
      </div>

      <div
        className={clsx(
          'grid grid-cols-[minmax(0,1fr)] gap-3 lg:h-[720px] lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[minmax(0,1fr)_180px]',
          !single && '2xl:grid-cols-[200px_minmax(0,1fr)_400px]'
        )}
      >
        {!single && (
          <aside
            aria-label={t.examples}
            className="hidden min-h-0 flex-col gap-1 overflow-y-auto rounded-2xl bg-bb-bg2 px-3 py-4 ring-1 ring-inset ring-bb-line 2xl:row-span-2 2xl:flex"
          >
            <p className={clsx('mb-2 ml-2.5 text-bb-mute', KICKER)}>{t.examples}</p>
            {EXAMPLES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setExampleId(item.id)}
                aria-current={item.id === exampleId ? 'true' : undefined}
                className={clsx(
                  'rounded-lg px-2.5 py-1.5 text-left font-mono text-[13px] leading-snug transition',
                  item.id === exampleId ? 'bg-bb-chip text-bb-head' : 'text-bb-ink2 hover:text-bb-head'
                )}
              >
                {item.title[locale] ?? item.title.en}
              </button>
            ))}
          </aside>
        )}

        <div className="bb-hairline order-2 flex min-h-0 flex-col overflow-hidden rounded-2xl bg-[#0e0f11] shadow-[0_0_0_1px_#e2e0d8,0_24px_50px_-24px_rgba(17,24,39,0.25)] dark:shadow-[inset_0_0_0_1px_#2a2b30] lg:order-none">
          <div className="flex h-14 min-w-0 flex-none items-center gap-3 border-b border-[#2a2b30] px-4">
            <h3 className="flex-none font-mono text-xs font-medium text-[#ecebe2]">app.js</h3>
            <span className="hidden h-0.5 w-0.5 flex-none rounded-full bg-[#6c6b64] sm:block" />
            <span className="hidden flex-none whitespace-nowrap font-mono text-xs text-[#9a998f] sm:inline">{t.editor}</span>
            <span
              className={clsx(
                'ml-auto min-w-0 truncate text-right font-mono text-[11px]',
                dirty ? 'text-amber-400' : 'text-[#6c6b64]'
              )}
            >
              {dirty ? t.changed : t.running}
            </span>
            <button
              type="button"
              onClick={restore}
              title={t.reset}
              aria-label={t.reset}
              className="-mr-1 grid h-7 w-7 flex-none place-items-center rounded-full text-[#9a998f] transition hover:bg-white/10 hover:text-white"
            >
              <Icon name="reboot" size={14} />
            </button>
          </div>
          <CodeEditor value={code} onChange={setCode} onRun={() => run(code)} label={t.editor} />
        </div>

        <div className={clsx('order-3 h-[200px] lg:order-none lg:col-start-1 lg:row-start-2 lg:h-auto', !single && '2xl:col-start-2')}>
          <EngineLog entries={log} t={t} />
        </div>

        <section
          aria-label={t.chatTitle}
          className={clsx(
            'order-1 flex h-[620px] min-h-0 flex-col overflow-hidden rounded-2xl bg-[#ecebe2] text-[#1d1d1b] shadow-[0_0_0_1px_#e2e0d8,0_24px_50px_-24px_rgba(17,24,39,0.25)] dark:shadow-[0_0_0_2px_rgba(255,255,255,0.14),0_30px_60px_-20px_rgba(0,0,0,0.6)] lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-auto',
            !single && '2xl:col-start-3'
          )}
        >
          <header className="flex h-14 flex-none items-center gap-3 border-b border-black/10 px-4">
            <span aria-hidden="true" className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#131313] text-[#ecebe2]">
              <Icon name="agent" size={16} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium leading-5">{t.chatTitle}</span>
              <span className="truncate font-mono text-[11px] leading-4 text-[#5f5e57]">{t.chatSub}</span>
            </span>
            <button
              type="button"
              onClick={() => run(code, { fresh: true })}
              aria-label={t.run}
              className="-mr-1 grid h-7 w-7 flex-none place-items-center rounded-full text-[#5f5e57] transition hover:bg-black/5 hover:text-[#1d1d1b]"
            >
              <Icon name="reboot" size={14} />
            </button>
          </header>

          <div ref={scroller} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-[#efeae2] p-4" aria-live="polite">
            <span className={clsx('self-center rounded-lg bg-white/80 px-2.5 py-1 text-[#5f5e57]', KICKER)}>{t.today}</span>
            <p className="mx-auto max-w-[90%] rounded-lg bg-[#fff8d6] px-3 py-1.5 text-center text-xs leading-snug text-[#5f5e57]">
              {current.hint[locale] ?? current.hint.en}
            </p>
            {items.map((item) => (
              <Message key={item.key} item={item} t={t} onTap={send} />
            ))}
          </div>

          <div className="flex flex-none flex-col gap-3 border-t border-black/10 p-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {suggestions.length > 0 && <span className={clsx('mr-0.5 text-[#5f5e57]', KICKER)}>{t.tryLabel}</span>}
              {suggestions.map((value) => (
                <Chip key={value} onClick={() => send(value)}>
                  {value}
                </Chip>
              ))}
              <span className="hidden flex-1 sm:block" />
              {Object.keys(INBOUND_EVENT).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => sendEvent(kind)}
                  title={`${t.events[kind]} · EVENTS.${EVENT_NAME[kind]}`}
                  aria-label={t.events[kind]}
                  className="inline-flex h-7 items-center rounded-full px-2.5 font-mono text-[10.5px] text-[#5f5e57] ring-1 ring-inset ring-black/10 transition hover:bg-black/5"
                >
                  {EVENT_NAME[kind]}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                send(text)
                setText('')
              }}
            >
              <label className="flex h-11 min-w-0 flex-1 items-center rounded-full bg-white px-4 lg:h-10 ring-1 ring-inset ring-[#e2e0d8] focus-within:ring-[#818cf8]">
                <span className="sr-only">{t.placeholder}</span>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#1d1d1b] placeholder:text-[#8a8980] focus:outline-none"
                />
              </label>
              <button
                type="submit"
                aria-label={t.send}
                disabled={!text.trim()}
                className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#db2777] lg:h-10 lg:w-10 text-white shadow-[0_6px_16px_-8px_#db2777] transition disabled:opacity-40"
              >
                <Icon name="arrow" size={18} strokeWidth={2} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </section>
  )
}
