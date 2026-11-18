import { mdxAnnotations } from 'mdx-annotations'
import { remarkMermaid } from 'remark-mermaid-nextra';
import remarkGfm from 'remark-gfm'
import { SKIP, visit } from 'unist-util-visit'

// Builderbot look for every mermaid diagram. Per-node colors are dropped; colors come
// from CSS tokens (.bb-mermaid in tailwind.css) so diagrams follow dark/light mode.
const MERMAID_INIT =
  '%%{init: {"theme":"base","flowchart":{"useMaxWidth":false,"curve":"basis","padding":18,"nodeSpacing":40,"rankSpacing":48},"themeVariables":{"fontFamily":"Cal Sans UI, system-ui, sans-serif","fontSize":"14px"}}}%%'

// Original diagram colors carry meaning (user / bot / highlighted step). They are mapped
// to the Builderbot palette; anything else falls back to the default node style in CSS.
const ROLE_CLASSES = {
  '#ffa69e': 'bbUser', // user → WhatsApp bubble
  '#1dd3b0': 'bbBot', // bot → indigo
  '#b2f7ef': 'bbAccent', // highlighted step → cyan
  '#fff2b2': 'bbBot', // events: BOT → indigo
}
const ROLE_DEFS = [
  'classDef bbUser fill:#c6f6c0,stroke:#a3e29a,color:#1d1d1b',
  'classDef bbBot fill:#c7d2fe,stroke:#a5b4fc,color:#1d1d1b',
  'classDef bbAccent fill:#cffafe,stroke:#a5f3fc,color:#1d1d1b',
  'classDef bbAccent2 fill:#fef3c7,stroke:#fcd34d,color:#1d1d1b',
]

// "style id fill:#ffa69e,..." → "class id bbUser"; other style/class lines are dropped
function rebrandStyleLine(line) {
  let m = /^(\s*)style\s+(\S+)\s+(.*)$/.exec(line)
  if (m) {
    let fill = (/fill:\s*#+([0-9a-fA-F]{3,6})/.exec(m[3]) || [])[1]
    let role = fill && ROLE_CLASSES['#' + fill.toLowerCase()]
    return role ? `${m[1]}class ${m[2]} ${role}` : null
  }
  if (/^\s*(classDef|class|linkStyle)\s/.test(line)) return null
  return line
}

// Same roles everywhere: nodes labelled User/user are WhatsApp green, Bot/BOT are indigo
function autoRoles(body) {
  let lines = []
  let seen = new Set()
  let re = /([A-Za-z_][\w-]*)\s*(?:\(\(\(|\(\(|\(\[|\[\[|\[\(|\(|\[|\{)\s*"?\s*(User(?: \w+)?|user|Bot|BOT)\s*"?\s*(?:\)\)\)|\)\)|\]\)|\]\]|\)\]|\)|\]|\})/g
  let m
  while ((m = re.exec(body))) {
    let [, id, label] = m
    if (seen.has(id) || /^(subgraph|flowchart|graph|style|class)$/.test(id)) continue
    seen.add(id)
    lines.push(`class ${id} ${/^bot$/i.test(label) ? 'bbBot' : 'bbUser'}`)
  }
  return lines
}

// Modern look: every node becomes a pill ([label]); databases keep the cylinder shape
function pillShapes(body) {
  return body
    .replace(/(\b[A-Za-z_][\w-]*)\(\(\((.+?)\)\)\)/g, '$1([$2])')
    .replace(/(\b[A-Za-z_][\w-]*)\(\((.+?)\)\)/g, '$1([$2])')
    .replace(/(\b[A-Za-z_][\w-]*)\{([^{}]+?)\}/g, '$1([$2])')
    .replace(/(\b[A-Za-z_][\w-]*)\(([^\[\(][^()]*?)\)/g, '$1([$2])')
    .replace(/(\b[A-Za-z_][\w-]*)\[\[(.+?)\]\]/g, '$1([$2])')
    .split('\n')
    .map((line) =>
      /^\s*subgraph\b/.test(line)
        ? line
        : line.replace(/(\b[A-Za-z_][\w-]*)\[([^\[\(\]][^\]]*?)\]/g, '$1([$2])')
    )
    .join('\n')
}

function remarkMermaidTheme() {
  return (tree) => {
    visit(tree, { type: 'code', lang: 'mermaid' }, (node, index, parent) => {
      let body = node.value
        .split('\n')
        .filter((line) => !/^\s*%%\{init/.test(line))
        .map(rebrandStyleLine)
        .filter((line) => line !== null)
        .join('\n')
      body = pillShapes(body)
      // keep an optional front-matter block (--- ... ---) at the top
      let front = ''
      let m = /^(\s*---[\s\S]*?---\s*\n)/.exec(body)
      if (m) {
        front = m[1]
        body = body.slice(m[1].length)
      }
      node.value = `${front}${MERMAID_INIT}\n${body}\n${autoRoles(body).join('\n')}\n${ROLE_DEFS.join('\n')}`
      // wrap in a framed container provided through MDXProvider (MermaidFrame)
      parent.children[index] = {
        type: 'mdxJsxFlowElement',
        name: 'MermaidFrame',
        attributes: [],
        children: [node],
      }
      return [SKIP, index + 1]
    })
  }
}

export const remarkPlugins = [mdxAnnotations.remark, remarkGfm, remarkMermaidTheme, remarkMermaid]
