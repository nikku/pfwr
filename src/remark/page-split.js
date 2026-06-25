import { visitParents } from 'unist-util-visit-parents';

export function pageSplit() {
  return transform;
}

function transform(tree) {

  const splits = [];

  visitParents(
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
      children: [
        {
          type: 'slideContent',
          children: between,
          data: {
            hName: 'div',
            hProperties: {
              className: [ 'slide-content' ]
            }
          }
        }
      ],
      data: {
        hName: 'section',
        hProperties: {
          className: [ 'slide' ]
        }
      }
    };

    tree.children.splice(idx, between.length + (idx === 0 ? 0 : 1), group);

    end = idx;
  }

  // add slide numbers - first slide unnumbered (title slide convention)
  for (let i = 1; i < tree.children.length; i++) {
    tree.children[i].children.push({
      type: 'slideNumber',
      children: [ { type: 'text', value: String(i + 1) } ],
      data: {
        hName: 'div',
        hProperties: {
          className: [ 'slide-number' ]
        }
      }
    });
  }
}