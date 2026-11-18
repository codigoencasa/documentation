module.exports = ({ theme }) => ({
  DEFAULT: {
    css: {
      '--tw-prose-body': 'rgb(var(--bb-ink2))',
      '--tw-prose-headings': 'rgb(var(--bb-head))',
      '--tw-prose-links': 'rgb(var(--bb-head))',
      '--tw-prose-links-hover': 'rgb(var(--bb-l2))',
      '--tw-prose-links-underline': 'rgb(var(--bb-l2) / 0.5)',
      '--tw-prose-bold': 'rgb(var(--bb-head))',
      '--tw-prose-counters': 'rgb(var(--bb-mute))',
      '--tw-prose-bullets': 'rgb(var(--bb-soft))',
      '--tw-prose-hr': 'rgb(var(--bb-line))',
      '--tw-prose-quotes': 'rgb(var(--bb-head))',
      '--tw-prose-quote-borders': 'rgb(var(--bb-l2))',
      '--tw-prose-captions': 'rgb(var(--bb-mute))',
      '--tw-prose-code': 'rgb(var(--bb-head))',
      '--tw-prose-code-bg': 'rgb(var(--bb-chip))',
      '--tw-prose-code-ring': 'rgb(var(--bb-line))',
      '--tw-prose-th-borders': 'rgb(var(--bb-line2))',
      '--tw-prose-td-borders': 'rgb(var(--bb-line))',

      '--tw-prose-invert-body': 'rgb(var(--bb-ink2))',
      '--tw-prose-invert-headings': 'rgb(var(--bb-head))',
      '--tw-prose-invert-links': 'rgb(var(--bb-head))',
      '--tw-prose-invert-links-hover': 'rgb(var(--bb-l2))',
      '--tw-prose-invert-links-underline': 'rgb(var(--bb-l2) / 0.5)',
      '--tw-prose-invert-bold': 'rgb(var(--bb-head))',
      '--tw-prose-invert-counters': 'rgb(var(--bb-mute))',
      '--tw-prose-invert-bullets': 'rgb(var(--bb-soft))',
      '--tw-prose-invert-hr': 'rgb(var(--bb-line))',
      '--tw-prose-invert-quotes': 'rgb(var(--bb-head))',
      '--tw-prose-invert-quote-borders': 'rgb(var(--bb-l2))',
      '--tw-prose-invert-captions': 'rgb(var(--bb-mute))',
      '--tw-prose-invert-code': 'rgb(var(--bb-head))',
      '--tw-prose-invert-code-bg': 'rgb(var(--bb-chip))',
      '--tw-prose-invert-code-ring': 'rgb(var(--bb-line))',
      '--tw-prose-invert-th-borders': 'rgb(var(--bb-line2))',
      '--tw-prose-invert-td-borders': 'rgb(var(--bb-line))',

      // Base
      color: 'var(--tw-prose-body)',
      fontSize: '0.9375rem',
      fontWeight: '300',
      lineHeight: '1.7',

      // Layout
      '> *': {
        maxWidth: theme('maxWidth.2xl'),
        marginLeft: 'auto',
        marginRight: 'auto',
        '@screen lg': {
          maxWidth: theme('maxWidth.3xl'),
          marginLeft: `calc(50% - min(50%, ${theme('maxWidth.lg')}))`,
          marginRight: `calc(50% - min(50%, ${theme('maxWidth.lg')}))`,
        },
      },

      // Text
      p: {
        marginTop: theme('spacing.6'),
        marginBottom: theme('spacing.6'),
      },
      '[class~="lead"]': {
        fontSize: theme('fontSize.base')[0],
        ...theme('fontSize.base')[1],
      },

      // Lists
      ol: {
        listStyleType: 'decimal',
        marginTop: theme('spacing.5'),
        marginBottom: theme('spacing.5'),
        paddingLeft: '1.625rem',
      },
      'ol[type="A"]': {
        listStyleType: 'upper-alpha',
      },
      'ol[type="a"]': {
        listStyleType: 'lower-alpha',
      },
      'ol[type="A" s]': {
        listStyleType: 'upper-alpha',
      },
      'ol[type="a" s]': {
        listStyleType: 'lower-alpha',
      },
      'ol[type="I"]': {
        listStyleType: 'upper-roman',
      },
      'ol[type="i"]': {
        listStyleType: 'lower-roman',
      },
      'ol[type="I" s]': {
        listStyleType: 'upper-roman',
      },
      'ol[type="i" s]': {
        listStyleType: 'lower-roman',
      },
      'ol[type="1"]': {
        listStyleType: 'decimal',
      },
      ul: {
        listStyleType: 'disc',
        marginTop: theme('spacing.5'),
        marginBottom: theme('spacing.5'),
        paddingLeft: '1.625rem',
      },
      li: {
        marginTop: theme('spacing.2'),
        marginBottom: theme('spacing.2'),
      },
      ':is(ol, ul) > li': {
        paddingLeft: theme('spacing[1.5]'),
      },
      'ol > li::marker': {
        fontWeight: '400',
        color: 'var(--tw-prose-counters)',
      },
      'ul > li::marker': {
        color: 'var(--tw-prose-bullets)',
      },
      '> ul > li p': {
        marginTop: theme('spacing.3'),
        marginBottom: theme('spacing.3'),
      },
      '> ul > li > *:first-child': {
        marginTop: theme('spacing.5'),
      },
      '> ul > li > *:last-child': {
        marginBottom: theme('spacing.5'),
      },
      '> ol > li > *:first-child': {
        marginTop: theme('spacing.5'),
      },
      '> ol > li > *:last-child': {
        marginBottom: theme('spacing.5'),
      },
      'ul ul, ul ol, ol ul, ol ol': {
        marginTop: theme('spacing.3'),
        marginBottom: theme('spacing.3'),
      },

      // Horizontal rules
      hr: {
        // sections are separated by heading spacing in the Builderbot design
        display: 'none',
        borderColor: 'var(--tw-prose-hr)',
        borderTopWidth: 1,
        marginTop: theme('spacing.16'),
        marginBottom: theme('spacing.16'),
        maxWidth: 'none',
        marginLeft: `calc(-1 * ${theme('spacing.4')})`,
        marginRight: `calc(-1 * ${theme('spacing.4')})`,
        '@screen sm': {
          marginLeft: `calc(-1 * ${theme('spacing.6')})`,
          marginRight: `calc(-1 * ${theme('spacing.6')})`,
        },
        '@screen lg': {
          marginLeft: `calc(-1 * ${theme('spacing.8')})`,
          marginRight: `calc(-1 * ${theme('spacing.8')})`,
        },
      },

      // Quotes
      blockquote: {
        fontWeight: '500',
        fontStyle: 'italic',
        color: 'var(--tw-prose-quotes)',
        borderLeftWidth: '0.25rem',
        borderLeftColor: 'var(--tw-prose-quote-borders)',
        quotes: '"\\201C""\\201D""\\2018""\\2019"',
        marginTop: theme('spacing.8'),
        marginBottom: theme('spacing.8'),
        paddingLeft: theme('spacing.5'),
      },
      'blockquote p:first-of-type::before': {
        content: 'open-quote',
      },
      'blockquote p:last-of-type::after': {
        content: 'close-quote',
      },

      // Headings
      h1: {
        color: 'var(--tw-prose-headings)',
        fontWeight: '300',
        fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        marginBottom: theme('spacing.4'),
      },
      h2: {
        color: 'var(--tw-prose-headings)',
        fontWeight: '300',
        fontSize: 'clamp(1.5rem, 2.2vw, 1.875rem)',
        lineHeight: '1.15',
        letterSpacing: '-0.01em',
        marginTop: theme('spacing.16'),
        marginBottom: theme('spacing.3'),
      },
      h3: {
        color: 'var(--tw-prose-headings)',
        fontSize: '1.125rem',
        lineHeight: '1.3',
        fontWeight: '400',
        marginTop: theme('spacing.10'),
        marginBottom: theme('spacing.2'),
      },

      // Media
      'img, video, figure': {
        marginTop: theme('spacing.8'),
        marginBottom: theme('spacing.8'),
      },
      'figure > *': {
        marginTop: '0',
        marginBottom: '0',
      },
      figcaption: {
        color: 'var(--tw-prose-captions)',
        fontSize: theme('fontSize.xs')[0],
        ...theme('fontSize.xs')[1],
        marginTop: theme('spacing.2'),
      },

      // Tables
      table: {
        width: '100%',
        tableLayout: 'auto',
        textAlign: 'left',
        marginTop: theme('spacing.8'),
        marginBottom: theme('spacing.8'),
        lineHeight: theme('lineHeight.6'),
      },
      thead: {
        borderBottomWidth: '1px',
        borderBottomColor: 'var(--tw-prose-th-borders)',
      },
      'thead th': {
        color: 'var(--tw-prose-headings)',
        fontWeight: '600',
        verticalAlign: 'bottom',
        paddingRight: theme('spacing.2'),
        paddingBottom: theme('spacing.2'),
        paddingLeft: theme('spacing.2'),
      },
      'thead th:first-child': {
        paddingLeft: '0',
      },
      'thead th:last-child': {
        paddingRight: '0',
      },
      'tbody tr': {
        borderBottomWidth: '1px',
        borderBottomColor: 'var(--tw-prose-td-borders)',
      },
      'tbody tr:last-child': {
        borderBottomWidth: '0',
      },
      'tbody td': {
        verticalAlign: 'baseline',
      },
      tfoot: {
        borderTopWidth: '1px',
        borderTopColor: 'var(--tw-prose-th-borders)',
      },
      'tfoot td': {
        verticalAlign: 'top',
      },
      ':is(tbody, tfoot) td': {
        paddingTop: theme('spacing.2'),
        paddingRight: theme('spacing.2'),
        paddingBottom: theme('spacing.2'),
        paddingLeft: theme('spacing.2'),
      },
      ':is(tbody, tfoot) td:first-child': {
        paddingLeft: '0',
      },
      ':is(tbody, tfoot) td:last-child': {
        paddingRight: '0',
      },

      // Inline elements
      a: {
        color: 'var(--tw-prose-links)',
        textDecoration: 'underline',
        textDecorationColor: 'rgb(var(--bb-line2))',
        textUnderlineOffset: '4px',
        fontWeight: '500',
        transitionProperty: 'color, text-decoration-color',
        transitionDuration: theme('transitionDuration.DEFAULT'),
        transitionTimingFunction: theme('transitionTimingFunction.DEFAULT'),
        '&:hover': {
          color: 'var(--tw-prose-links-hover)',
          textDecorationColor: 'var(--tw-prose-links-underline)',
        },
      },
      ':is(h1, h2, h3) a': {
        fontWeight: 'inherit',
      },
      strong: {
        color: 'var(--tw-prose-bold)',
        fontWeight: '500',
      },
      ':is(a, blockquote, thead th) strong': {
        color: 'inherit',
      },
      code: {
        color: 'var(--tw-prose-code)',
        borderRadius: theme('borderRadius.lg'),
        paddingTop: theme('padding.1'),
        paddingRight: theme('padding[1.5]'),
        paddingBottom: theme('padding.1'),
        paddingLeft: theme('padding[1.5]'),
        boxShadow: 'inset 0 0 0 1px var(--tw-prose-code-ring)',
        backgroundColor: 'var(--tw-prose-code-bg)',
        fontFamily: theme('fontFamily.mono').join(', '),
        fontWeight: '500',
        fontSize: '0.8125em',
      },
      ':is(a, h1, h2, h3, blockquote, thead th) code': {
        color: 'inherit',
      },
      'h2 code': {
        fontSize: '0.8em',
        fontWeight: 'inherit',
      },
      'h3 code': {
        fontSize: theme('fontSize.sm')[0],
        fontWeight: 'inherit',
      },

      // Overrides
      ':is(h1, h2, h3) + *': {
        marginTop: '0',
      },
      '> :first-child': {
        marginTop: '0 !important',
      },
      '> :last-child': {
        marginBottom: '0 !important',
      },
    },
  },
  invert: {
    css: {
      '--tw-prose-body': 'var(--tw-prose-invert-body)',
      '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
      '--tw-prose-links': 'var(--tw-prose-invert-links)',
      '--tw-prose-links-hover': 'var(--tw-prose-invert-links-hover)',
      '--tw-prose-links-underline': 'var(--tw-prose-invert-links-underline)',
      '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
      '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
      '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
      '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
      '--tw-prose-quotes': 'var(--tw-prose-invert-quotes)',
      '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
      '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
      '--tw-prose-code': 'var(--tw-prose-invert-code)',
      '--tw-prose-code-bg': 'var(--tw-prose-invert-code-bg)',
      '--tw-prose-code-ring': 'var(--tw-prose-invert-code-ring)',
      '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
      '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
    },
  },
})
