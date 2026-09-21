(() => {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const envelope = document.getElementById('open-letter');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let openingTimer;
  function navigate() {
    clearTimeout(openingTimer);
    const id = location.hash.slice(1) || 'inicio';
    const active = screens.find(screen => screen.id === id) || screens[0];
    screens.forEach(screen => { screen.hidden = screen !== active; });
    envelope.classList.remove('is-open');
    envelope.disabled = false;
    document.querySelector('.envelope-hint').textContent = 'Toca el sello para abrir tu carta';
    document.querySelectorAll('.steps a').forEach(link => {
      const selected = link.hash === `#${active.id === 'carta' ? 'sobre' : active.id}`;
      if (selected) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    const heading = active.querySelector('[tabindex="-1"]') || active;
    heading.focus({ preventScroll: true });
  }
  envelope.addEventListener('click', () => {
    if (envelope.disabled) return;
    envelope.disabled = true;
    envelope.classList.add('is-open');
    document.querySelector('.envelope-hint').textContent = 'Abriendo tu carta…';
    openingTimer = setTimeout(() => { location.hash = 'carta'; }, reducedMotion.matches ? 0 : 1450);
  });
  window.addEventListener('hashchange', navigate);
  navigate();
})();

(() => {
  const toggle = document.getElementById('music-toggle');
  const panel = document.getElementById('music-panel');
  const container = document.getElementById('music-player');
  const LABEL_IDLE = 'la mejor parte';
  const LABEL_PLAYING = 'detener música';

  function createPlayer() {
    const player = document.createElement('iframe');
    player.title = 'Coldplay — Yellow (video oficial)';
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.src = 'https://www.youtube-nocookie.com/embed/yKNxeF4KMsY?autoplay=1&playsinline=1&rel=0';
    return player;
  }

  function startMusic() {
    if (!panel.hidden && container.firstChild) return;
    container.replaceChildren(createPlayer());
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = LABEL_PLAYING;
    document.body.classList.add('music-active');
  }

  function stopMusic() {
    container.replaceChildren();
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = LABEL_IDLE;
    document.body.classList.remove('music-active');
  }

  toggle.addEventListener('click', () => {
    if (!panel.hidden) stopMusic();
    else startMusic();
  });
  document.getElementById('stop-music').addEventListener('click', stopMusic);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) stopMusic();
  });

  // Intento de inicio automático; si el navegador bloquea el sonido, el primer toque lo reanuda.
  startMusic();
  const unlock = () => {
    if (panel.hidden) startMusic();
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  };
  document.addEventListener('pointerdown', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
})();
