const visit = require('unist-util-visit-parents');

const commentMarker = require('mdast-comment-marker');

module.exports = plugin

function plugin () {
  return transform
}

function transform(tree) {

  visit(
    tree,
    node => node.type === 'html',
    commentConfigHtml
  );

  function commentConfigHtml(node) {
    var marker = commentMarker(node)

    if (marker && marker.name === 'meta') {
      node.meta = Object.assign(node.meta || {}, marker.parameters);
    }
  }

}