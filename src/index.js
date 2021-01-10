import fs from 'fs';
import path from 'path';

import vfile from 'vfile';
import unified from 'unified';
import markdown from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import gfm from 'remark-gfm';
import breaks from 'remark-breaks';
import remark2rehype from 'remark-rehype';
import format from 'rehype-format';
import html from 'rehype-stringify';
import externalLinks from 'remark-external-links';
import emoji from 'remark-emoji';
import doc from 'rehype-document';
import meta from 'rehype-meta';
import wrap from 'rehype-wrap';

import pageSplit from './remark/page-split';
import parseComments from './remark/parse-comments';
import autoTag from './remark/auto-tag';

import pfwrStyle from '../browser/style.css';
import pfwrScript from '../browser/pfwr.js';

import prismScript from '../browser/vendor/prism.js';
import prismStyle from '../browser/vendor/prism.css';

import indexScript from '../browser/index.js';

function pfwr(input) {

  return new Promise((resolve, reject) => {
    unified()
      .use(markdown)
      .use(gfm)
      .use(breaks)
      .use(frontmatter, ['yaml'])
      .use(parseComments)
      .use(pageSplit)
      .use(externalLinks)
      .use(emoji)
      .use(autoTag)
      .use(remark2rehype, {
        allowDangerousHtml: true
      })
      .use(wrap, {
        wrapper: '#slide-container.slide-container'
      })
      .use(doc, {
        css: [
          'https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto+Slab:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap'
        ],
        style: [
          prismStyle,
          pfwrStyle
        ],
        js: [
          'https://twemoji.maxcdn.com/v/latest/twemoji.min.js'
        ],
        script: [
          pfwrScript,
          prismScript,
          indexScript
        ]
      })
      .use(meta)
      .use(format)
      .use(html, {
        allowDangerousHtml: true
      })
      .process(vfile(input), function(err, output) {
        if (err) {
          return reject(err);
        }

        return resolve(output);
      });
  });

}

module.exports.pfwr = pfwr;