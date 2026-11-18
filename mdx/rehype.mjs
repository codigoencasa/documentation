import { mdxAnnotations } from 'mdx-annotations'
import { visit } from 'unist-util-visit'
import rehypeMdxTitle from 'rehype-mdx-title'
import shiki from 'shiki'
import { toString } from 'mdast-util-to-string'
import * as acorn from 'acorn'
import { slugifyWithCounter } from '@sindresorhus/slugify'

function rehypeParseCodeBlocks() {
  return (tree) => {
    visit(tree, 'element', (node, _nodeIndex, parentNode) => {
      if (node.tagName === 'code' && node.properties.className) {
        parentNode.properties.language = node.properties.className[0]?.replace(
          /^language-/,
          ''
        )
      }
    })
  }
}

let highlighter

// Lines to highlight from a code annotation, e.g. {{ title: 'app.ts', highlight: '3-5,8' }}
function parseHighlight(annotation) {
  let lines = new Set()
  let match = /highlight:\s*['"]([\d,\s-]+)['"]/.exec(annotation ?? '')
  if (!match) return lines
  for (let part of match[1].split(',')) {
    let [a, b] = part.trim().split('-').map(Number)
    for (let n = a; n <= (b || a); n++) lines.add(n)
  }
  return lines
}

// Exposes the page's source file so the layout can link to "Edit this page"
function rehypeSourcePath() {
  return (tree, file) => {
    let path = (file.history?.[0] ?? file.path ?? '').replace(/\\/g, '/')
    let idx = path.indexOf('src/pages/')
    if (idx === -1) return
    let value = JSON.stringify(path.slice(idx))
    let exportStr = `export const sourcePath = ${value}`
    tree.children.push({
      type: 'mdxjsEsm',
      value: exportStr,
      data: { estree: acorn.parse(exportStr, { sourceType: 'module', ecmaVersion: 'latest' }) },
    })
  }
}

function rehypeShiki() {
  return async (tree) => {
    highlighter =
      highlighter ?? (await shiki.getHighlighter({ theme: 'css-variables' }))

    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
        let codeNode = node.children[0]
        let textNode = codeNode.children[0]
        textNode.value = textNode.value.replace(/\n+$/, '')

        node.properties.code = textNode.value

        if (node.properties.language) {
          let tokens = highlighter.codeToThemedTokens(
            textNode.value,
            node.properties.language
          )

          let highlighted = parseHighlight(node.properties.annotation)
          let lineNo = 0
          textNode.value = shiki.renderToHtml(tokens, {
            elements: {
              pre: ({ children }) => children,
              code: ({ children }) => children,
              line: ({ children }) => {
                lineNo++
                return `<span class="line${highlighted.has(lineNo) ? ' hl' : ''}">${children}</span>`
              },
            },
          })
        }
      }
    })
  }
}

function rehypeSlugify() {
  return (tree) => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2' && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

function rehypeAddMDXExports(getExports) {
  return (tree) => {
    let exports = Object.entries(getExports(tree))

    for (let [name, value] of exports) {
      for (let node of tree.children) {
        if (
          node.type === 'mdxjsEsm' &&
          new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
        ) {
          return
        }
      }

      let exportStr = `export const ${name} = ${value}`

      tree.children.push({
        type: 'mdxjsEsm',
        value: exportStr,
        data: {
          estree: acorn.parse(exportStr, {
            sourceType: 'module',
            ecmaVersion: 'latest',
          }),
        },
      })
    }
  }
}

function getSections(node) {
  let sections = []

  for (let child of node.children ?? []) {
    if (child.type === 'element' && child.tagName === 'h2') {
      sections.push(`{
        title: ${JSON.stringify(toString(child))},
        id: ${JSON.stringify(child.properties.id)},
        ...${child.properties.annotation}
      }`)
    } else if (child.children) {
      sections.push(...getSections(child))
    }
  }

  return sections
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
  rehypeMdxTitle,
  rehypeSourcePath,
  [
    rehypeAddMDXExports,
    (tree) => ({
      sections: `[${getSections(tree).join()}]`,
    }),
  ],
]
