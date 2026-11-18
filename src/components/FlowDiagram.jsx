function Kicker({ children, className = '' }) {
  return (
    <span className={`font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] ${className}`}>
      {children}
    </span>
  )
}

function Bubble({ children, from = 'user' }) {
  return from === 'user' ? (
    <span className="max-w-[80%] self-start rounded-[10px] rounded-bl-sm bg-[#d9fdd3] px-3 py-2 text-sm leading-snug text-[#1d1d1b]">
      {children}
    </span>
  ) : (
    <span className="max-w-[80%] self-end rounded-[10px] rounded-br-sm bg-white px-3 py-2 text-sm leading-snug text-[#1d1d1b] ring-1 ring-[#e2e0d8]">
      {children}
    </span>
  )
}

function Node({ label, children }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-xl bg-bb-bg p-4 shadow-[0_0_0_1px_rgb(var(--bb-line)),0_20px_40px_-16px_rgb(0_0_0/0.35)]">
      <Kicker className="text-bb-mute">{label}</Kicker>
      {children}
    </div>
  )
}

function Wire() {
  return (
    <span
      aria-hidden="true"
      className="bb-wire mx-auto h-8 w-0.5 flex-none rotate-0 max-sm:[background:repeating-linear-gradient(180deg,rgb(var(--bb-l2))_0_7px,transparent_7px_13px)] max-sm:after:hidden sm:mx-0 sm:h-0.5 sm:w-10"
    />
  )
}

/**
 * Visual summary of a flow: the user writes a keyword, addKeyword matches it
 * and the bot answers. Defaults match the Quick Example on the home page.
 */
export function FlowDiagram({
  message = 'hello',
  match = "addKeyword(['hello', 'hi'])",
  answer = 'Ey! welcome',
  stack = [
    ['Provider', 'Baileys'],
    ['Database', 'MemoryDB'],
    ['HTTP', ':3000'],
  ],
}) {
  return (
    <figure
      aria-label={`How a flow works: the user sends "${message}", ${match} matches it and the bot answers "${answer}"`}
      className="bb-aurora not-prose aling-block relative my-12 flex flex-col gap-6 overflow-hidden rounded-[20px] bg-bb-frame px-5 pb-6 pt-8 sm:px-7"
    >
      <div className="flex flex-col items-stretch sm:flex-row sm:items-center">
        <Node label="User · WhatsApp">
          <Bubble>{message}</Bubble>
        </Node>
        <Wire />
        <Node label="Flow">
          <code className="break-words font-mono text-[13px] font-medium text-bb-head">{match}</code>
        </Node>
        <Wire />
        <Node label="Bot">
          <Bubble from="bot">{answer}</Bubble>
        </Node>
      </div>
      <figcaption className="flex flex-wrap items-center justify-center gap-2">
        {stack.map(([k, v]) => (
          <span
            key={k}
            className="inline-flex h-[30px] items-center gap-2 rounded-lg bg-white px-3 text-[13px] text-[#2d2d2a] ring-1 ring-inset ring-[#e2e0d8] dark:bg-[rgb(236_235_226/0.82)] dark:ring-transparent"
          >
            <Kicker className="text-[#5f5e57]">{k}</Kicker>
            {v}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

/** Result of the Quick Example: chat preview + HTTP endpoint card. */
export function QuickExampleResult() {
  return (
    <div className="not-prose aling-block my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2.5 rounded-xl bg-white p-[18px] text-[#1d1d1b] shadow-[0_0_0_1px_#e2e0d8,0_24px_50px_-24px_rgba(17,24,39,0.25)] dark:bg-[#ecebe2] dark:shadow-[0_0_0_2px_rgba(255,255,255,0.14),0_30px_60px_-20px_rgba(0,0,0,0.6)]">
        <Kicker className="text-[#5f5e57]">Result · Chat</Kicker>
        <span className="self-end rounded-[10px] rounded-br-sm bg-[#d9fdd3] px-3 py-2 text-sm">hi</span>
        <span className="self-start rounded-[10px] rounded-bl-sm bg-white px-3 py-2 text-sm ring-1 ring-[#e2e0d8]">Ey! welcome</span>
        <span className="flex w-[78%] flex-col gap-1.5 self-start rounded-[10px] rounded-bl-sm bg-white p-1.5 ring-1 ring-[#e2e0d8]">
          <img src="https://i.imgur.com/0HpzsEm.png" alt="Image sent from URL in the example" className="h-28 w-full rounded-md object-cover" />
          <span className="px-1.5 pb-1 text-sm">Send image from URL</span>
        </span>
      </div>
      <div className="flex flex-col gap-3 rounded-xl bg-bb-bg2 p-[18px] ring-1 ring-inset ring-bb-line">
        <Kicker className="text-bb-mute">Result · HTTP</Kicker>
        <span className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-bb-btn px-2 py-0.5 font-mono text-[11px] font-semibold text-bb-btnfg">POST</span>
          <code className="font-mono text-[13.5px] font-medium text-bb-head">:3000/v1/messages</code>
        </span>
        <span className="text-sm font-light leading-relaxed text-bb-ink2">
          Body with <code className="font-mono text-[12.5px] text-bb-head">number</code> and{' '}
          <code className="font-mono text-[12.5px] text-bb-head">message</code>. The bot sends the message and answers{' '}
          <code className="font-mono text-[12.5px] text-bb-head">send</code>.
        </span>
      </div>
    </div>
  )
}
