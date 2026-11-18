/**
 * LAYER: Infrastructure
 * Contains: PlaygroundProvider — a @builderbot/bot provider whose channel is the browser chat
 * Rules: Implements ProviderClass only. No HTTP server, no vendor; messages go to a listener.
 * GOAL: Connect the real bot core to the playground UI the same way Baileys or Meta connect it to WhatsApp.
 */
import { ProviderClass, utils } from './bot.generated'

/** Inbound event kinds the chat can send, and the `body` prefix each provider uses for them. */
export const INBOUND_EVENT = {
  media: '_event_media_',
  voice: '_event_voice_note_',
  document: '_event_document_',
  location: '_event_location_',
}

export class PlaygroundProvider extends ProviderClass {
  globalVendorArgs = { name: 'playground' }

  constructor(listener) {
    super()
    this.listener = listener
  }

  beforeHttpServerInit() {}

  afterHttpServerInit() {}

  async initVendor() {}

  busEvents() {
    return []
  }

  async saveFile() {
    return ''
  }

  async sendMessage(to, message, context) {
    this.listener?.({ to, message, options: context?.options ?? {} })
    return { to, message }
  }

  /** What a contact's message looks like when it reaches the core. */
  receive(from, name, body) {
    this.emit('message', { from, name, body })
  }

  receiveEvent(from, name, kind) {
    this.receive(from, name, utils.generateRefProvider(INBOUND_EVENT[kind]))
  }

  disconnect() {
    this.listener = null
  }
}
