/* global twemoji, pfwr */

function onLoaded(fn) {
  window.addEventListener('DOMContentLoaded', fn);
}

function onHashChange(fn) {
  window.addEventListener('hashchange', fn, false);
}

function setSlide(slide) {
  window.location.hash = '#' + (typeof slide === 'number' ? slide + 1 : slide);
}

function getSlide() {
  const hash = window.location.hash;

  const slideHash = hash && hash.substring(1);

  if (!slideHash) {
    return 0;
  }

  const slideNumber = parseInt(slideHash, 10);

  if (slideNumber > 0) {
    return slideNumber - 1;
  }

  return slideHash;
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

  presentation.goto(getSlide());

  onHashChange(() => {
    presentation.goto(getSlide());
  });

  presentation.on('slideChanged', function(event) {
    setSlide(event.slideIndex);
  });

});