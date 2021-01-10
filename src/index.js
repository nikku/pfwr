import fs from 'fs';
import path from 'path';

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

const pfwrStyle = fs.readFileSync(path.join(__dirname, '../browser/style.css'), 'utf8');
const pfwrScript = fs.readFileSync(path.join(__dirname, '../browser/pfwr.js'), 'utf8');

const prismScript = fs.readFileSync(path.join(__dirname, '../browser/vendor/prism.js'), 'utf8');
const prismStyle = fs.readFileSync(path.join(__dirname, '../browser/vendor/prism.css'), 'utf8');

const indexScript = fs.readFileSync(path.join(__dirname, '../browser/index.js'), 'utf8');

function pfwr(vfile) {

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
      .process(vfile, function(err, file) {
        if (err) {
          return reject(err);
        }

        return resolve(file);
      });
  });

}

module.exports.pfwr = pfwr;