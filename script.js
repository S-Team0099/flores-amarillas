(() => {
  const ns = 'http://www.w3.org/2000/svg';
  const stems = document.getElementById('botanical-stems');
  const heads = document.getElementById('botanical-heads');
  function element(tag, attrs, parent) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    parent.appendChild(node);
    return node;
  }
  const flowers = [
    { x: 156, y: 287, r: 48, angle: -22 },
    { x: 377, y: 290, r: 55, angle: 18 },
    { x: 229, y: 192, r: 58, angle: -12 },
    { x: 325, y: 153, r: 44, angle: 16 },
    { x: 278, y: 335, r: 60, angle: 4 },
  ];
  // Each bloom uses layered, tapered petals and a deterministic seed pattern.
  flowers.forEach(({ x, y, r, angle }, index) => {
    element('path', { d: `M ${270 + index * 5} 570 Q ${x + 25} 423 ${x} ${y}`, fill: 'none', stroke: '#667653', 'stroke-width': 3.4, 'stroke-linecap': 'round' }, stems);
    const group = element('g', { transform: `translate(${x} ${y}) rotate(${angle})` }, heads);
    const bloom = element('g', { class: 'flower-head', style: `animation-delay:-${index}s` }, group);
    [0, 1].forEach(layer => {
      for (let i = 0; i < 15; i++) {
        const length = r * (layer ? .86 : 1.04);
        element('path', { d: `M -5 -10 C ${-r * .38} ${-r * .54} ${-r * .24} ${-length} 0 ${-length} C ${r * .22} ${-length * .93} ${r * .28} ${-r * .45} 5 -10 Z`, fill: 'url(#petal)', stroke: '#b28b32', 'stroke-width': '.55', transform: `rotate(${i * 24 + layer * 12})`, opacity: layer ? 1 : .86 }, bloom);
        element('path', { d: `M 0 -15 Q -3 ${-length * .58} 0 ${-length * .89}`, fill: 'none', stroke: '#9c752d', 'stroke-width': '.5', opacity: '.4', transform: `rotate(${i * 24 + layer * 12})` }, bloom);
      }
    });
    element('circle', { r: r * .29, fill: 'url(#heart)' }, bloom);
    for (let i = 0; i < 90; i++) {
      const a = i * 2.399963, distance = Math.sqrt(i / 90) * r * .255;
      element('circle', { cx: Math.cos(a) * distance, cy: Math.sin(a) * distance, r: .85, fill: i % 3 ? '#b49a55' : '#d3b86c', opacity: '.8' }, bloom);
    }
  });
  [
    [267, 509, -58, 87], [282, 483, 47, 90], [236, 448, -65, 83],
    [316, 426, 52, 78], [214, 381, -64, 64], [328, 367, 39, 59],
    [263, 404, -23, 68], [252, 308, -53, 61], [310, 270, 38, 63],
  ].forEach(([x, y, angle, size]) => {
    const leaf = element('g', { transform: `translate(${x} ${y}) rotate(${angle})` }, stems);
    element('path', { d: `M 0 0 C ${-size * .45} ${-size * .35} -12 ${-size * .85} 0 ${-size} C ${size * .36} ${-size * .65} ${size * .26} ${-size * .18} 0 0`, fill: 'url(#leaf)', opacity: '.92' }, leaf);
    element('path', { d: `M 0 0 Q 3 ${-size * .4} 0 ${-size * .9}`, fill: 'none', stroke: '#b2b994', 'stroke-width': '.8' }, leaf);
  });
})();

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
