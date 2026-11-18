/**
 * LAYER: Domain
 * Contains: Runnable demos for the template catalog — the same flows as src/lib/templates.mjs,
 *   with the network calls (OpenAI, SerpApi, Whisper, calendar) replaced by canned data.
 * Rules: Plain data. Code runs through @/lib/playground/runtime: only addKeyword, createFlow, EVENTS,
 *   state, flowDynamic, fallBack, endFlow and gotoFlow. No fetch, no fs, no TypeScript syntax.
 * GOAL: Let a reader open a template and talk to it, without leaving the page or pasting a key.
 *
 * The `code` shown on each card stays the production version; these demos only drop the network.
 * Hint words inside “…” become the suggestion chips.
 */

export const DEMOS = {
  'agent-tools': {
    hint: {
      en: 'Ask “price”, then “order 42”',
      es: 'Pregunta “price” y luego “order 42”',
      pt: 'Pergunte “price” e depois “order 42”',
    },
    code: `import { addKeyword, createFlow, EVENTS } from '@builderbot/bot'

// The real flow lets the model answer or request one tool. Here both tools are a lookup.
const searchWeb = (query) =>
  query.toLowerCase().includes('price')
    ? 'Pro is $29 a month. Starter is $9 a month.'
    : 'No results for that search.'

const lookupOrder = (id) =>
  id.includes('42') ? 'status shipped, total $29, arrives tomorrow' : 'order not found'

const agentFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, { state, flowDynamic }) => {
  const history = state.get('history') ?? []
  const text = ctx.body.toLowerCase()
  const order = /order\\s*(\\d+)/.exec(text)
  let answer
  if (order) answer = 'Order ' + order[1] + ': ' + lookupOrder(order[1])
  else if (/price|plan/.test(text)) answer = searchWeb(text)
  else answer = 'I have ' + history.length + ' messages in memory. Ask about a price or order 42.'

  await state.update({
    history: [...history, { role: 'user', content: ctx.body }, { role: 'assistant', content: answer }].slice(-12),
  })
  await flowDynamic(answer)
})

createFlow([agentFlow])`,
  },

  'sales-catalog': {
    hint: {
      en: 'Write “hi”, then “pro”, “2” and “yes”',
      es: 'Escribe “hi”, luego “pro”, “2” y “yes”',
      pt: 'Escreva “hi”, depois “pro”, “2” e “yes”',
    },
    code: `import { addKeyword, createFlow, EVENTS } from '@builderbot/bot'

const CATALOG = [
  { id: 'pro', name: 'Pro plan', price: 29 },
  { id: 'starter', name: 'Starter plan', price: 9 },
]

const salesFlow = addKeyword(EVENTS.WELCOME)
  .addAnswer('Pro is $29/month and Starter is $9/month. Which one do you want?', { capture: true }, async (ctx, { state, fallBack }) => {
    const plan = CATALOG.find((item) => ctx.body.toLowerCase().includes(item.id))
    if (!plan) return fallBack('Write "pro" or "starter".')
    await state.update({ plan })
  })
  .addAnswer('How many seats?', { capture: true }, async (ctx, { state, fallBack }) => {
    const seats = Number(ctx.body.replace(/[^\\d]/g, ''))
    if (!seats) return fallBack('Write a number, for example 3.')
    await state.update({ seats })
  })
  .addAnswer('Confirm with "yes".', { capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {
    if (!/^y(es)?$/i.test(ctx.body.trim())) return endFlow('Order cancelled. Write any time to start again.')
    const plan = state.get('plan')
    const seats = state.get('seats')
    await flowDynamic(seats + ' x ' + plan.name + ' = $' + plan.price * seats + '/month. I will send the invoice link.')
  })

createFlow([salesFlow])`,
  },

  'voice-assistant': {
    hint: {
      en: 'Write “remind me to call Ana”, or send a voice note',
      es: 'Escribe “remind me to call Ana”, o envía una nota de voz',
      pt: 'Escreva “remind me to call Ana”, ou envie uma nota de voz',
    },
    code: `import { addKeyword, createFlow, EVENTS } from '@builderbot/bot'

// The real flow sends the audio to Whisper. A voice note here is this transcript.
const remember = async (text, state, flowDynamic) => {
  if (!/remind|recu|lembr/i.test(text)) return flowDynamic('Tell me "remind me to ..." and I will keep it.')
  const list = state.get('reminders') ?? []
  await state.update({ reminders: [...list, text] })
  await flowDynamic('Saved. You have ' + (list.length + 1) + ' reminder' + (list.length ? 's' : '') + '.')
}

const voiceFlow = addKeyword(EVENTS.VOICE_NOTE).addAction(async (_, { state, flowDynamic }) => {
  const text = 'remind me to call Ana tomorrow'
  await flowDynamic('I heard: "' + text + '"')
  await remember(text, state, flowDynamic)
})

const textFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, { state, flowDynamic }) => {
  await remember(ctx.body, state, flowDynamic)
})

createFlow([voiceFlow, textFlow])`,
  },

  'link-summary': {
    hint: {
      en: 'Send a link, e.g. “https://builderbot.app”',
      es: 'Envía un enlace, por ejemplo “https://builderbot.app”',
      pt: 'Envie um link, por exemplo “https://builderbot.app”',
    },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

// The real flow fetches the page. A link that contains "missing" is the failure path.
const REGEX_URL = '/(https?:\\\\/\\\\/[^\\\\s]+)/g'

const summarizeFlow = addKeyword(REGEX_URL, { regex: true }).addAction(async (ctx, { flowDynamic }) => {
  if (/missing|404/.test(ctx.body)) return flowDynamic('I could not open that page (HTTP 404).')
  await flowDynamic(
    'Summary:\\n• The page explains how to build a bot\\n• It needs Node 20 or higher\\n• The quickstart takes about 5 minutes'
  )
})

createFlow([summarizeFlow])`,
  },

  'leads-draft': {
    hint: {
      en: 'Write “leads”, then “dentists” and “1”',
      es: 'Escribe “leads”, luego “dentists” y “1”',
      pt: 'Escreva “leads”, depois “dentists” e “1”',
    },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const FOUND = [
  { name: 'Clínica Norte', phone: '+34 910 000 111' },
  { name: 'Sonrisa Dental', phone: '+34 910 000 222' },
  { name: 'Centro Salud Sur', phone: 'no phone' },
]

const leadsFlow = addKeyword(['leads', 'prospectos'])
  .addAnswer('Niche and city, for example "dentists in Madrid".', { capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {
    if (/nothing|nada/.test(ctx.body.toLowerCase())) return endFlow('No results. Try a broader search.')
    await state.update({ leads: FOUND })
    const lines = FOUND.map((lead, i) => i + 1 + '. ' + lead.name + ' · ' + lead.phone)
    await flowDynamic(FOUND.length + ' leads:\\n' + lines.join('\\n') + '\\n\\nReply with a number to draft the first message.')
  })
  .addAnswer('Waiting for the lead number.', { capture: true }, async (ctx, { state, flowDynamic, fallBack }) => {
    const leads = state.get('leads')
    const lead = leads[Number(ctx.body) - 1]
    if (!lead) return fallBack('Write a number between 1 and ' + leads.length + '.')
    await flowDynamic(
      'Draft for ' + lead.name + ':\\nHi, I help clinics get more bookings on WhatsApp. Open to a 10 minute call this week?'
    )
  })

createFlow([leadsFlow])`,
  },

  'data-analyst': {
    hint: {
      en: 'Ask “october”, then try “september”',
      es: 'Pregunta “october” y luego prueba “september”',
      pt: 'Pergunte “october” e depois teste “september”',
    },
    code: `import { addKeyword, createFlow, EVENTS } from '@builderbot/bot'

// The real flow sends these rows to the model. Here the filter is the answer.
const ROWS = [
  { month: 'october', customer: 'ACME', total: 1200 },
  { month: 'october', customer: 'North', total: 800 },
  { month: 'november', customer: 'ACME', total: 1500 },
]

const analystFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, { flowDynamic }) => {
  const month = ['october', 'november', 'september'].find((name) => ctx.body.toLowerCase().includes(name))
  if (!month) return flowDynamic('Ask me about october or november. I only answer from the sales table.')
  const rows = ROWS.filter((row) => row.month === month)
  if (!rows.length) return flowDynamic('No sales in ' + month + '.')
  const total = rows.reduce((sum, row) => sum + row.total, 0)
  const detail = rows.map((row) => row.customer + ' $' + row.total).join(', ')
  await flowDynamic(month + ': ' + detail + '. Total $' + total + '.')
})

createFlow([analystFlow])`,
  },

  'pdf-qa': {
    hint: {
      en: 'Send a PDF, then ask “what is the total?”',
      es: 'Envía un PDF y luego pregunta “what is the total?”',
      pt: 'Envie um PDF e depois pergunte “what is the total?”',
    },
    code: `import { addKeyword, createFlow, EVENTS } from '@builderbot/bot'

// The real flow reads the file with pdf-parse. This is the text of the sample invoice.
const INVOICE = 'Invoice 1042. Subtotal 58.00. Tax 12.18. The total is 70.18. Due in 15 days.'

const pdfFlow = addKeyword(EVENTS.DOCUMENT)
  .addAction(async (_, { state, flowDynamic }) => {
    await state.update({ doc: INVOICE })
    await flowDynamic('Got it. Ask me about the document.')
  })
  .addAnswer('Any other question?', { capture: true }, async (ctx, { state, flowDynamic }) => {
    const doc = state.get('doc') ?? ''
    if (/total|cu[aá]nto|quanto/i.test(ctx.body)) return flowDynamic('The total is 70.18.')
    if (!doc) return flowDynamic('Send the PDF first.')
    await flowDynamic("That is not in the document, so I don't know.")
  })

createFlow([pdfFlow])`,
  },

  'support-handoff': {
    hint: {
      en: 'Ask “returns”, then “I want a person”',
      es: 'Pregunta “returns” y luego “I want a person”',
      pt: 'Pergunte “returns” e depois “I want a person”',
    },
    code: `import { addKeyword, createFlow, EVENTS } from '@builderbot/bot'

const HUMAN = /(human|agent|person|asesor|persona|atendente)/i

const humanFlow = addKeyword(EVENTS.ACTION).addAnswer(
  'I am passing you to a person. Write your message and they will reply here.',
  { capture: true },
  async (ctx, { flowDynamic }) => {
    await flowDynamic('Passed to the team: "' + ctx.body + '". I will stay quiet in this chat.')
  }
)

const supportFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, { gotoFlow, flowDynamic }) => {
  if (HUMAN.test(ctx.body)) return gotoFlow(humanFlow)
  if (/return|devoluc|troca/i.test(ctx.body)) {
    return flowDynamic('Returns: 30 days with the receipt. Shipping: 24 to 72 hours inside the country.')
  }
  await flowDynamic('I can only answer from the FAQ. Ask about returns, or say you want a person.')
})

createFlow([supportFlow, humanFlow])`,
  },

  'meeting-booking': {
    hint: {
      en: 'Write “meeting”, then “tuesday” and “ana@acme.com”',
      es: 'Escribe “meeting”, luego “tuesday” y “ana@acme.com”',
      pt: 'Escreva “meeting”, depois “tuesday” e “ana@acme.com”',
    },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const SLOTS = ['monday 10:00', 'tuesday 16:00', 'wednesday 09:30']

const meetingFlow = addKeyword(['meeting', 'cita', 'agenda'])
  .addAnswer('I can do ' + SLOTS.join(', ') + '. Which one?', { capture: true }, async (ctx, { state, fallBack }) => {
    const picked = SLOTS.find((slot) => ctx.body.toLowerCase().includes(slot.split(' ')[0]))
    if (!picked) return fallBack('Write the day: monday, tuesday or wednesday.')
    await state.update({ picked })
  })
  .addAnswer('Your email for the invite?', { capture: true }, async (ctx, { state, fallBack }) => {
    if (!ctx.body.includes('@')) return fallBack('That does not look like an email.')
    await state.update({ email: ctx.body.trim() })
  })
  .addAction(async (_, { state, flowDynamic }) => {
    await flowDynamic('Booked ' + state.get('picked') + '. The invite goes to ' + state.get('email') + '.')
  })

createFlow([meetingFlow])`,
  },

  'multimodal-inbox': {
    hint: {
      en: 'Send a voice note, an image or a PDF, then ask “what did I send?”',
      es: 'Envía una nota de voz, una imagen o un PDF y pregunta “what did I send?”',
      pt: 'Envie uma nota de voz, uma imagem ou um PDF e pergunte “what did I send?”',
    },
    code: `import { addKeyword, createFlow, EVENTS } from '@builderbot/bot'

const keep = (label) => async (_, { state, flowDynamic }) => {
  await state.update({ last: label })
  await flowDynamic('Saved the ' + label + '. Ask me "what did I send?" any time.')
}

const textFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, { state, flowDynamic }) => {
  if (!/what did i send|qu[eé] envi|o que eu enviei/i.test(ctx.body)) {
    return flowDynamic('Send a voice note, an image or a PDF. I keep the last one.')
  }
  const last = state.get('last')
  await flowDynamic(last ? 'Last file: ' + last : 'Nothing yet.')
})

createFlow([
  textFlow,
  addKeyword(EVENTS.VOICE_NOTE).addAction(keep('voice note')),
  addKeyword(EVENTS.MEDIA).addAction(keep('image')),
  addKeyword(EVENTS.DOCUMENT).addAction(keep('pdf')),
])`,
  },
}

/** Playground example for a template, or null when this card has no live demo. */
export function demoFor(template) {
  const demo = DEMOS[template.id]
  if (!demo) return null
  return {
    id: `template-${template.id}`,
    title: { en: template.title, es: template.title, pt: template.title },
    hint: demo.hint,
    code: demo.code,
  }
}
