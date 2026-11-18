/**
 * LAYER: Infrastructure (build-time)
 * Contains: generate-seo — scans src/pages/<locale> and writes:
 *   - src/lib/generated/routes.json (locale availability map)
 *   - src/lib/generated/page-meta.json (extracted titles & descriptions per page)
 *   - public/<locale>/<route>.md (clean Markdown version of every doc page for LLMs)
 *   - public/llms.txt & public/.well-known/llms.txt (llmstxt.org v2 index)
 *   - public/<locale>/llms.txt (locale-specific llms.txt indexes)
 *   - public/llms-ctx.txt (curated core context bundle for coding agents)
 *   - public/llms-full.txt & public/<locale>/llms-full.txt (full corpus exports)
 *   - public/sitemap.xml & public/robots.txt
 * Rules: Pure build step, no runtime deps. Runs on `prebuild` and `predev`.
 * GOAL: Full SEO + GEO / AI agent discoverability (llmstxt.org v2 + Markdown routes).
 */
import fs from 'node:fs'
import path from 'node:path'

import { TEMPLATES, UPDATED } from '../src/lib/templates.mjs'

const ROOT = process.cwd()
const PAGES = path.join(ROOT, 'src/pages')
const OUT_ROUTES = path.join(ROOT, 'src/lib/generated/routes.json')
const OUT_META = path.join(ROOT, 'src/lib/generated/page-meta.json')
const PUBLIC = path.join(ROOT, 'public')

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.builderbot.app').replace(/\/$/, '')
const LOCALES = ['en', 'es', 'pt']
const DEFAULT_LOCALE = 'en'

/** Boilerplate descriptions left over from the original Tailwind Protocol template or copy-pasted stubs */
const TEMPLATE_BOILERPLATE_RE =
  /Protocol API|something goes wrong while (you work|working) with the API|API de protocolo|algo sale mal mientras trabaja con la API|algo dá errado enquanto você trabalha com a API|what to do to connecting another database/i

function isBoilerplateDescription(desc, route) {
  if (!desc) return true
  if (TEMPLATE_BOILERPLATE_RE.test(desc)) return true
  if (route !== '/showcases/queue-limit' && /Implement message queues for better resource management/i.test(desc)) {
    return true
  }
  if (route !== '/deploy/docker' && /create a Dockerfile and how to deploy your bot/i.test(desc)) {
    return true
  }
  return false
}

function truncateClean(text, max = 220) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const sliced = clean.slice(0, max)
  const lastSpace = sliced.lastIndexOf(' ')
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).replace(/[.,;:!?-]+$/, '')}...`
}

/**
 * Renders the template catalog (src/lib/templates.mjs) as Markdown, so the generated
 * `.md` route, llms.txt and llms-full.txt carry the same content as the React page.
 */
function buildTemplatesMarkdown(locale) {
  const heads = {
    en: { file: 'File', code: 'BuilderBot implementation', docs: 'Docs', updated: 'Updated' },
    es: { file: 'Archivo', code: 'Implementación en BuilderBot', docs: 'Documentación', updated: 'Actualizado' },
    pt: { file: 'Arquivo', code: 'Implementação em BuilderBot', docs: 'Documentação', updated: 'Atualizado' },
  }[locale] ?? { file: 'File', code: 'BuilderBot implementation', docs: 'Docs', updated: 'Updated' }

  const blocks = TEMPLATES.map((template) => {
    const summary = template.summary[locale] ?? template.summary.en
    const recipe = template.recipe[locale] ?? template.recipe.en
    return [
      `### ${template.title}`,
      '',
      `- **${heads.file}:** \`${template.file}\``,
      `- **${heads.docs}:** ${template.docs}`,
      '',
      summary,
      '',
      `**${heads.code}:**`,
      '',
      '```ts',
      template.code,
      '```',
      '',
      recipe,
    ].join('\n')
  })

  return [`_${heads.updated} ${UPDATED}._`, '', ...blocks].join('\n\n')
}

const NAV_GROUPS = [
  {
    title: 'Start here',
    routes: ['/', '/quickstart', '/concepts', '/uses-cases', '/templates', '/playground'],
  },
  {
    title: 'Basics',
    routes: ['/add-functions', '/context', '/methods', '/events', '/errors'],
  },
  {
    title: 'Databases',
    routes: [
      '/databases',
      '/databases/memory',
      '/databases/json',
      '/databases/mongo',
      '/databases/mysql',
      '/databases/postgres',
      '/databases/postgres/uses-cases',
      '/databases/postgres/uses-cases/uses-cases-supabase',
    ],
  },
  {
    title: 'Providers',
    routes: [
      '/providers',
      '/providers/baileys',
      '/providers/baileys/blocked-users',
      '/providers/baileys/delete-bot-message',
      '/providers/baileys/delete-on-bot',
      '/providers/baileys/external-api',
      '/providers/baileys/fetchStatus',
      '/providers/baileys/menu',
      '/providers/meta',
      '/providers/meta/uses-cases',
      '/providers/twilio',
      '/providers/twilio/uses-cases',
      '/providers/twilio/deploy',
      '/providers/venom',
      '/providers/wpp-connect',
    ],
  },
  {
    title: 'Deploy',
    routes: ['/deploy', '/deploy/railway', '/deploy/docker', '/deploy/vps', '/deploy/meta'],
  },
  {
    title: 'Recipes & Showcases',
    routes: [
      '/showcases',
      '/showcases/queue-limit',
      '/showcases/modularize',
      '/showcases/fast-entires',
      '/showcases/idle-optional',
      '/showcases/docker-pm2',
      '/showcases/event-in-out-messages',
      '/showcases/cron-reminder',
      '/showcases/forward-conversation-to-human',
      '/showcases/gotoflow-use',
      '/showcases/multiple-messages',
      '/showcases/api-use',
    ],
  },
  {
    title: 'Tutorials',
    routes: [
      '/tutorials',
      '/tutorials/migrate-to-builderbot',
      '/tutorials/api-use',
      '/tutorials/chatbot-with-gemini',
      '/tutorials/langchain',
    ],
  },
  {
    title: 'Plugins',
    routes: ['/plugins', '/plugins/telegram', '/plugins/shopify', '/plugins/agents', '/plugins/langchain'],
  },
  {
    title: 'Optional',
    routes: [
      '/contribute',
      '/contribute/core',
      '/resources',
      '/attachments',
      '/contacts',
      '/conversations',
      '/groups',
      '/messages',
      '/webhooks',
    ],
  },
]

const CORE_CTX_ROUTES = [
  '/',
  '/quickstart',
  '/concepts',
  '/add-functions',
  '/context',
  '/methods',
  '/events',
  '/databases',
  '/providers',
  '/providers/baileys',
  '/providers/meta',
  '/providers/twilio',
  '/tutorials/api-use',
]

function humanizeRoute(route) {
  if (route === '/') return 'Introduction'
  const last = route.split('/').filter(Boolean).pop() || 'Documentation'
  return last
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function walk(dir, base = '') {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    const abs = path.join(dir, entry.name)
    const rel = `${base}/${entry.name}`
    if (entry.isDirectory()) {
      out.push(...walk(abs, rel))
    } else if (/\.(mdx|jsx|js)$/.test(entry.name)) {
      const route = rel.replace(/\.(mdx|jsx|js)$/, '').replace(/\/index$/, '') || '/'
      out.push({ route, abs })
    }
  }
  return out
}

/**
 * Converts raw MDX into clean, LLM-friendly Markdown and extracts real title + description.
 */
function parseMdxFile(absPath, route, locale) {
  const raw = fs.readFileSync(absPath, 'utf8')

  let exportedTitle = null
  const titleMatch = raw.match(/export\s+const\s+title\s*=\s*(['"`])([\s\S]*?)\1/)
  if (titleMatch) exportedTitle = titleMatch[2].trim()

  let exportedDesc = null
  const descMatch = raw.match(/export\s+const\s+description\s*=\s*(['"`])([\s\S]*?)\1/)
  if (descMatch && !isBoilerplateDescription(descMatch[2], route)) {
    exportedDesc = truncateClean(descMatch[2], 220)
  }

  // Strip top-level import and export statements outside code blocks
  const lines = raw.split(/\r?\n/)
  let inFence = false
  let inExport = false
  const bodyLines = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      // Convert ```ts {{ title: 'app.ts' }} -> ```ts (app.ts)
      const cleanedFence = line.replace(
        /^(\s*```[\w-]*)\s*\{\{\s*title:\s*['"]([^'"]+)['"][^}]*\}\}/,
        '$1 ($2)'
      ).replace(/\s*\{\{[\s\S]*?\}\}/, '')
      bodyLines.push(cleanedFence)
      continue
    }
    if (inFence) {
      bodyLines.push(line)
      continue
    }

    if (inExport) {
      if (/['"`]\s*;?\s*$/.test(line)) inExport = false
      continue
    }
    if (/^\s*import\s+/.test(line)) continue
    if (/^\s*export\s+const\s+(description|title|sections|sourcePath|wide)\s*=/.test(line)) {
      const afterEq = line.split('=').slice(1).join('=').trim()
      if (!afterEq || !/['"`].*['"`]/.test(afterEq)) {
        inExport = true
      }
      continue
    }

    bodyLines.push(line)
  }

  let md = bodyLines.join('\n')

  // Convert <Note> / <Warning> / <Info> callouts into Markdown blockquotes
  md = md.replace(/<(Note|Warning|Info)>([\s\S]*?)<\/\1>/gi, (_, kind, inner) => {
    const label = kind.toUpperCase()
    const cleanInner = inner
      .trim()
      .split('\n')
      .map((l) => `> ${l.trim()}`)
      .join('\n')
    return `\n> **${label}:**\n${cleanInner}\n`
  })

  // Convert <Button href="..." children="..." /> into Markdown links
  md = md.replace(
    /<Button[\s\S]*?href=["']([^"']+)["'][\s\S]*?children=["']([^"']+)["'][\s\S]*?\/>/g,
    (_, href, label) => `[${label}](${href})`
  )

  // Convert <Award href="...">text</Award>
  md = md.replace(/<Award\s+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Award>/g, '[$2]($1)')

  // Replace <TerminalDemo ... /> with a clear CLI command note
  md = md.replace(/<TerminalDemo[^>]*\/>/g, '\n```bash\npnpm create builderbot@latest\n```\n')

  // Expand <Templates locale="xx" /> into the real catalog so .md routes and llms-full.txt
  // include the ranked list (the React component is client-side only).
  if (/<Templates\b/.test(md)) {
    const localeMatch = /<Templates[^>]*locale=["']([a-z]{2})["']/.exec(md)
    md = md.replace(/<Templates\b[^>]*\/>/g, buildTemplatesMarkdown(localeMatch?.[1] || locale))
  }

  // Remove purely decorative or layout wrapper tags outside code fences
  const stripTagNames = [
    'HeroPattern',
    'Guides',
    'Resources',
    'Contributors',
    'Sponsors',
    'FlowDiagram',
    'QuickExampleResult',
    'CodeGroup',
    'Row',
    'RowCenter',
    'Col',
    'Properties',
    'Property',
    'Playground',
    'Templates',
  ]
  const selfClosingRe = new RegExp(`<(${stripTagNames.join('|')})(\\s[^>]*)?\\/>`, 'g')
  const openCloseRe = new RegExp(`<\/?(${stripTagNames.join('|')})(\\s[^>]*)?>`, 'g')
  md = md.replace(selfClosingRe, '')
  md = md.replace(openCloseRe, '')

  // Remove wrapper <div className="..."> and </div> outside code fences
  md = md
    .split(/(```[\s\S]*?```)/g)
    .map((chunk, idx) => {
      if (idx % 2 === 1) return chunk
      return chunk
        .replace(/<div[^>]*>/g, '')
        .replace(/<\/div>/g, '')
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
        .replace(/<video[\s\S]*?<\/video>/gi, '')
        .replace(/\{\s*\/\*\s*eslint[\s\S]*?\*\/\s*\}/g, '')
        .replace(/\{\{\s*[^}]*\}\}/g, '')
    })
    .join('')

  // Collapse 3+ blank lines to 2
  md = md.replace(/\n{3,}/g, '\n\n').trim()

  // Extract heading title if not exported
  let headingTitle = exportedTitle
  if (!headingTitle) {
    const h1 = md.match(/^#\s+(.+)$/m)
    const h2 = md.match(/^##\s+(.+)$/m)
    const rawHeading = (h1?.[1] || h2?.[1] || '').replace(/[*_`~]/g, '').trim()
    headingTitle =
      route === '/'
        ? locale === 'es'
          ? 'Introducción a BuilderBot'
          : locale === 'pt'
            ? 'Introdução ao BuilderBot'
            : 'Get started with BuilderBot'
        : rawHeading && rawHeading.toLowerCase() !== 'create' && rawHeading.toLowerCase() !== 'install'
          ? rawHeading
          : humanizeRoute(route)
  }

  // Extract first meaningful paragraph for description if needed
  let description = exportedDesc
  if (!description) {
    const withoutCode = md.replace(/```[\s\S]*?```/g, '')
    const paragraphs = withoutCode
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(
        (p) =>
          p.length > 35 &&
          !p.startsWith('#') &&
          !p.startsWith('>') &&
          !p.startsWith('---') &&
          !p.startsWith('<') &&
          !p.startsWith('|') &&
          !/^https?:\/\/\S+$/i.test(p)
      )
    if (paragraphs.length > 0) {
      description = truncateClean(
        paragraphs[0]
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/[*_`~]+/g, ''),
        220
      )
    }
  }

  if (!description) {
    description =
      locale === 'es'
        ? `Guía oficial de BuilderBot sobre ${headingTitle}: ejemplos en TypeScript/JavaScript para bots de WhatsApp y Telegram.`
        : locale === 'pt'
          ? `Guia oficial do BuilderBot sobre ${headingTitle}: exemplos em TypeScript/JavaScript para bots de WhatsApp e Telegram.`
          : `Official BuilderBot guide for ${headingTitle}: TypeScript and JavaScript examples for WhatsApp and Telegram chatbots.`
  }

  // Ensure the Markdown starts with an H1
  if (!/^#\s+/m.test(md)) {
    md = `# ${headingTitle}\n\n${md}`
  }

  return { title: headingTitle, description, markdown: md }
}

/** route -> locales that actually have that page */
const byRoute = new Map()
/** `${locale}:${route}` -> { locale, route, title, description, markdown, mdUrl, htmlUrl } */
const pageStore = new Map()
const pageMeta = {}

for (const locale of LOCALES) {
  const dir = path.join(PAGES, locale)
  if (!fs.existsSync(dir)) continue
  for (const { route, abs } of walk(dir)) {
    if (!byRoute.has(route)) byRoute.set(route, [])
    byRoute.get(route).push(locale)

    const parsed = parseMdxFile(abs, route, locale)
    const htmlUrl = `${SITE_URL}/${locale}${route === '/' ? '' : route}`
    const mdUrl = route === '/' ? `${SITE_URL}/${locale}/index.md` : `${SITE_URL}/${locale}${route}.md`

    const record = {
      locale,
      route,
      title: parsed.title,
      description: parsed.description,
      markdown: parsed.markdown,
      htmlUrl,
      mdUrl,
    }
    pageStore.set(`${locale}:${route}`, record)
    pageMeta[`/${locale}${route === '/' ? '' : route}`] = {
      title: parsed.title,
      description: parsed.description,
    }

    // Write static clean Markdown file(s) to public/
    const mdDocument = [
      `# ${parsed.title}`,
      '',
      `> ${parsed.description}`,
      `>`,
      `> - **Canonical URL:** ${htmlUrl}`,
      `> - **Documentation Index:** ${SITE_URL}/llms.txt`,
      `> - **Full Corpus:** ${SITE_URL}/llms-full.txt`,
      '',
      parsed.markdown.replace(/^#\s+.+\n+/, ''),
      '',
    ].join('\n')

    if (route === '/') {
      const rootMdPath = path.join(PUBLIC, locale, 'index.md')
      const shortMdPath = path.join(PUBLIC, `${locale}.md`)
      fs.mkdirSync(path.dirname(rootMdPath), { recursive: true })
      fs.writeFileSync(rootMdPath, mdDocument)
      fs.writeFileSync(shortMdPath, mdDocument)
    } else {
      const targetMdPath = path.join(PUBLIC, locale, `${route.slice(1)}.md`)
      fs.mkdirSync(path.dirname(targetMdPath), { recursive: true })
      fs.writeFileSync(targetMdPath, mdDocument)
    }
  }
}

const routes = Object.fromEntries(
  [...byRoute.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([route, locales]) => [route, LOCALES.filter((l) => locales.includes(l))])
)

fs.mkdirSync(path.dirname(OUT_ROUTES), { recursive: true })
fs.writeFileSync(OUT_ROUTES, `${JSON.stringify(routes, null, 2)}\n`)
fs.writeFileSync(OUT_META, `${JSON.stringify(pageMeta, null, 2)}\n`)

/**
 * Build llms.txt (following https://llmstxt.org/ v2 specification)
 */
function buildLlmsTxt(locale = DEFAULT_LOCALE) {
  const seen = new Set()
  const sections = []

  for (const group of NAV_GROUPS) {
    const items = []
    for (const route of group.routes) {
      const rec = pageStore.get(`${locale}:${route}`) || pageStore.get(`${DEFAULT_LOCALE}:${route}`)
      if (!rec || seen.has(rec.route)) continue
      seen.add(rec.route)
      items.push(`- [${rec.title}](${rec.mdUrl}): ${rec.description}`)
    }
    if (items.length) {
      sections.push(`## ${group.title}\n\n${items.join('\n')}`)
    }
  }

  // Catch any routes not explicitly listed in NAV_GROUPS
  const extra = []
  for (const route of Object.keys(routes)) {
    if (seen.has(route)) continue
    const rec = pageStore.get(`${locale}:${route}`) || pageStore.get(`${DEFAULT_LOCALE}:${route}`)
    if (!rec) continue
    seen.add(route)
    extra.push(`- [${rec.title}](${rec.mdUrl}): ${rec.description}`)
  }
  if (extra.length) {
    sections.push(`## Additional Guides\n\n${extra.join('\n')}`)
  }

  const summary =
    locale === 'es'
      ? 'BuilderBot es un framework open-source en TypeScript y JavaScript para crear chatbots y agentes conversacionales en WhatsApp (Baileys, Meta Cloud API, Twilio, Venom, WPPConnect), Telegram y otros canales con bases de datos intercambiables (Memory, JSON, MongoDB, MySQL, PostgreSQL).'
      : locale === 'pt'
        ? 'BuilderBot é um framework open-source em TypeScript e JavaScript para criar chatbots e agentes conversacionais no WhatsApp (Baileys, Meta Cloud API, Twilio, Venom, WPPConnect), Telegram e outros canais com bancos de dados intercambiáveis (Memory, JSON, MongoDB, MySQL, PostgreSQL).'
        : 'BuilderBot is a free, open-source TypeScript and JavaScript framework for building automated chatbots and conversational agents across WhatsApp (Baileys, Meta Cloud API, Twilio, Venom, WPPConnect), Telegram, and other messaging channels with pluggable database adapters (Memory, JSON, MongoDB, MySQL, PostgreSQL).'

  return [
    '# BuilderBot',
    '',
    `> ${summary}`,
    '',
    'Key facts for coding agents and LLMs:',
    '',
    '- **Scaffold a new project:** `pnpm create builderbot@latest` or `npm create builderbot@latest` (requires Node.js >= 20 and Git).',
    '- **Core package:** `@builderbot/bot` — exports `createBot`, `createFlow`, `createProvider`, `addKeyword`, `addAnswer`, `EVENTS`, `MemoryDB`.',
    '- **Three core primitives:** **Flow** (conversation steps built with `addKeyword(...).addAnswer(...).addAction(...)`), **Provider** (channel adapter such as `@builderbot/provider-baileys`, `@builderbot/provider-meta`, `@builderbot/provider-twilio`), and **Database** (`@builderbot/database-memory`, `@builderbot/database-json`, `@builderbot/database-mongo`, `@builderbot/database-mysql`, `@builderbot/database-postgres`).',
    `- **Markdown endpoints:** Every documentation page has a clean Markdown counterpart at \`<url>.md\` (for example, \`${SITE_URL}/${locale}/quickstart.md\`).`,
    `- **Context bundles:** Curated core context at [${SITE_URL}/llms-ctx.txt](${SITE_URL}/llms-ctx.txt) and complete documentation corpus at [${SITE_URL}/llms-full.txt](${SITE_URL}/llms-full.txt).`,
    `- **Localized indexes:** [English (${SITE_URL}/en/llms.txt)](${SITE_URL}/en/llms.txt) · [Español (${SITE_URL}/es/llms.txt)](${SITE_URL}/es/llms.txt) · [Português (${SITE_URL}/pt/llms.txt)](${SITE_URL}/pt/llms.txt).`,
    '',
    sections.join('\n\n'),
    '',
  ].join('\n')
}

function buildLlmsFullTxt(locale = DEFAULT_LOCALE, onlyRoutes = null) {
  const orderedRoutes = onlyRoutes || [
    ...new Set([
      ...NAV_GROUPS.flatMap((g) => g.routes),
      ...Object.keys(routes),
    ]),
  ]

  const blocks = []
  for (const route of orderedRoutes) {
    const rec = pageStore.get(`${locale}:${route}`) || pageStore.get(`${DEFAULT_LOCALE}:${route}`)
    if (!rec) continue
    blocks.push(
      [
        `# ${rec.title}`,
        `Source: ${rec.htmlUrl}`,
        `Markdown: ${rec.mdUrl}`,
        `Description: ${rec.description}`,
        '',
        rec.markdown.replace(/^#\s+.+\n+/, ''),
      ].join('\n')
    )
  }

  return [
    '# BuilderBot Documentation Corpus',
    '',
    `> Index: ${SITE_URL}/llms.txt · Locale: ${locale} · Pages: ${blocks.length}`,
    '',
    blocks.join('\n\n---\n\n'),
    '',
  ].join('\n')
}

// Write root and .well-known llms files
const rootLlms = buildLlmsTxt('en')
fs.writeFileSync(path.join(PUBLIC, 'llms.txt'), rootLlms)
fs.mkdirSync(path.join(PUBLIC, '.well-known'), { recursive: true })
fs.writeFileSync(path.join(PUBLIC, '.well-known/llms.txt'), rootLlms)
fs.writeFileSync(path.join(PUBLIC, 'llms-ctx.txt'), buildLlmsFullTxt('en', CORE_CTX_ROUTES))
fs.writeFileSync(path.join(PUBLIC, 'llms-full.txt'), buildLlmsFullTxt('en'))

for (const locale of LOCALES) {
  fs.mkdirSync(path.join(PUBLIC, locale), { recursive: true })
  fs.writeFileSync(path.join(PUBLIC, locale, 'llms.txt'), buildLlmsTxt(locale))
  fs.writeFileSync(path.join(PUBLIC, locale, 'llms-full.txt'), buildLlmsFullTxt(locale))
}

const today = new Date().toISOString().slice(0, 10)
const urlFor = (locale, route) => `${SITE_URL}/${locale}${route === '/' ? '' : route}`
const priorityFor = (route) => (route === '/' ? '1.0' : route.split('/').length <= 2 ? '0.8' : '0.6')

const urls = []
for (const [route, locales] of Object.entries(routes)) {
  for (const locale of locales) {
    const alternates = locales
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l, route)}"/>`)
      .join('\n')
    const xDefault = locales.includes(DEFAULT_LOCALE)
      ? `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LOCALE, route)}"/>`
      : ''
    urls.push(
      [
        '  <url>',
        `    <loc>${urlFor(locale, route)}</loc>`,
        alternates,
        xDefault,
        `    <lastmod>${today}</lastmod>`,
        '    <changefreq>weekly</changefreq>',
        `    <priority>${priorityFor(route)}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    )
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`

const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'GoogleOther',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'CCBot',
  'Amazonbot',
  'YouBot',
  'DuckAssistBot',
  'cohere-ai',
]

const robots = `# BuilderBot documentation — Search & AI crawlers welcome
# LLM documentation index (https://llmstxt.org/): ${SITE_URL}/llms.txt
# LLM core context bundle: ${SITE_URL}/llms-ctx.txt
# LLM full corpus: ${SITE_URL}/llms-full.txt

User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /*?utm_

${AI_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /\n`).join('\n')}Sitemap: ${SITE_URL}/sitemap.xml
Host: ${SITE_URL}
`

fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(PUBLIC, 'robots.txt'), robots)

console.log(
  `[seo+llms] ${Object.keys(routes).length} routes · ${urls.length} URLs · ${pageStore.size} .md pages -> llms.txt, llms-ctx.txt, llms-full.txt, sitemap.xml, robots.txt`
)
