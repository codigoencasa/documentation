/**
 * LAYER: Interface
 * Contains: createCodeEditor — CodeMirror 6 editor themed like the docs code blocks
 * Rules: Browser only (loaded lazily from Playground). Colors come from the same
 *        `--shiki-*` variables the MDX code blocks use, so both always match.
 * GOAL: Edit flows with the exact look of the snippets in the documentation.
 */
import { EditorState, Prec } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { HighlightStyle, bracketMatching, indentOnInput, indentUnit, syntaxHighlighting, syntaxTree } from '@codemirror/language'
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'
import { tags as t } from '@lezer/highlight'

const token = (name) => `var(--shiki-token-${name})`

const docsHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.modifier, t.operatorKeyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword], color: token('keyword') },
  { tag: [t.string, t.special(t.string), t.regexp], color: token('string') },
  { tag: [t.comment, t.lineComment, t.blockComment], color: token('comment'), fontStyle: 'italic' },
  { tag: [t.number, t.bool, t.null, t.atom, t.self], color: token('constant') },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: token('function') },
  { tag: [t.propertyName, t.definition(t.propertyName)], color: token('constant') },
  { tag: [t.punctuation, t.bracket, t.separator, t.operator, t.derefOperator], color: token('punctuation') },
  { tag: [t.variableName, t.definition(t.variableName)], color: 'var(--shiki-color-text)' },
])

const docsTheme = EditorView.theme(
  {
    '&': { height: '100%', color: 'var(--shiki-color-text)', backgroundColor: 'transparent', fontSize: '13px' },
    '&.cm-focused': { outline: 'none' },
    '.cm-scroller': { fontFamily: 'inherit', lineHeight: '1.7', overflow: 'auto' },
    '.cm-content': { padding: '16px 0', caretColor: '#a5b4fc' },
    '.cm-line': { padding: '0 20px 0 0' },
    '.cm-gutters': { backgroundColor: '#0e0f11', border: 'none', color: '#7c7b74', paddingLeft: '20px' },
    '.cm-lineNumbers .cm-gutterElement': { minWidth: '3ch', padding: '0 20px 0 0', textAlign: 'right' },
    '.cm-activeLine': { backgroundColor: 'rgb(129 140 248 / 0.06)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#a5b4fc' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#a5b4fc', borderLeftWidth: '2px' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'rgb(129 140 248 / 0.28) !important',
    },
    '.cm-matchingBracket': { backgroundColor: 'rgb(255 255 255 / 0.08)', outline: '1px solid rgb(255 255 255 / 0.18)' },
    '.cm-tooltip': { backgroundColor: '#1a1b1f', border: '1px solid #2a2b30', borderRadius: '10px', overflow: 'hidden' },
    '.cm-tooltip-autocomplete > ul': { fontFamily: 'inherit', fontSize: '12.5px' },
    '.cm-tooltip-autocomplete > ul > li': { padding: '3px 10px !important' },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': { backgroundColor: 'rgb(129 140 248 / 0.2)', color: '#ecebe2' },
    '.cm-completionDetail': { color: '#7c7b74', fontStyle: 'normal', marginLeft: '10px' },
  },
  { dark: true }
)

const API = [
  ['addKeyword', 'flow'],
  ['addAnswer', 'method'],
  ['addAction', 'method'],
  ['createFlow', 'flow'],
  ['flowDynamic', 'method'],
  ['gotoFlow', 'method'],
  ['fallBack', 'method'],
  ['endFlow', 'method'],
  ['state', 'state'],
  ['globalState', 'state'],
  ['capture', 'option'],
  ['delay', 'option'],
  ['media', 'option'],
  ['buttons', 'option'],
  ['sensitive', 'option'],
  ['regex', 'option'],
  ['EVENTS', 'events'],
  ['WELCOME', 'EVENTS'],
  ['MEDIA', 'EVENTS'],
  ['VOICE_NOTE', 'EVENTS'],
  ['DOCUMENT', 'EVENTS'],
  ['LOCATION', 'EVENTS'],
  ['ACTION', 'EVENTS'],
].map(([label, detail]) => ({ label, detail, type: detail === 'method' || detail === 'flow' ? 'function' : 'variable' }))

const NO_COMPLETION = /Comment|String|Template/

function builderbotCompletions(context) {
  if (NO_COMPLETION.test(syntaxTree(context.state).resolveInner(context.pos, -1).name)) return null
  const word = context.matchBefore(/\w+/)
  if (!word || (word.from === word.to && !context.explicit)) return null
  return { from: word.from, options: API, validFor: /^\w*$/ }
}

export function createCodeEditor({ parent, doc, label, onChange, onRun }) {
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        drawSelection(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        indentUnit.of('  '),
        EditorState.tabSize.of(2),
        javascript(),
        syntaxHighlighting(docsHighlight),
        autocompletion({ override: [builderbotCompletions], icons: false }),
        docsTheme,
        Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => (onRun(), true) }])),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...completionKeymap, indentWithTab]),
        EditorView.contentAttributes.of({ 'aria-label': label, spellcheck: 'false', autocapitalize: 'off' }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChange(update.state.doc.toString())
        }),
      ],
    }),
  })

  return {
    setValue(next) {
      if (next === view.state.doc.toString()) return
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: next } })
    },
    destroy: () => view.destroy(),
  }
}
