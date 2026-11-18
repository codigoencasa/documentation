/**
 * LAYER: Infrastructure (build-time)
 * Contains: sync-versions — asks the npm registry for the current published versions of
 *   `@builderbot/bot` and `create-builderbot`, plus the version the playground engine was built from,
 *   and writes src/lib/generated/versions.json.
 * Rules: Pure build step. Never fails the build: if the registry is unreachable the previous file is
 *   kept, so deploy still succeeds and the UI keeps the last known-good values.
 * GOAL: Stop hardcoding versions in the UI. The badge always shows the engine that really runs, and
 *   tells the reader when npm has something newer.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'src/lib/generated/versions.json')
const ENGINE = path.join(ROOT, 'src/lib/playground/bot.generated.js')

const PACKAGES = {
  bot: '@builderbot/bot',
  cli: 'create-builderbot',
}

/** Version the bundled playground engine was generated from (see scripts/sync-playground.mjs). */
function readEngineVersion() {
  try {
    const generated = fs.readFileSync(ENGINE, 'utf8')
    return /export const BOT_VERSION = "([^"]+)"/.exec(generated)?.[1] ?? null
  } catch {
    return null
  }
}

async function latest(pkg) {
  const res = await fetch(`https://registry.npmjs.org/${pkg.replace('/', '%2F')}/latest`, {
    headers: { accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`${pkg}: HTTP ${res.status}`)
  const json = await res.json()
  return json.version ?? null
}

function readPrevious() {
  try {
    return JSON.parse(fs.readFileSync(OUT, 'utf8'))
  } catch {
    return {}
  }
}

const previous = readPrevious()
const versions = { ...previous, engine: readEngineVersion() }
let fetched = 0

for (const [key, pkg] of Object.entries(PACKAGES)) {
  try {
    const version = await latest(pkg)
    if (version) {
      versions[key] = version
      fetched++
    }
  } catch (error) {
    console.warn(`[versions] could not read ${pkg}: ${error.message} (keeping ${previous[key] ?? 'unknown'})`)
  }
}

versions.checkedAt = fetched ? new Date().toISOString() : previous.checkedAt ?? null

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, `${JSON.stringify(versions, null, 2)}\n`)

const behind = versions.bot && versions.engine && versions.bot !== versions.engine
console.log(
  `[versions] @builderbot/bot ${versions.bot ?? '?'} · create-builderbot ${versions.cli ?? '?'} · playground engine ${versions.engine ?? '?'}` +
    (behind ? ` (run "pnpm sync:playground" to update the engine to ${versions.bot})` : '')
)
