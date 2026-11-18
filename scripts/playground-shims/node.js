/**
 * LAYER: Infrastructure
 * Contains: Browser stand-ins for the Node built-ins and server packages @builderbot/bot imports
 * Rules: Only what the core touches while routing messages. HTTP server, files, audio and image
 * helpers become no-ops: the playground has no server and no disk.
 * GOAL: Let the real flow engine run unchanged in the browser.
 */

const noop = () => {}
const passThrough = () => (_req, _res, next) => next?.()

/* console */
export class Console {
  log() {}
  info() {}
  warn() {}
  error() {}
  debug() {}
}

/* events */
export class EventEmitter {
  constructor() {
    this.handlers = new Map()
  }
  on(name, handler) {
    this.handlers.set(name, [...(this.handlers.get(name) ?? []), handler])
    return this
  }
  off(name, handler) {
    this.handlers.set(name, (this.handlers.get(name) ?? []).filter((h) => h !== handler))
    return this
  }
  emit(name, ...args) {
    const list = this.handlers.get(name) ?? []
    list.forEach((handler) => handler(...args))
    return list.length > 0
  }
}

/* fs */
const stream = { write: noop, end: noop, on: noop, once: noop }
export const createWriteStream = () => stream
export const existsSync = () => false
export const mkdirSync = noop
export const rename = (_a, _b, cb) => cb?.()
export const unlinkSync = noop
export const promises = { readFile: async () => new Uint8Array(), writeFile: async () => {} }

/* crypto — deterministic hashes and a reversible "cipher"; nothing here protects data */
export const randomUUID = () => globalThis.crypto.randomUUID()
export const randomBytes = (size) => {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(size))
  return { toString: () => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('') }
}

function hashHex(input) {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  const part = (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0')
  return part.repeat(8)
}

export const createHash = () => {
  let data = ''
  return {
    update(chunk) {
      data += String(chunk)
      return this
    },
    digest: () => hashHex(data),
  }
}

const toHex = (text) =>
  Array.from(new TextEncoder().encode(text), (b) => b.toString(16).padStart(2, '0')).join('')
const fromHex = (hex) => new TextDecoder().decode(new Uint8Array((hex.match(/../g) ?? []).map((b) => parseInt(b, 16))))

export const createCipheriv = () => ({ update: (data) => toHex(data), final: () => '' })
export const createDecipheriv = () => ({ update: (hex) => fromHex(hex), final: () => '' })

/* async_hooks — the store lives for the duration of the job's promise */
export class AsyncLocalStorage {
  constructor() {
    this.stack = []
  }
  run(store, fn, ...args) {
    this.stack.push(store)
    const release = () => {
      const at = this.stack.lastIndexOf(store)
      if (at !== -1) this.stack.splice(at, 1)
    }
    try {
      const result = fn(...args)
      if (result && typeof result.then === 'function') return result.finally(release)
      release()
      return result
    } catch (error) {
      release()
      throw error
    }
  }
  getStore() {
    return this.stack[this.stack.length - 1]
  }
}

/* polka / body-parser / cors */
export function polka() {
  const app = {
    use: () => app,
    get: () => app,
    post: () => app,
    listen: (_port, cb) => {
      cb?.()
      return app
    },
    server: { close: noop },
  }
  return app
}
export const json = passThrough
export const urlencoded = passThrough
export const cors = passThrough

/* os / path */
export const tmpdir = () => '/tmp'
export const join = (...parts) => parts.filter(Boolean).join('/').replace(/\/+/g, '/')
export const resolve = join
export const extname = (p) => (/\.[^./]*$/.exec(p) ?? [''])[0]
export const basename = (p, ext) => {
  const base = String(p).split('/').pop() ?? ''
  return ext && base.endsWith(ext) ? base.slice(0, -ext.length) : base
}
export const parse = (p) => ({ name: basename(p, extname(p)), ext: extname(p), base: basename(p) })

/* follow-redirects / http / mime-types / ffmpeg / sharp */
export const http = {}
export const https = {}
export const mimeTypes = { lookup: () => false, extension: () => false, contentType: () => false }
export const ffmpegInstaller = { path: '' }
export function ffmpeg() {
  return {}
}
ffmpeg.setFfmpegPath = noop
