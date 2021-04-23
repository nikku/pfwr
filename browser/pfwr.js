function addPage(index, slide) {

  if (!index) {
    return;
  }

  const el = document.createElement('div');
  el.classList.add('slide-number');
  el.textContent = index + 1;

  slide.appendChild(el);
}

function addNavigationControls(container, goto) {

  const html = `<nav class="slide-navigation shown">
    <a class="navigation-button" data-navigate="first" title="First slide" href>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fill-rule="evenodd" d="M12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 1.5a6 6 0 100-12 6 6 0 000 12z"></path></svg>
    </a>
    <a class="navigation-button" data-navigate="previous" title="Previous slide (Left Arrow)" href>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8.854 11.646l5.792-5.792a.5.5 0 01.854.353v11.586a.5.5 0 01-.854.353l-5.792-5.792a.5.5 0 010-.708z"></path></svg>
    </a>
    <a class="navigation-button" data-navigate="next" title="Next slide (Enter/Spacebar/Right Arrow)" href>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15.146 12.354l-5.792 5.792a.5.5 0 01-.854-.353V6.207a.5.5 0 01.854-.353l5.792 5.792a.5.5 0 010 .708z"></path></svg>
    </a>
    <a class="navigation-button" data-navigate="last" title="Last slide" href>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg>
    </a>
  </nav>`;

  const tmp = document.createElement('div');

  tmp.innerHTML = html;

  const nav = tmp.removeChild(tmp.lastChild);

  nav.addEventListener('click', function(event) {

    event.preventDefault();

    let target = event.target;

    while (!target.matches('[data-navigate]')) {
      target = target.parentNode;
    }

    if (!target) {
      return;
    }

    goto(target.dataset.navigate);
  });

  let hideTimer;

  function show() {
    if (!nav.matches('.shown')) {
      nav.classList.add('shown');
    }
  }

  function hide() {
    nav.classList.remove('shown');
  }

  container.addEventListener('mousemove', function() {

    show();

    clearTimeout(hideTimer);

    hideTimer = setTimeout(hide, 5000);
  });

  container.appendChild(nav);
}

function pfwr(options) {

  const {
    container
  } = options;

  // slide numbers
  const slides = Array.from(container.querySelectorAll('.slide'));

  for (const idx in slides) {
    addPage(+idx, slides[+idx]);
  }

  // mouse navigation controls
  addNavigationControls(container, goto);

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

  let slideIndex = -1;

  function goto(next) {

    const nextIndex = ((next, currentIndex, slides) => {

      if (next === 'next') {
        return currentIndex + 1;
      }

      if (next === 'previous') {
        return currentIndex - 1;
      }

      if (next === 'first') {
        return 0;
      }

      if (next === 'last') {
        return slides - 1;
      }

      if (next < 0) {
        return slides + next;
      }

      return next;
    })(next, slideIndex, slides.length);

    if (slideIndex === nextIndex) {
      return;
    }

    const slide = slides[slideIndex];

    const nextSlide = slides[nextIndex];

    if (!nextSlide) {
      return;
    }

    slide && slide.classList.remove('current');
    nextSlide.classList.add('current');

    slideIndex = nextIndex;

    emit('slideChanged', {
      slideIndex
    });
  }

  function handleKey(event) {

    const key = event.key;

    if (key === 'Home') {
      goto('first');

      return false;
    }

    if (key === 'End') {
      goto('last');

      return false;
    }

    if (key === 'ArrowRight' || key === 'Enter' || key === ' ') {
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