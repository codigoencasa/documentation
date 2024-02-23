import { mdxAnnotations } from 'mdx-annotations'
import { remarkMermaid } from 'remark-mermaid-nextra';
import remarkGfm from 'remark-gfm'

export const remarkPlugins = [mdxAnnotations.remark, remarkGfm, remarkMermaid]
