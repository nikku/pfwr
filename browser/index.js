/* global twemoji, pfwr */

function onLoaded(fn) {
  window.addEventListener('DOMContentLoaded', fn);
}

function onHashChange(fn) {
  window.addEventListener('hashchange', fn, false);
}

function setState(state) {
  const page = typeof state.slide === 'number' ? state.slide + 1 : state.slide;

  window.location.hash = '#' + page + (state.overview ? '/overview' : '');
}

function getState() {
  const [ page, ...modifiers ] = window.location.hash.substring(1).split('/');

  return {
    slide: parsePage(page),
    overview: modifiers.includes('overview')
  };
}

function parsePage(page) {

  if (!page) {
    return 0;
  }

  const slideNumber = parseInt(page, 10);

  if (slideNumber > 0) {
    return slideNumber - 1;
  }

  return page;
}

onLoaded(() => {
  const container = document.querySelector('#slide-container');

  // proper emojis

  typeof twemoji !== 'undefined' && twemoji.parse(container, {
    folder: 'svg',
    ext: '.svg',
    base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
  });

  // bootstrap presentation

  const presentation = pfwr({
    container
  });

  function applyState() {
    const { slide, overview } = getState();

    presentation.goto(slide);
    presentation.toggleOverview(overview);
  }

  applyState();

  onHashChange(applyState);

  presentation.on('change', setState);

});