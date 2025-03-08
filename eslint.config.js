import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  browser: [
    'browser/**/*.js'
  ],
  ignored: [
    'dist',
    'browser/vendor'
  ]
};

export default [

  {
    ignores: files.ignored
  },

  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      ignores: files.browser
    };
  }),

  ...bpmnIoPlugin.configs.browser.map(config => {

    return {
      ...config,
      files: files.browser
    };
  })
];
