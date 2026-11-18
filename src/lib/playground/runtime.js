/**
 * LAYER: Application
 * Contains: Playground use cases — compile flow code written like the docs, boot the real bot, talk to it
 * Rules: No React, no DOM. Conversation behaviour comes only from @builderbot/bot.
 * GOAL: Turn a code snippet from the documentation into a running bot the reader can chat with.
 */
import { addAnswer, addKeyword, createBot, createFlow, EVENTS, MemoryDB, utils } from './bot.generated'
import { PlaygroundProvider } from './provider'

export { BOT_VERSION } from './bot.generated'
export { INBOUND_EVENT } from './provider'

export const CONTACT = { from: '34600000000', name: 'Ana' }

export class PlaygroundCodeError extends Error {}

/** `import … from '@builderbot/bot'` and `export` are module syntax; the playground supplies the API instead. */
function toScript(code) {
  return code
    .replace(/^\s*import[\s\S]*?from\s*['"][^'"]+['"];?/gm, '')
    .replace(/^\s*export\s+default\s+[\w$]+;?\s*$/gm, '')
    .replace(/^(\s*)export\s+/gm, '$1')
}

/**
 * Runs the snippet and returns the flow it passed to `createFlow([...])`.
 * @throws {PlaygroundCodeError} when the code does not compile, throws, or never calls createFlow
 */
export function compileFlows(code) {
  let adapterFlow = null
  const api = {
    addKeyword,
    addAnswer,
    EVENTS,
    utils,
    createFlow: (flows) => (adapterFlow = createFlow(flows)),
  }
  try {
    new Function(...Object.keys(api), `"use strict";\n${toScript(code)}`)(...Object.values(api))
  } catch (error) {
    throw new PlaygroundCodeError(error?.message ?? String(error))
  }
  if (!adapterFlow) throw new PlaygroundCodeError('Pass your flows to createFlow([...]) so the bot can load them.')
  return adapterFlow
}

/**
 * Boots a fresh bot (MemoryDB + PlaygroundProvider) over the compiled flows.
 * `onMessage` receives every message the bot sends: `{ message, options }`.
 */
export async function startBot(code, { onMessage }) {
  const flow = compileFlows(code)
  const provider = new PlaygroundProvider(onMessage)
  await createBot({ flow, provider, database: new MemoryDB() })
  return {
    send: (text) => provider.receive(CONTACT.from, CONTACT.name, text),
    sendEvent: (kind) => provider.receiveEvent(CONTACT.from, CONTACT.name, kind),
    stop: () => provider.disconnect(),
  }
}
