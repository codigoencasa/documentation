/**
 * LAYER: Domain
 * Contains: Playground example catalog — flow snippets taken from the documentation pages
 * Rules: Plain data. Code is written exactly as a reader would in their bot, importing from '@builderbot/bot'.
 * GOAL: One place that maps each documented concept to a runnable snippet and what to type to see it.
 */

export const EXAMPLES = [
  {
    id: 'hello',
    doc: '/quickstart',
    title: { en: 'Hello world', es: 'Hola mundo', pt: 'Olá mundo' },
    hint: { en: 'Write “hi”', es: 'Escribe “hi”', pt: 'Escreva “hi”' },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const welcomeFlow = addKeyword(['hello', 'hi'])
  .addAnswer('Ey! welcome')

createFlow([welcomeFlow])`,
  },
  {
    id: 'answers',
    doc: '/add-functions#add-answer',
    title: { en: 'addAnswer', es: 'addAnswer', pt: 'addAnswer' },
    hint: { en: 'Write “info”', es: 'Escribe “info”', pt: 'Escreva “info”' },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const infoFlow = addKeyword('info')
  .addAnswer('This is the first message')
  .addAnswer(['A message', 'with line breaks'])
  .addAnswer('This one waits 2 seconds', { delay: 2000 })
  .addAnswer('And this one has an image', {
    media: 'https://i.imgur.com/0HpzsEm.png',
  })

createFlow([infoFlow])`,
  },
  {
    id: 'keywords',
    doc: '/add-functions#regex',
    title: { en: 'Regex & sensitive', es: 'Regex y sensitive', pt: 'Regex e sensitive' },
    hint: {
      en: 'Try “me@gmail.com”, “buy” and “BUY”',
      es: 'Prueba “me@gmail.com”, “buy” y “BUY”',
      pt: 'Teste “me@gmail.com”, “buy” e “BUY”',
    },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

// The pattern goes as a string: the core evaluates it when regex is true
const REGEX_GMAIL_EMAIL = '/(\\\\w+)@gmail\\\\.com/g'

const gmailFlow = addKeyword(REGEX_GMAIL_EMAIL, { regex: true })
  .addAnswer('Thanks for the gmail address')

const buyFlow = addKeyword('buy', { sensitive: true })
  .addAnswer(['Great! ', 'What do you want to buy?'])

createFlow([gmailFlow, buyFlow])`,
  },
  {
    id: 'action',
    doc: '/add-functions#add-action',
    title: { en: 'addAction', es: 'addAction', pt: 'addAction' },
    hint: { en: 'Write “time”', es: 'Escribe “time”', pt: 'Escreva “time”' },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const timeFlow = addKeyword('time')
  .addAction(async (ctx, { flowDynamic }) => {
    const now = new Date().toLocaleTimeString()
    await flowDynamic(\`Hi \${ctx.name}, it is \${now}\`)
  })
  .addAnswer('Anything else?')

createFlow([timeFlow])`,
  },
  {
    id: 'state',
    doc: '/methods#state',
    title: { en: 'capture & state', es: 'capture y state', pt: 'capture e state' },
    hint: {
      en: 'Write “register”, answer, then “resume”',
      es: 'Escribe “register”, responde y luego “resume”',
      pt: 'Escreva “register”, responda e depois “resume”',
    },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const flowA = addKeyword('register')
  .addAnswer('What is your name?', { capture: true }, async (ctx, { state }) => {
    await state.update({ name: ctx.body })
  })
  .addAnswer('What is your email?', { capture: true }, async (ctx, { state }) => {
    await state.update({ email: ctx.body })
  })
  .addAnswer('Done! Write "resume" to see your data')

const flowB = addKeyword('resume')
  .addAnswer('ok your summary is..', null, async (_, { state, flowDynamic }) => {
    const allState = state.getMyState()
    await flowDynamic(\`Name: \${allState.name}, Email: \${allState.email}\`)
  })

createFlow([flowA, flowB])`,
  },
  {
    id: 'flowDynamic',
    doc: '/methods#flow-dynamic',
    title: { en: 'flowDynamic', es: 'flowDynamic', pt: 'flowDynamic' },
    hint: { en: 'Write “products”', es: 'Escribe “products”', pt: 'Escreva “products”' },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const flowProducts = addKeyword('products')
  .addAction(async (_, { flowDynamic }) => {
    // const data = await (await fetch('https://your-api.example.com/products')).json()
    const data = [
      { name: 'Shirt', photo: 'https://i.imgur.com/0HpzsEm.png' },
      { name: 'Shoes', photo: 'https://i.imgur.com/0HpzsEm.png' },
    ]
    await flowDynamic(data.map((item) => ({ body: \`Item: \${item.name}\`, media: item.photo })))
    await flowDynamic([{ body: 'This message arrives 2 seconds later', delay: 2000 }])
  })

createFlow([flowProducts])`,
  },
  {
    id: 'fallBack',
    doc: '/methods#fall-back',
    title: { en: 'fallBack', es: 'fallBack', pt: 'fallBack' },
    hint: {
      en: 'Write “hello”, then an invalid email',
      es: 'Escribe “hello” y luego un email inválido',
      pt: 'Escreva “hello” e depois um email inválido',
    },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const flowEmailRegister = addKeyword('hello')
  .addAnswer('What is your email?', { capture: true }, (ctx, { fallBack }) => {
    if (!ctx.body.includes('@')) {
      return fallBack('Ups! is not a valid email')
    }
  })
  .addAnswer('Thanks, your email is saved')

createFlow([flowEmailRegister])`,
  },
  {
    id: 'endFlow',
    doc: '/methods#end-flow',
    title: { en: 'endFlow', es: 'endFlow', pt: 'endFlow' },
    hint: {
      en: 'Write “Hi”, then try “cancel”',
      es: 'Escribe “Hi” y luego prueba “cancel”',
      pt: 'Escreva “Hi” e depois teste “cancel”',
    },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const flowRegister = addKeyword(['Hi'])
  .addAnswer(
    ['Hello!', 'To submit the form I need some data...', 'Write your *Name*'],
    { capture: true },
    async (ctx, { flowDynamic, endFlow, state }) => {
      if (ctx.body === 'cancel') {
        return endFlow('Your request has been canceled')
      }
      await state.update({ name: ctx.body })
      return flowDynamic(\`Nice to meet you *\${ctx.body}*, let's continue...\`)
    }
  )
  .addAnswer(['I also need your last names'], { capture: true }, async (ctx, { flowDynamic, endFlow }) => {
    if (ctx.body === 'cancel') {
      return endFlow()
    }
    return flowDynamic(\`Perfect *\${ctx.body}*, finally...\`)
  })

createFlow([flowRegister])`,
  },
  {
    id: 'gotoFlow',
    doc: '/methods#goto-flow',
    title: { en: 'gotoFlow', es: 'gotoFlow', pt: 'gotoFlow' },
    hint: {
      en: 'Write “hi”, then “yes” or “no”',
      es: 'Escribe “hi” y luego “yes” o “no”',
      pt: 'Escreva “hi” e depois “yes” ou “no”',
    },
    code: `import { addKeyword, createFlow, EVENTS } from '@builderbot/bot'

const flowRegistered = addKeyword(EVENTS.ACTION)
  .addAction(async (_, { flowDynamic }) => {
    await flowDynamic('Hello Leifer! Welcome back.')
  })

const flowUserNotRegistered = addKeyword(EVENTS.ACTION)
  .addAnswer("It's your first time here! What's your email address?", { capture: true },
    async (_, { flowDynamic, gotoFlow }) => {
      await flowDynamic('We have registered you!')
      return gotoFlow(flowRegistered)
    })

const flowWelcome = addKeyword('hi')
  .addAnswer('Welcome! Are you registered? (yes/no)', { capture: true },
    async (ctx, { gotoFlow }) => {
      const userRegistered = ctx.body.toLowerCase() === 'yes'
      if (userRegistered) return gotoFlow(flowRegistered)
      return gotoFlow(flowUserNotRegistered)
    })

createFlow([flowWelcome, flowRegistered, flowUserNotRegistered])`,
  },
  {
    id: 'events',
    doc: '/events',
    title: { en: 'EVENTS', es: 'EVENTS', pt: 'EVENTS' },
    hint: {
      en: 'Write anything, or send an image, a voice note, a document or a location',
      es: 'Escribe cualquier cosa o envía una imagen, una nota de voz, un documento o una ubicación',
      pt: 'Escreva qualquer coisa ou envie uma imagem, uma nota de voz, um documento ou uma localização',
    },
    code: `import { addKeyword, createFlow, EVENTS } from '@builderbot/bot'

const welcomeFlow = addKeyword(EVENTS.WELCOME)
  .addAnswer('No keyword matched: this is EVENTS.WELCOME')

const mediaFlow = addKeyword(EVENTS.MEDIA)
  .addAnswer('I received a media image/video')

const voiceNoteFlow = addKeyword(EVENTS.VOICE_NOTE)
  .addAnswer('Give me a second to hear you!')

const documentFlow = addKeyword(EVENTS.DOCUMENT)
  .addAnswer("Wow! I'm reading this document")

const locationFlow = addKeyword(EVENTS.LOCATION)
  .addAnswer("I have received your location!")

createFlow([welcomeFlow, mediaFlow, voiceNoteFlow, documentFlow, locationFlow])`,
  },
  {
    id: 'globalState',
    doc: '/methods#global-state',
    title: { en: 'globalState', es: 'globalState', pt: 'globalState' },
    hint: {
      en: 'Write “hi”, then “turnOffBot” and “hi” again',
      es: 'Escribe “hi”, luego “turnOffBot” y otra vez “hi”',
      pt: 'Escreva “hi”, depois “turnOffBot” e “hi” de novo',
    },
    code: `import { addKeyword, createFlow } from '@builderbot/bot'

const flowOnOff = addKeyword('turnOffBot')
  .addAction(async (_, { globalState, flowDynamic, endFlow }) => {
    const enabled = globalState.get('enable') !== false
    await globalState.update({ enable: !enabled })
    if (enabled) return endFlow('Bot is: OFF')
    await flowDynamic('Bot is: ON')
  })

const flowWelcome = addKeyword('hi')
  .addAction(async (_, { globalState, endFlow }) => {
    if (globalState.get('enable') === false) return endFlow()
  })
  .addAnswer('Welcome to...')

createFlow([flowWelcome, flowOnOff])`,
  },
]

export const findExample = (id) => EXAMPLES.find((example) => example.id === id) ?? EXAMPLES[0]
