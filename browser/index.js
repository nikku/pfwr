function setSlide(slide) {
  window.location.hash = '#' + (slide + 1);
}

function getSlide() {
  const hash = window.location.hash;

  const slideHash = hash && hash.substring(1);

  return (slideHash && parseInt(slideHash, 10) || 1) - 1;
}

const presentation = pfwr({
  container: document.querySelector('#slide-container')
});

presentation.goto(getSlide());

presentation.on('slideChanged', function(event) {
  setSlide(event.slideIndex);
});