const visit = require('unist-util-visit-parents')

module.exports = plugin

function plugin () {
  return transform
}

function transform(tree) {

  visit(
    tree,
    node => node.type === 'slide',
    node => annotateGroup(node)
  );
}

function annotateGroup(node) {

  const imageOnly = node.children.every(
    el => el.type === 'paragraph' && el.children.every(
      child => child.type === 'image'
    )
  );

  // unwrap paragraphs in image only slides
  // allows proper styling of full size images
  if (imageOnly) {
    const images = node.children.map(child => child.children);

    node.children = [].concat(...images);
  }

  const isLanding = node.children.every(
    el => el.type !== 'heading' && el.type !== 'list'
  );

  if (isLanding) {
    node.data.hProperties.className.push('centered');
  }

}