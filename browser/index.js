function onLoaded(fn) {
  window.addEventListener('DOMContentLoaded', fn);
}

function onHashChange(fn) {
  window.addEventListener('hashchange', fn, false);
}

function setSlide(slide) {
  window.location.hash = '#' + (slide + 1);
}

function getSlide() {
  const hash = window.location.hash;

  const slideHash = hash && hash.substring(1);

  return (slideHash && parseInt(slideHash, 10) || 1) - 1;
}

onLoaded(() => {
  const container = document.querySelector('#slide-container');

  // proper emojis

  twemoji.parse(container, {
    folder: 'svg',
    ext: '.svg'
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