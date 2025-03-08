import { VFile } from 'vfile';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remark2rehype from 'remark-rehype';
import remarkExternalLinks from 'remark-external-links';
import remarkEmoji from 'remark-emoji';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import rehypeDocument from 'rehype-document';
import rehypeMeta from 'rehype-meta';
import rehypeWrap from 'rehype-wrap';

import { pageSplit } from './remark/page-split.js';
import { parseComments } from './remark/parse-comments.js';
import { autoTag } from './remark/auto-tag.js';

import pfwrStyle from '../browser/style.css';
import pfwrScript from '../browser/pfwr.js';

import prismScript from '../browser/vendor/prism.js';
import prismStyle from '../browser/vendor/prism.css';

import indexScript from '../browser/index.js';


export function pfwr(input) {

  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkFrontmatter, [ 'yaml' ])
    .use(parseComments)
    .use(pageSplit)

    // @ts-ignore
    .use(remarkExternalLinks)
    .use(remarkEmoji)
    .use(autoTag)
    .use(remark2rehype, {
      allowDangerousHtml: true
    })
    .use(rehypeWrap, {
      wrapper: '#slide-container.slide-container'
    })
    .use(rehypeDocument, {
      css: [
        'https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto+Slab:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap'
      ],
      style: [
        prismStyle,
        pfwrStyle
      ],
      js: [
        'https://unpkg.com/twemoji@latest/dist/twemoji.min.js'
      ],
      script: [
        pfwrScript,
        prismScript,
        indexScript
      ]
    })
    .use(rehypeMeta)
    .use(rehypeFormat)
    .use(rehypeStringify, {
      allowDangerousHtml: true
    })
    .process(new VFile(input));
}