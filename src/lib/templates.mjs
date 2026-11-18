/**
 * LAYER: Domain
 * Contains: Template catalog — complete BuilderBot flows for the automations a chatbot is actually
 *   asked to do, ordered from the most common to the most specific.
 * Rules: Plain data, no React. `code` is the production version: it may call OpenAI, SerpApi or disk.
 *   The browser demo of the same flow lives in src/lib/template-demos.mjs.
 * GOAL: A reader should be able to drop a card into app.ts and have a bot that does the job,
 *   including the case where the customer says something the happy path did not expect.
 */

export const UPDATED = '2026-11-18'

/** Categories used by the filter chips. Order is the order of the chips. */
export const TEMPLATE_CATEGORIES = [
  { id: 'assistants', label: { en: 'AI assistants', es: 'Asistentes IA', pt: 'Assistentes IA' }, icon: 'sparkle' },
  { id: 'support', label: { en: 'Support', es: 'Soporte', pt: 'Suporte' }, icon: 'human' },
  { id: 'leads', label: { en: 'Leads & sales', es: 'Leads y ventas', pt: 'Leads e vendas' }, icon: 'bag' },
  { id: 'research', label: { en: 'Research', es: 'Research', pt: 'Pesquisa' }, icon: 'search' },
  { id: 'documents', label: { en: 'Documents', es: 'Documentos', pt: 'Documentos' }, icon: 'doc' },
]

const chat = (messages) => `const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
        },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: ${messages} }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? 'I could not get an answer. Try again in a moment.'`

export const TEMPLATES = [
  {
    id: 'agent-tools',
    category: 'assistants',
    title: 'AI agent that can look things up',
    summary: {
      en: 'A chat with memory that can search the web or look up an order before it answers, instead of inventing the number.',
      es: 'Un chat con memoria que puede buscar en la web o consultar un pedido antes de responder, en lugar de inventarse el dato.',
      pt: 'Um chat com memória que pode buscar na web ou consultar um pedido antes de responder, em vez de inventar o dado.',
    },
    recipe: {
      en: 'Keep the last turns in `state`. The model answers, or it replies `TOOL search …` / `TOOL order …`. You run that one call and ask the model again with the result. One round is enough for WhatsApp.',
      es: 'Guarda los últimos turnos en `state`. El modelo responde, o contesta `TOOL search …` / `TOOL order …`. Ejecutas esa llamada y vuelves a preguntarle con el resultado. Una vuelta basta para WhatsApp.',
      pt: 'Guarde os últimos turnos em `state`. O modelo responde, ou devolve `TOOL search …` / `TOOL order …`. Você executa essa chamada e pergunta de novo com o resultado. Uma volta basta para o WhatsApp.',
    },
    docs: '/add-functions#add-action',
    file: 'flows/agent.flow.ts',
    code: `import { EVENTS, addKeyword } from '@builderbot/bot'

const SYSTEM = \`You are the assistant of ACME. Reply in the customer's language, in one short WhatsApp message.
When you need live data, reply with exactly one line and nothing else:
TOOL search <query>
TOOL order <id>\`

const MAX_TURNS = 12

const searchWeb = async (query: string) => {
    const url = \`https://serpapi.com/search.json?q=\${encodeURIComponent(query)}&api_key=\${process.env.SERPAPI_KEY}\`
    const data = await (await fetch(url)).json()
    const snippets = (data.organic_results ?? []).slice(0, 3).map((item: any) => item.snippet)
    return snippets.join(' ') || 'no results'
}

const lookupOrder = async (id: string) => {
    const res = await fetch(\`\${process.env.ORDERS_API}/orders/\${id}\`)
    if (!res.ok) return 'order not found'
    const order = await res.json()
    return \`status \${order.status}, total \${order.total}\`
}

const ask = async (messages: { role: string; content: string }[]) => {
    ${chat('[{ role: \'system\', content: SYSTEM }, ...messages]')}
}

export default addKeyword(EVENTS.WELCOME).addAction(async (ctx, { state, flowDynamic }) => {
    const history = (state.get('history') ?? []) as { role: string; content: string }[]
    const messages = [...history, { role: 'user', content: ctx.body }].slice(-MAX_TURNS)

    let answer = await ask(messages)
    const tool = /^TOOL (search|order) (.+)$/.exec(answer.trim())
    if (tool) {
        const result = tool[1] === 'search' ? await searchWeb(tool[2]) : await lookupOrder(tool[2])
        messages.push({ role: 'assistant', content: answer }, { role: 'user', content: \`TOOL RESULT: \${result}\` })
        answer = await ask(messages)
    }

    await state.update({ history: [...messages, { role: 'assistant', content: answer }].slice(-MAX_TURNS) })
    await flowDynamic(answer)
})`,
  },
  {
    id: 'sales-catalog',
    category: 'leads',
    title: 'WhatsApp sales agent with a catalog',
    summary: {
      en: 'Quotes a price, asks how many seats, and only confirms the order when the quantity is a real number.',
      es: 'Cotiza un precio, pregunta cuántos asientos y solo confirma el pedido cuando la cantidad es un número real.',
      pt: 'Orça um preço, pergunta quantos assentos e só confirma o pedido quando a quantidade é um número real.',
    },
    recipe: {
      en: 'A catalog in code beats a chain of wait nodes. `capture` keeps each answer in the same flow, `fallBack` asks again when the quantity is not a number, and `state` carries the line item to the total.',
      es: 'Un catálogo en código sustituye a la cadena de nodos wait. `capture` mantiene cada respuesta en el mismo flow, `fallBack` repregunta si la cantidad no es un número y `state` lleva la línea hasta el total.',
      pt: 'Um catálogo no código substitui a corrente de nós wait. `capture` mantém cada resposta no mesmo flow, `fallBack` pergunta de novo se a quantidade não for um número e `state` leva a linha até o total.',
    },
    docs: '/methods#state',
    file: 'flows/sales.flow.ts',
    code: `import { EVENTS, addKeyword } from '@builderbot/bot'

const CATALOG = [
    { id: 'pro', name: 'Pro plan', price: 29 },
    { id: 'starter', name: 'Starter plan', price: 9 },
]

const findPlan = (text: string) =>
    CATALOG.find((plan) => text.toLowerCase().includes(plan.id))

export default addKeyword(EVENTS.WELCOME)
    .addAnswer(
        'Hi! Pro is $29/month and Starter is $9/month. Which one do you want?',
        { capture: true },
        async (ctx, { state, fallBack }) => {
            const plan = findPlan(ctx.body)
            if (!plan) return fallBack('Write "pro" or "starter".')
            await state.update({ plan })
        }
    )
    .addAnswer('How many seats?', { capture: true }, async (ctx, { state, fallBack }) => {
        const seats = Number(ctx.body.replace(/[^\\d]/g, ''))
        if (!seats) return fallBack('Write a number, for example 3.')
        await state.update({ seats })
    })
    .addAnswer('Confirm with "yes".', { capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {
        if (!/^y(es)?$/i.test(ctx.body.trim())) return endFlow('Order cancelled. Write any time to start again.')
        const { plan, seats } = state.getMyState()
        await flowDynamic(\`\${seats} x \${plan.name} = $\${plan.price * seats}/month. I will send the invoice link.\`)
    })`,
  },
  {
    id: 'voice-assistant',
    category: 'assistants',
    title: 'Assistant for text and voice notes',
    summary: {
      en: 'A voice note is transcribed and then handled by the same flow that answers typed messages, so reminders land in one list.',
      es: 'Una nota de voz se transcribe y pasa por el mismo flow que el texto, así los recordatorios caen en una sola lista.',
      pt: 'Uma nota de voz é transcrita e passa pelo mesmo flow do texto, então os lembretes caem numa lista só.',
    },
    recipe: {
      en: '`EVENTS.VOICE_NOTE` is separate from images on purpose. Save the file, send it to Whisper, and pass the transcript to the same function that reads `ctx.body`. Store reminders in `state`, per contact.',
      es: '`EVENTS.VOICE_NOTE` está separado de las imágenes a propósito. Guarda el archivo, mándalo a Whisper y pasa la transcripción a la misma función que lee `ctx.body`. Los recordatorios van a `state`, por contacto.',
      pt: '`EVENTS.VOICE_NOTE` é separado das imagens de propósito. Salve o arquivo, envie ao Whisper e passe a transcrição para a mesma função que lê `ctx.body`. Os lembretes vão para `state`, por contato.',
    },
    docs: '/events#received-voice-note',
    file: 'flows/assistant.flow.ts',
    code: `import { readFile } from 'node:fs/promises'
import { EVENTS, addKeyword } from '@builderbot/bot'

const transcribe = async (filePath: string) => {
    const audio = await readFile(filePath)
    const form = new FormData()
    form.append('file', new Blob([audio]), 'audio.ogg')
    form.append('model', 'whisper-1')
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\` },
        body: form,
    })
    const data = await res.json()
    return data.text as string
}

/** One place for typed text and for transcripts. */
const remember = async (text: string, state: any, flowDynamic: any) => {
    const reminder = /remind|recu[eé]rd|lembr/i.exec(text)
    if (!reminder) return flowDynamic('Tell me "remind me to ..." and I will keep it.')
    const list = state.get('reminders') ?? []
    await state.update({ reminders: [...list, text] })
    return flowDynamic(\`Saved. You have \${list.length + 1} reminder\${list.length ? 's' : ''}.\`)
}

const voiceFlow = addKeyword(EVENTS.VOICE_NOTE).addAction(async (ctx, { provider, state, flowDynamic }) => {
    const filePath = await provider.saveFile(ctx, { path: './tmp' })
    const text = await transcribe(filePath)
    await flowDynamic(\`I heard: "\${text}"\`)
    await remember(text, state, flowDynamic)
})

const textFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, { state, flowDynamic }) => {
    await remember(ctx.body, state, flowDynamic)
})

export default [voiceFlow, textFlow]`,
  },
  {
    id: 'link-summary',
    category: 'research',
    title: 'Summarize any link in the chat',
    summary: {
      en: 'Send a URL, get five bullets back. When the page does not load, the bot says so instead of going silent.',
      es: 'Envías una URL y recibes cinco puntos. Cuando la página no carga, el bot lo dice en lugar de quedarse mudo.',
      pt: 'Você envia uma URL e recebe cinco pontos. Quando a página não carrega, o bot avisa em vez de ficar mudo.',
    },
    recipe: {
      en: 'A regex keyword catches the link without a command. Strip scripts and styles before the prompt, cap the text, and answer with the HTTP status when fetch fails.',
      es: 'Un keyword con regex captura el enlace sin un comando. Quita scripts y estilos antes del prompt, limita el texto y, si el fetch falla, responde con el estado HTTP.',
      pt: 'Um keyword com regex captura o link sem um comando. Tire scripts e estilos antes do prompt, limite o texto e, se o fetch falhar, responda com o status HTTP.',
    },
    docs: '/add-functions#regex',
    file: 'flows/summarize.flow.ts',
    code: `import { addKeyword } from '@builderbot/bot'

const REGEX_URL = '/(https?:\\\\/\\\\/[^\\\\s]+)/g'

const stripHtml = (html: string) =>
    html
        .replace(/<script[\\s\\S]*?<\\/script>/gi, ' ')
        .replace(/<style[\\s\\S]*?<\\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\\s+/g, ' ')
        .trim()
        .slice(0, 8000)

export default addKeyword(REGEX_URL, { regex: true }).addAction(async (ctx, { flowDynamic }) => {
    const res = await fetch(ctx.body)
    if (!res.ok) return flowDynamic(\`I could not open that page (HTTP \${res.status}).\`)

    const page = stripHtml(await res.text())
    if (page.length < 200) return flowDynamic('That page has almost no text. Try another link.')

    const answer = await (async () => {
        ${chat(`[
            { role: 'system', content: 'Summarize in 5 short bullets for WhatsApp. No intro.' },
            { role: 'user', content: 'page' },
        ]`.replace("content: 'page'", 'content: page'))}
    })()
    await flowDynamic(answer)
})`,
  },
  {
    id: 'leads-draft',
    category: 'leads',
    title: 'Find leads and draft the first message',
    summary: {
      en: 'Search a niche and a city, keep the list, and draft a first WhatsApp message for the lead you pick.',
      es: 'Buscas nicho y ciudad, guardas la lista y redactas el primer mensaje de WhatsApp para el lead que elijas.',
      pt: 'Você busca nicho e cidade, guarda a lista e redige a primeira mensagem de WhatsApp para o lead que escolher.',
    },
    recipe: {
      en: 'Search, then `capture` the number of the lead. The draft uses the business name from `state`, so the message is not generic. Sending it stays a separate step: you review it before it goes out.',
      es: 'Buscas y luego `capture` el número del lead. El borrador usa el nombre del negocio que está en `state`, así el mensaje no es genérico. Enviarlo queda como paso aparte: lo revisas antes de que salga.',
      pt: 'Você busca e depois `capture` o número do lead. O rascunho usa o nome do negócio que está em `state`, então a mensagem não é genérica. O envio fica separado: você revisa antes de sair.',
    },
    docs: '/methods#state',
    file: 'flows/leads.flow.ts',
    code: `import { addKeyword } from '@builderbot/bot'

type Lead = { name: string; phone?: string; address?: string }

const searchMaps = async (query: string): Promise<Lead[]> => {
    const url = \`https://serpapi.com/search.json?engine=google_maps&q=\${encodeURIComponent(query)}&api_key=\${process.env.SERPAPI_KEY}\`
    const data = await (await fetch(url)).json()
    return (data.local_results ?? []).slice(0, 8).map((item: any) => ({
        name: item.title,
        phone: item.phone,
        address: item.address,
    }))
}

export default addKeyword(['leads', 'prospectos'])
    .addAnswer('Niche and city, for example "dentists in Madrid".', { capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {
        const leads = await searchMaps(ctx.body)
        if (!leads.length) return endFlow('No results. Try a broader search.')
        await state.update({ leads })
        const lines = leads.map((lead, i) => \`\${i + 1}. \${lead.name} · \${lead.phone ?? 'no phone'}\`)
        await flowDynamic(\`\${leads.length} leads:\\n\${lines.join('\\n')}\\n\\nReply with a number to draft the first message.\`)
    })
    .addAnswer('Waiting for the lead number.', { capture: true }, async (ctx, { state, flowDynamic, fallBack }) => {
        const { leads } = state.getMyState() as { leads: Lead[] }
        const index = Number(ctx.body) - 1
        const lead = leads[index]
        if (!lead) return fallBack(\`Write a number between 1 and \${leads.length}.\`)
        await flowDynamic(
            \`Draft for \${lead.name}:\\nHi, I help clinics get more bookings on WhatsApp. Open to a 10 minute call this week?\`
        )
    })`,
  },
  {
    id: 'data-analyst',
    category: 'assistants',
    title: 'Ask your sales data in the chat',
    summary: {
      en: 'The customer asks "how much did we sell in October?" and the bot answers from your rows, quoting the numbers it used.',
      es: 'El cliente pregunta "¿cuánto vendimos en octubre?" y el bot responde con tus filas, citando los números que usó.',
      pt: 'O cliente pergunta "quanto vendemos em outubro?" e o bot responde com suas linhas, citando os números que usou.',
    },
    recipe: {
      en: 'Do not hand the model a database connection. Load the rows you are willing to expose, put them in the prompt, and tell it to answer only from that table. The same flow works against a query you run yourself.',
      es: 'No le pases al modelo una conexión a la base de datos. Carga las filas que sí puedes enseñar, mételas en el prompt y dile que responda solo con esa tabla. El mismo flow sirve si la consulta la haces tú.',
      pt: 'Não passe ao modelo uma conexão com o banco. Carregue as linhas que você pode mostrar, coloque no prompt e diga para responder só com essa tabela. O mesmo flow serve se a consulta for sua.',
    },
    docs: '/add-functions#add-action',
    file: 'flows/analyst.flow.ts',
    code: `import { EVENTS, addKeyword } from '@builderbot/bot'

// Replace with the query you actually want to expose. Never pass a raw SQL string from the chat.
const ROWS = [
    { month: 'october', customer: 'ACME', total: 1200 },
    { month: 'october', customer: 'North', total: 800 },
    { month: 'november', customer: 'ACME', total: 1500 },
]

export default addKeyword(EVENTS.WELCOME).addAction(async (ctx, { flowDynamic }) => {
    const table = ROWS.map((row) => \`\${row.month} | \${row.customer} | \${row.total}\`).join('\\n')
    const answer = await (async () => {
        ${chat(`[
            { role: 'system', content: 'table' },
            { role: 'user', content: ctx.body },
        ]`.replace(
            "content: 'table'",
            "content: `Answer only from this table (month | customer | total). If it is not there, say so.\\n\${table}`"
        ))}
    })()
    await flowDynamic(answer)
})`,
  },
  {
    id: 'pdf-qa',
    category: 'documents',
    title: 'Questions about a PDF the customer sends',
    summary: {
      en: 'The customer sends a PDF and then asks about it. The bot refuses to answer from anything that is not in the file.',
      es: 'El cliente envía un PDF y luego pregunta sobre él. El bot se niega a responder con algo que no esté en el archivo.',
      pt: 'O cliente envia um PDF e depois pergunta sobre ele. O bot se recusa a responder com algo que não esteja no arquivo.',
    },
    recipe: {
      en: '`EVENTS.DOCUMENT` plus `provider.saveFile` gives you the file. `pdf-parse` extracts the text into `state`. For more than a few pages, chunk it and retrieve; stuffing the whole file into the prompt is the short version.',
      es: '`EVENTS.DOCUMENT` más `provider.saveFile` te dan el archivo. `pdf-parse` extrae el texto a `state`. Si pasa de unas páginas, trocéalo y recupera; meter el archivo entero en el prompt es la versión corta.',
      pt: '`EVENTS.DOCUMENT` mais `provider.saveFile` entregam o arquivo. `pdf-parse` extrai o texto para `state`. Se passar de algumas páginas, fatie e recupere; colocar o arquivo inteiro no prompt é a versão curta.',
    },
    docs: '/events#received-document',
    file: 'flows/pdf.flow.ts',
    code: `import { readFile } from 'node:fs/promises'
import { PDFParse } from 'pdf-parse'
import { EVENTS, addKeyword } from '@builderbot/bot'

export default addKeyword(EVENTS.DOCUMENT)
    .addAction(async (ctx, { provider, state, flowDynamic }) => {
        const filePath = await provider.saveFile(ctx, { path: './tmp' })
        const parser = new PDFParse({ data: await readFile(filePath) })
        const { text } = await parser.getText()
        await parser.destroy()

        if (!text.trim()) return flowDynamic('I could not read text in that PDF.')
        await state.update({ doc: text.slice(0, 12000) })
        await flowDynamic('Got it. Ask me about the document.')
    })
    .addAnswer('Any other question?', { capture: true }, async (ctx, { state, flowDynamic }) => {
        const doc = state.get('doc') as string
        const answer = await (async () => {
            ${chat(`[
                { role: 'system', content: 'doc' },
                { role: 'user', content: ctx.body },
            ]`.replace(
                "content: 'doc'",
                "content: `Answer only with this document. If it is not in the text, say you don't know.\\n\${doc}`"
            ))}
        })()
        await flowDynamic(answer)
    })`,
  },
  {
    id: 'support-handoff',
    category: 'support',
    title: 'Support bot that hands the chat to a person',
    summary: {
      en: 'Answers the FAQ, and the moment the customer asks for a person the bot stops talking to them and alerts your team.',
      es: 'Responde la FAQ y, en cuanto el cliente pide una persona, el bot deja de hablarle y avisa a tu equipo.',
      pt: 'Responde a FAQ e, quando o cliente pede uma pessoa, o bot para de falar com ele e avisa seu time.',
    },
    recipe: {
      en: 'Match the handoff before calling the model, `gotoFlow` to a flow that alerts your team, then `blacklist.add(ctx.from)`. While the number is muted the bot keeps answering everyone else. Write "unmute" from the admin chat to give the bot back.',
      es: 'Detecta el handoff antes de llamar al modelo, haz `gotoFlow` a un flow que avisa a tu equipo y luego `blacklist.add(ctx.from)`. Mientras el número está en mute el bot sigue respondiendo al resto. Escribe "unmute" desde el chat de admin para devolverle el bot.',
      pt: 'Detecte o handoff antes de chamar o modelo, faça `gotoFlow` para um flow que avisa seu time e depois `blacklist.add(ctx.from)`. Enquanto o número está em mute o bot segue respondendo o resto. Escreva "unmute" no chat de admin para devolver o bot.',
    },
    docs: '/showcases/forward-conversation-to-human',
    file: 'flows/support.flow.ts',
    code: `import { EVENTS, addKeyword } from '@builderbot/bot'

const HUMAN = /(human|agent|person|asesor|persona|atendente)/i
const FAQ = 'Returns: 30 days with the receipt. Shipping: 24 to 72 hours inside the country.'

const alertTeam = async (from: string, text: string) => {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: \`\${from} wants a person: \${text}\` }),
    })
}

export const humanFlow = addKeyword(EVENTS.ACTION).addAnswer(
    'I am passing you to a person. Write your message and they will reply here.',
    { capture: true },
    async (ctx, { blacklist, flowDynamic }) => {
        await alertTeam(ctx.from, ctx.body)
        blacklist.add(ctx.from)
        await flowDynamic('Done. I will stay quiet in this chat until the team sends you back.')
    }
)

const supportFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, { gotoFlow, flowDynamic }) => {
    if (HUMAN.test(ctx.body)) return gotoFlow(humanFlow)
    const answer = await (async () => {
        ${chat(`[
            { role: 'system', content: 'Answer only from this FAQ. If it is not covered, say you will pass them to a person. FAQ: ' + FAQ },
            { role: 'user', content: ctx.body },
        ]`)}
    })()
    await flowDynamic(answer)
})

export default [supportFlow, humanFlow]`,
  },
  {
    id: 'meeting-booking',
    category: 'leads',
    title: 'Book a meeting from the chat',
    summary: {
      en: 'Offer the slots you actually have, accept only one of them, and book it. A typo asks again instead of reserving the wrong hour.',
      es: 'Ofreces los huecos que de verdad tienes, aceptas solo uno de ellos y reservas. Un typo vuelve a preguntar en lugar de reservar la hora equivocada.',
      pt: 'Você oferece os horários que realmente tem, aceita só um deles e reserva. Um erro de digitação pergunta de novo em vez de reservar a hora errada.',
    },
    recipe: {
      en: 'Give the model a real list, not "suggest some times". Match the day in lowercase, `fallBack` when nothing matches, and only then POST to the calendar.',
      es: 'Dale al modelo una lista real, no "sugiere unas horas". Empareja el día en minúsculas, `fallBack` cuando no coincide nada y solo entonces haz POST al calendario.',
      pt: 'Dê ao modelo uma lista real, não "sugira uns horários". Case o dia em minúsculas, `fallBack` quando nada coincidir e só então faça POST no calendário.',
    },
    docs: '/methods#fall-back',
    file: 'flows/meeting.flow.ts',
    code: `import { addKeyword } from '@builderbot/bot'

const SLOTS = ['monday 10:00', 'tuesday 16:00', 'wednesday 09:30']

export default addKeyword(['meeting', 'cita', 'agenda'])
    .addAnswer(
        \`I can do \${SLOTS.join(', ')}. Which one?\`,
        { capture: true },
        async (ctx, { state, fallBack }) => {
            const picked = SLOTS.find((slot) => ctx.body.toLowerCase().includes(slot.split(' ')[0]))
            if (!picked) return fallBack('Write the day: monday, tuesday or wednesday.')
            await state.update({ picked })
        }
    )
    .addAnswer('Your email for the invite?', { capture: true }, async (ctx, { state, fallBack }) => {
        if (!ctx.body.includes('@')) return fallBack('That does not look like an email.')
        await state.update({ email: ctx.body.trim() })
    })
    .addAction(async (ctx, { state, flowDynamic }) => {
        const { picked, email } = state.getMyState()
        await fetch(process.env.CALENDAR_WEBHOOK_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slot: picked, email, from: ctx.from }),
        })
        await flowDynamic(\`Booked \${picked}. The invite goes to \${email}.\`)
    })`,
  },
  {
    id: 'multimodal-inbox',
    category: 'assistants',
    title: 'One inbox for text, voice, images and PDFs',
    summary: {
      en: 'Each kind of message has its own event, and the bot remembers the last file so the next text message can refer to it.',
      es: 'Cada tipo de mensaje tiene su evento, y el bot recuerda el último archivo para que el siguiente texto pueda referirse a él.',
      pt: 'Cada tipo de mensagem tem seu evento, e o bot lembra o último arquivo para o próximo texto poder se referir a ele.',
    },
    recipe: {
      en: 'Do not treat a voice note as an image. `EVENTS.VOICE_NOTE`, `EVENTS.MEDIA` and `EVENTS.DOCUMENT` are different flows; they all write `state.last`, and `EVENTS.WELCOME` reads it when the customer asks "what did I send?".',
      es: 'No trates una nota de voz como una imagen. `EVENTS.VOICE_NOTE`, `EVENTS.MEDIA` y `EVENTS.DOCUMENT` son flows distintos; todos escriben `state.last`, y `EVENTS.WELCOME` lo lee cuando el cliente pregunta "¿qué envié?".',
      pt: 'Não trate uma nota de voz como imagem. `EVENTS.VOICE_NOTE`, `EVENTS.MEDIA` e `EVENTS.DOCUMENT` são flows diferentes; todos escrevem `state.last`, e `EVENTS.WELCOME` lê isso quando o cliente pergunta "o que eu enviei?".',
    },
    docs: '/events',
    file: 'flows/inbox.flow.ts',
    code: `import { EVENTS, addKeyword } from '@builderbot/bot'

const note = (label: string) => async (ctx: any, { provider, state, flowDynamic }: any) => {
    const file = await provider.saveFile(ctx, { path: './tmp' })
    await state.update({ last: \`\${label}: \${file}\` })
    await flowDynamic(\`Saved the \${label}. Ask me "what did I send?" any time.\`)
}

const textFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, { state, flowDynamic }) => {
    if (!/what did i send|qu[eé] envi|o que eu enviei/i.test(ctx.body)) {
        return flowDynamic('Send a voice note, an image or a PDF. I keep the last one.')
    }
    const last = state.get('last')
    await flowDynamic(last ? \`Last file: \${last}\` : 'Nothing yet.')
})

export default [
    textFlow,
    addKeyword(EVENTS.VOICE_NOTE).addAction(note('voice note')),
    addKeyword(EVENTS.MEDIA).addAction(note('image')),
    addKeyword(EVENTS.DOCUMENT).addAction(note('pdf')),
]
`,
  },
]
