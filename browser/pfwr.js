function addNavigationControls(container, dispatch) {

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
    <a class="navigation-button" data-navigate="overview" title="Toggle overview (O)" href>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="-4 -4 24 24"><path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z"></path><path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z"></path></svg>
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

    dispatch(target.dataset.navigate);
  });

  container.appendChild(nav);

  return nav;
}

// eslint-disable-next-line no-unused-vars
function pfwr(options) {

  const {
    container
  } = options;

  const slides = Array.from(container.querySelectorAll('.slide'));

  // mouse navigation controls
  const nav = addNavigationControls(container, dispatch);

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
  let overview = false;

  function emitState() {
    emit('change', { slide: slideIndex, overview });
  }

  function toggleOverview(value) {

    value = !!value;

    if (overview === value) {
      return;
    }

    overview = value;
    container.classList.toggle('overview', overview);

    if (overview) {
      const current = container.querySelector('.slide.current');

      current && current.scrollIntoView({ block: 'center' });
    }

    emitState();
  }

  function dispatch(action) {

    if (action === 'overview') {
      return toggleOverview(!overview);
    }

    goto(action);
  }

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

    slideIndex = nextSlide.dataset.name || nextIndex;

    emitState();
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

  // open a slide by clicking its tile in overview
  container.addEventListener('click', function(event) {

    if (!overview) {
      return;
    }

    const slide = event.target.closest('.slide');

    if (!slide) {
      return;
    }

    goto(slides.indexOf(slide));
    toggleOverview(false);
  });


  let initialTouch = null;

  function touchPosition(event) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }

  function handleTouchStart(event) {
    initialTouch = touchPosition(event);
  }

  function handleTouchMove(event) {

    if (!initialTouch) {
      return;
    }

    var currentTouch = touchPosition(event);

    var diff = {
      x: initialTouch.x - currentTouch.x,
      y: initialTouch.y - currentTouch.y
    };

    if (Math.abs(diff.x) > 30) {
      if (diff.x < 0) {
        goto('previous');
      } else {
        goto('next');
      }

      initialTouch = null;
    }
  }

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

    if (key === 'o' || key === 'O') {
      toggleOverview(!overview);

      return false;
    }
  }

  function destroy() {
    document.removeEventListener('keydown', handleKey);

    document.removeEventListener('touchstart', handleTouchStart, false);
    document.removeEventListener('touchmove', handleTouchMove, false);
  }

  document.addEventListener('keydown', handleKey);

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  return {
    on,
    goto,
    toggleOverview,
    destroy
  };
}