/**
 * LAYER: Infrastructure
 * Contains: `process` and `Buffer` globals injected into the browser bundle of @builderbot/bot
 * Rules: Only the members the core reads. Not a polyfill for user code.
 * GOAL: Satisfy the few Node globals the engine touches outside its server code.
 */

export const process = { env: {}, cwd: () => '', argv: [], platform: 'browser' }

const encode = (text) => new TextEncoder().encode(text)
const decode = (bytes) => new TextDecoder().decode(bytes)

class BrowserBuffer {
  constructor(bytes) {
    this.bytes = bytes
  }
  static from(value, encoding = 'utf8') {
    if (value instanceof Uint8Array) return new BrowserBuffer(value)
    if (encoding === 'base64') return new BrowserBuffer(Uint8Array.from(atob(value), (c) => c.charCodeAt(0)))
    return new BrowserBuffer(encode(String(value)))
  }
  toString(encoding = 'utf8') {
    if (encoding === 'base64') return btoa(String.fromCharCode(...this.bytes))
    return decode(this.bytes)
  }
}

export { BrowserBuffer as Buffer }
