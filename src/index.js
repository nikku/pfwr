var fs = require('fs');
var path = require('path');

var unified = require('unified');
var markdown = require('remark-parse');
var footnotes = require('remark-footnotes');
var frontmatter = require('remark-frontmatter');
var gfm = require('remark-gfm');
var remark2rehype = require('remark-rehype');
var format = require('rehype-format');
var html = require('rehype-stringify');
var externalLinks = require('remark-external-links');
var unwrapImages = require('remark-unwrap-images');
var emoji = require('remark-emoji');
var twemoji = require('remark-twemoji');
var doc = require('rehype-document');
var wrap = require('rehype-wrap');

var pageSplit = require('./remark/page-split');
var parseComments = require('./remark/parse-comments');
var autoTag = require('./remark/auto-tag');

var pfwrStyle = fs.readFileSync(path.join(__dirname, '../browser/style.css'), 'utf8');
var pfwrScript = fs.readFileSync(path.join(__dirname, '../browser/pfwr.js'), 'utf8');

var prismScript = fs.readFileSync(path.join(__dirname, '../browser/vendor/prism.js'), 'utf8');
var prismStyle = fs.readFileSync(path.join(__dirname, '../browser/vendor/prism.css'), 'utf8');

var indexScript = fs.readFileSync(path.join(__dirname, '../browser/index.js'), 'utf8');

function pfwr(vfile) {

  return new Promise((resolve, reject) => {
    unified()
      .use(markdown)
      .use(gfm)
      .use(unwrapImages)
      .use(frontmatter, ['yaml'])
      .use(parseComments)
      .use(footnotes, { inlineNotes: true })
      .use(pageSplit)
      .use(externalLinks)
      .use(emoji)
      .use(twemoji, {
        folder: 'svg',
        ext: '.svg'
      })
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
        script: [
          pfwrScript,
          prismScript,
          indexScript
        ]
      })
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