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

    const between = tree.children.slice(idx === 0 ? 0 : idx + 1, end);

    const group = {
      type: 'slide',
      children: between,
      data: {
        hName: 'section',
        hProperties: {
          className: [ 'slide' ]
        }
      }
    };

    tree.children.splice(idx, between.length + 1, group);

    end = idx;
  }
}