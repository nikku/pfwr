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

  nav.addEventListener('mouseenter', function(event) {
    nav.classList.add('hovered');
  });

  nav.addEventListener('mouseleave', function(event) {
    nav.classList.remove('hovered');
  });

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

  container.appendChild(nav);

  return nav;
}

// eslint-disable-next-line no-unused-vars
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
  const nav = addNavigationControls(container, goto);

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

    const slide = slides[slideIndex] || slides.find(s => s.dataset.name === slideIndex);

    const nextIndex = ((next, currentIndex, numberOfSlides) => {

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
        return numberOfSlides - 1;
      }

      if (next < 0) {
        return numberOfSlides + next;
      }

      return next;
    })(next, slides.indexOf(slide), slides.length);

    if (slideIndex === nextIndex) {
      return;
    }

    const nextSlide = slides[nextIndex] || slides.find(s => s.dataset.name === nextIndex);

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

  // slide navigation

  function showNav() {
    nav && nav.classList.toggle('shown', true);
  }

  function hideNav() {
    nav && !nav.matches('.hovered') && nav.classList.toggle('shown', false);
  }

  let hideTimer;

  container.addEventListener('mousemove', function() {

    showNav();

    clearTimeout(hideTimer);

    hideTimer = setTimeout(hideNav, 2000);
  });


  function handleKey(event) {

    const key = event.key;

    if (event.altKey || event.metaKey || event.ctrlKey) {
      return;
    }

    if (key === 'Home') {
      hideNav();
      goto('first');

      return false;
    }

    if (key === 'End') {
      hideNav();
      goto('last');

      return false;
    }

    if (key === 'ArrowRight' || key === 'Enter' || key === ' ') {
      hideNav();
      goto('next');

      return false;
    }

    if (key === 'ArrowLeft') {
      hideNav();
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