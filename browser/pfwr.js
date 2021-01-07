function addPage(index, slide) {

  if (!index) {
    return;
  }

  const el = document.createElement('div');
  el.classList.add('slide-number');
  el.textContent = index + 1;

  slide.appendChild(el);
}

function pfwr(options) {

  const {
    container
  } = options;

  const slides = Array.from(container.querySelectorAll('.slide'));

  for (const idx in slides) {
    addPage(+idx, slides[+idx]);
  }

  // event listeners ////////////////////////

  const listeners = [];

  function on(event, fn) {
    listeners.push([ event, fn ]);
  }

  function emit(event, data) {

    for (const [ eventType, fn ] of listeners) {
      if (event === eventType) {
        fn(data);
      }
    }
  }

  // slide life cycle ////////////////

  let slideIndex = 0;

  function goto(next) {

    const nextIndex = ((next, currentIndex, slides) => {

      if (next === 'next') {
        return currentIndex + 1;
      }

      if (next === 'previous') {
        return currentIndex - 1;
      }

      if (next < 0) {
        return slides + next;
      }

      return next;
    })(next, slideIndex, slides.length);

    const slide = slides[slideIndex];

    const nextSlide = slides[nextIndex];

    if (!nextSlide) {
      return;
    }

    slide.classList.remove('current');
    nextSlide.classList.add('current');

    slideIndex = nextIndex;

    emit('slideChanged', {
      slideIndex
    });
  }

  function handleKey(event) {

    const key = event.key;

    if (key === 'Home') {
      goto(0);

      return false;
    }

    if (key === 'End') {
      goto(-1);

      return false;
    }

    if (key === 'ArrowRight' || key === 'Enter') {
      goto('next');

      return false;
    }

    if (key === 'ArrowLeft') {
      goto('previous');

      return false;
    }
  }

  function destroy() {
    document.removeEventListener('keydown', handleKey);
  }

  document.addEventListener('keydown', handleKey);

  return {
    on,
    goto,
    destroy
  };
}