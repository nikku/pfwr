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

  const configNode = node.children.find(el => el.config);

  const {
    align = isLanding ? 'center' : 'left',
    ...config
  } = configNode && configNode.config || {};

  const dataAttributes = config ? Object.entries(config).reduce((attrs, [ key, value ]) => {
    attrs[`data-${key}`] = value;

    return attrs;
  }, {}) : {};

  node.data.hProperties = Object.assign(node.data.hProperties, dataAttributes, {
    'data-align': align
  });

}