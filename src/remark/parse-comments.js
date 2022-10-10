import { visitParents } from 'unist-util-visit-parents';
import { commentMarker } from 'mdast-comment-marker';


export function parseComments() {
  return transform;
}

function transform(tree) {

  visitParents(
    tree,
    node => node.type === 'html',
    commentConfigHtml
  );

  function commentConfigHtml(node) {
    var marker = commentMarker(node)

    if (marker && marker.name === 'config') {
      node.config = Object.assign(node.config || {}, marker.parameters);
    }
  }

}