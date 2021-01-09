import visit from 'unist-util-visit-parents';
import commentMarker from 'mdast-comment-marker';


export default function plugin() {
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

    if (marker && marker.name === 'config') {
      node.config = Object.assign(node.config || {}, marker.parameters);
    }
  }

}