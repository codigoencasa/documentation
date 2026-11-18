/**
 * LAYER: Interface
 * Contains: TerminalDemo — animated replay of `pnpm create builderbot@latest`
 * Rules: Presentation only. Every line, symbol and color below was captured from the real
 *   create-builderbot CLI (v1.4.4, @clack/prompts) running in a pseudo-terminal, so the demo
 *   stays faithful to what users see. Replaces the old console.webm video.
 * GOAL: Show the CLI flow as live, selectable text instead of a video.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

/* ANSI palette — the demo stays dark in both themes, like the code panels */
const C = {
  gray: 'text-bb-term-gray', // \x1b[90m
  cyan: 'text-bb-term-cyan', // \x1b[36m
  green: 'text-bb-term-green', // \x1b[32m
  magenta: 'text-bb-term-magenta', // \x1b[35m
  yellow: 'text-bb-term-yellow', // \x1b[33m
  dim: 'opacity-55', // \x1b[2m
  bgCyan: 'bg-bb-term-cyan text-bb-term-chipfg', // \x1b[46m
  bgGreen: 'bg-bb-term-green text-bb-term-chipfg', // \x1b[42m
  user: 'text-bb-term-green',
  host: 'text-bb-term-magenta',
  path: 'text-bb-term-yellow',
}

const PROMPT = { user: 'Leifer Mendez@LeiferPC', host: 'MSYS', path: '/e/Projects' }
const COMMAND = 'pnpm create builderbot@latest'

const PROVIDERS = [
  ['Baileys', 'opensource'],
  ['Sherpa', 'opensource'],
  ['Evolution API', 'opensource'],
  ['WPPConnect', 'opensource'],
  ['Twilio'],
  ['Meta', 'optional voice calls'],
  ['Facebook Messenger'],
  ['Instagram'],
  ['TikTok', 'organic comments only'],
  ['Gupshup'],
  ['GoHighLevel'],
  ['Email', 'IMAP/SMTP'],
  ['Voice', 'LiveKit + OpenAI'],
  ['Voice SIP (PSTN)', 'LiveKit SIP + OpenAI'],
  ['Voice WhatsApp', 'Meta WebRTC + OpenAI'],
]
const DATABASES = [['Memory'], ['Json'], ['Mongo'], ['MySQL'], ['PostgreSQL']]
const LANGUAGES = [['TypeScript'], ['JavaScript']]
const SPINNER = ['◒', '◐', '◓', '◑']

/* ---- line builders: a line is an array of [text, className] ---- */
const bar = (cls = C.gray) => [['│', cls]]
const promptLines = () => [
  [[PROMPT.user, C.user], [' '], [PROMPT.host, C.host], [' '], [PROMPT.path, C.path]],
  [['$ ']],
]
const intro = (version) => [[['┌', C.gray], ["   Let's create a "], [` Chatbot v${version}`, C.bgCyan], [' ✨']]]

function confirmActive() {
  return [
    [['◆', C.cyan], ['  Do you want to continue?']],
    [['│', C.cyan], ['  '], ['●', C.green], [' Yes '], ['/', C.dim], [' '], ['○', C.dim], [' '], ['No', C.dim]],
    [['└', C.cyan]],
  ]
}
function submitted(question, answer) {
  return [[['◇', C.green], [`  ${question}`]], [...bar(), ['  '], [answer, C.dim]], bar()]
}
function selectActive(question, options, cursor) {
  return [
    [['◆', C.cyan], [`  ${question}`]],
    ...options.map(([label, hint], i) =>
      i === cursor
        ? [['│', C.cyan], ['  '], ['●', C.green], [` ${label}`], ...(hint ? [[' '], [`(${hint})`, C.dim]] : [])]
        : [['│', C.cyan], ['  '], ['○', C.dim], [' '], [label, C.dim]]
    ),
    [['└', C.cyan]],
  ]
}
function instructions(dir) {
  const row = (text = '', cls = C.dim) => [...bar(), ['  '], [text, cls, 'box'], ['│', C.gray]]
  return [
    [['◇', C.green], ['  Instructions: '], [`${'─'.repeat(28)}╮`, C.gray]],
    row(),
    row(` cd ${dir} `, `${C.dim} ${C.yellow}`),
    row(' npm install ', `${C.dim} ${C.yellow}`),
    row(' npm run dev ', `${C.dim} ${C.yellow}`),
    row(),
    row('📄 Documentation:'),
    row('   https://builderbot.app'),
    row(),
    row('🤖 Issues? Join:'),
    row('   https://link.codigoencasa.com/DISCORD'),
    row(),
    [[`├${'─'.repeat(44)}╯`, C.gray]],
  ]
}

/** The whole session as a list of steps over a screen (array of lines). */
function buildScript({ version, provider, database, language }) {
  const dir = ['base', language === 'JavaScript' ? 'js' : 'ts', provider.toLowerCase().replace(/[^a-z]+/g, '-'), database.toLowerCase().replace('postgresql', 'postgres')].join('-')
  const pIndex = PROVIDERS.findIndex(([l]) => l === provider)
  const dIndex = DATABASES.findIndex(([l]) => l === database)
  const lIndex = LANGUAGES.findIndex(([l]) => l === language)
  const head = [[], ...intro(version), bar()]
  let done = [] // answered prompts so far

  const steps = []
  const screen = (lines, wait) => steps.push({ type: 'screen', lines, wait })
  const walk = (question, options, target) => {
    for (let i = 0; i <= target; i++) screen([...head, ...done, ...selectActive(question, options, i)], i === 0 ? 900 : 260)
    screen([...head, ...done, ...selectActive(question, options, target)], 650)
    done = [...done, ...submitted(question, options[target][0])]
  }

  steps.push({ type: 'type', text: COMMAND, wait: 550 })
  screen([...head, ...confirmActive()], 1100)
  done = submitted('Do you want to continue?', 'Yes')
  walk('Which WhatsApp provider do you want to use?', PROVIDERS, pIndex)
  walk('Which database do you want to use?', DATABASES, dIndex)
  walk('Which language do you prefer to use?', LANGUAGES, lIndex)
  steps.push({ type: 'spin', base: [...head, ...done], label: 'Checking requirements', doneLabel: 'Checking requirements', ms: 1300 })
  done = [...done, [['◇', C.green], ['  Checking requirements']], bar()]
  steps.push({ type: 'spin', base: [...head, ...done], label: 'Creating project...', doneLabel: 'Creating project', ms: 1500 })
  done = [...done, [['◇', C.green], ['  Creating project']], bar()]
  screen([...head, ...done, ...instructions(dir), bar()], 350)
  const final = [...head, ...done, ...instructions(dir), bar(), [['└', C.gray], ['  '], [' Successfully completed! ', C.bgGreen]], [], []]
  screen(final, 700)
  steps.push({ type: 'prompt', base: final, text: `cd ${dir}`, wait: 0 })
  return { steps, final: [...final, ...promptLines().slice(0, 1), [['$ '], [`cd ${dir}`]]] }
}

function Line({ parts }) {
  if (!parts.length) return <div className="h-[1.45em]" />
  return (
    <div className="h-[1.45em] whitespace-pre">
      {parts.map(([text, cls, kind], i) =>
        kind === 'box' ? (
          <span key={i} className={clsx('inline-block w-[42ch] overflow-hidden align-top', cls)}>
            {text}
          </span>
        ) : (
          <span key={i} className={cls}>
            {text}
          </span>
        )
      )}
    </div>
  )
}

const LABELS = {
  en: { title: 'Terminal running pnpm create builderbot@latest' },
  es: { title: 'Terminal ejecutando pnpm create builderbot@latest' },
  pt: { title: 'Terminal executando pnpm create builderbot@latest' },
}

/* Pause on the final frame before the demo starts over */
const LOOP_PAUSE = 2600

export function TerminalDemo({ locale = 'en', version = '1.4.4', provider = 'Baileys', database = 'Memory', language = 'TypeScript' }) {
  const t = LABELS[locale] ?? LABELS.en
  const root = useRef(null)
  const scroller = useRef(null)
  const timers = useRef([])
  const script = useRef(null)
  const visible = useRef(false)
  const started = useRef(false)
  if (!script.current) script.current = buildScript({ version, provider, database, language })

  const [lines, setLines] = useState(() => promptLines())
  const [cursor, setCursor] = useState(true)

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  const later = (fn, ms) => new Promise((resolve) => timers.current.push(setTimeout(() => resolve(fn?.()), ms)))

  const finish = useCallback(() => {
    clear()
    setLines(script.current.final)
    setCursor(true)
  }, [])

  const run = useCallback(async () => {
    clear()
    const token = {}
    run.token = token
    const alive = () => run.token === token
    setCursor(true)
    setLines(promptLines())
    await later(null, 700)
    for (const step of script.current.steps) {
      if (!alive()) return
      if (step.type === 'type' || step.type === 'prompt') {
        const base = step.type === 'prompt' ? [...step.base, ...promptLines()] : promptLines()
        if (step.type === 'prompt') setLines(base)
        for (let i = 1; i <= step.text.length; i++) {
          await later(() => alive() && setLines([...base.slice(0, -1), [['$ '], [step.text.slice(0, i)]]]), 38 + Math.random() * 42)
        }
        await later(null, step.wait)
      } else if (step.type === 'screen') {
        setCursor(false)
        setLines(step.lines)
        await later(null, step.wait)
      } else if (step.type === 'spin') {
        const frames = Math.round(step.ms / 120)
        for (let i = 0; i < frames; i++) {
          const dots = '.'.repeat(Math.floor(i / 2) % 4)
          await later(() => alive() && setLines([...step.base, [[SPINNER[i % 4], C.magenta], [`  ${step.label.replace(/\.+$/, '')}${dots}`]]]), 120)
        }
      }
      if (step.type === 'prompt') setCursor(true)
    }
    if (!alive()) return
    /* hold the last frame, then start over while the demo is on screen */
    await later(() => alive() && visible.current && run(), LOOP_PAUSE)
  }, [])

  /* start when visible; show the final frame for reduced motion */
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      finish()
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting
        if (entry.isIntersecting && !started.current) {
          started.current = true
          run()
        }
      },
      { threshold: 0.35 }
    )
    if (root.current) io.observe(root.current)
    return () => {
      io.disconnect()
      run.token = null
      clear()
    }
  }, [run, finish])

  /* keep the newest line in view, like a real terminal */
  useEffect(() => {
    const box = scroller.current
    if (box) box.scrollTop = box.scrollHeight
  }, [lines])

  return (
    <figure ref={root} className="not-prose my-8 overflow-hidden rounded-2xl bg-bb-term-bg shadow-[inset_0_0_0_1px_#2a2b30,0_24px_50px_-24px_rgba(17,24,39,0.45)]">
      <figcaption className="flex h-11 items-center gap-3 border-b border-bb-term-line px-4">
        <span aria-hidden="true" className="flex flex-none gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-bb-term-dot" />
          <span className="h-2.5 w-2.5 rounded-full bg-bb-term-dot" />
          <span className="h-2.5 w-2.5 rounded-full bg-bb-term-dot" />
        </span>
        <span className="min-w-0 flex-1 truncate text-center font-mono text-xs text-bb-term-mute">
          {PROMPT.host}:{PROMPT.path}
        </span>
      </figcaption>
      <div
        ref={scroller}
        aria-label={t.title}
        className="h-[420px] overflow-y-auto overflow-x-auto px-4 py-3 font-mono text-[11px] leading-[1.45] text-bb-term-fg [scrollbar-width:none] sm:h-[460px] sm:px-5 sm:text-[13px] [&::-webkit-scrollbar]:hidden"
      >
        {lines.map((parts, i) => (
          <Line key={i} parts={i === lines.length - 1 && cursor ? [...parts, ['▍', 'animate-[bb-blink_1s_steps(1)_infinite] text-bb-term-fg']] : parts} />
        ))}
      </div>
    </figure>
  )
}
