import visit from 'unist-util-visit-parents';
import yaml from 'js-yaml';

export default function plugin() {
  return transform
}

function transform(tree, file) {

  const slides = [];
  const config = [];

  visit(
    tree,
    node => {
      if (node.type === 'slide') {
        slides.push(node);
      }

      if (node.type === 'yaml') {
        config.push(node);
      }
    }
  );

  for (const node of slides) {
    tagSlide(node)
  }

  for (const node of config) {
    tagFile(node, file);
  }

}

function tagFile(node, file) {

  const config = yaml.load(node.value);

  file.data.meta = Object.assign({
    type: 'presentation'
  }, config);
}

function tagSlide(node) {

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