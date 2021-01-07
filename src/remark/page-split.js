const visit = require('unist-util-visit-parents')

module.exports = plugin

function plugin () {
  return transform
}

function transform(tree) {

  const splits = [];

  visit(
    tree,
    node => node.type === 'thematicBreak',
    node => splits.indexOf(node) === -1 ? splits.unshift(node) : null
  );

  const splitIndices = splits.map(s => tree.children.indexOf(s)).concat(0);

  let end = tree.children.length;

  for (const idx of splitIndices) {

    const between = tree.children.slice(idx + 1, end);

    const meta = between.find(el => el.meta);

    meta && console.log(Object.keys(meta || {}));

    const dataAttributes = Object.keys(meta || {}).reduce((attrs, key) => {
      attrs[`data-${key}`] = meta[key];

      return attrs;
    }, {});

    const group = {
      type: 'slide',
      children: between,
      data: {
        hName: 'section',
        hProperties: {
          className: 'slide',
          ...dataAttributes
        }
      },
      meta
    };


    tree.children.splice(idx, between.length + 1, group);

    end = idx;
  }
}