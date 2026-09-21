(() => {
  const ns = 'http://www.w3.org/2000/svg';
  const stems = document.getElementById('botanical-stems');
  const heads = document.getElementById('botanical-heads');
  if (!stems || !heads) return;

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

  flowers.forEach(({ x, y, r, angle }, index) => {
    element('path', {
      d: `M ${270 + index * 5} 570 Q ${x + 25} 423 ${x} ${y}`,
      fill: 'none', stroke: '#667653', 'stroke-width': 3.4, 'stroke-linecap': 'round',
    }, stems);
    const group = element('g', { transform: `translate(${x} ${y}) rotate(${angle})` }, heads);
    const bloom = element('g', { class: 'flower-head', style: `animation-delay:-${index}s` }, group);
    [0, 1].forEach(layer => {
      for (let i = 0; i < 15; i++) {
        const length = r * (layer ? 0.86 : 1.04);
        element('path', {
          d: `M -5 -10 C ${-r * 0.38} ${-r * 0.54} ${-r * 0.24} ${-length} 0 ${-length} C ${r * 0.22} ${-length * 0.93} ${r * 0.28} ${-r * 0.45} 5 -10 Z`,
          fill: 'url(#petal)', stroke: '#b28b32', 'stroke-width': '.55',
          transform: `rotate(${i * 24 + layer * 12})`, opacity: layer ? 1 : 0.86,
        }, bloom);
        element('path', {
          d: `M 0 -15 Q -3 ${-length * 0.58} 0 ${-length * 0.89}`,
          fill: 'none', stroke: '#9c752d', 'stroke-width': '.5', opacity: '.4',
          transform: `rotate(${i * 24 + layer * 12})`,
        }, bloom);
      }
    });
    element('circle', { r: r * 0.29, fill: 'url(#heart)' }, bloom);
    for (let i = 0; i < 90; i++) {
      const a = i * 2.399963;
      const distance = Math.sqrt(i / 90) * r * 0.255;
      element('circle', {
        cx: Math.cos(a) * distance, cy: Math.sin(a) * distance, r: 0.85,
        fill: i % 3 ? '#b49a55' : '#d3b86c', opacity: '.8',
      }, bloom);
    }
  });

  [
    [267, 509, -58, 87], [282, 483, 47, 90], [236, 448, -65, 83],
    [316, 426, 52, 78], [214, 381, -64, 64], [328, 367, 39, 59],
    [263, 404, -23, 68], [252, 308, -53, 61], [310, 270, 38, 63],
  ].forEach(([x, y, angle, size]) => {
    const leaf = element('g', { transform: `translate(${x} ${y}) rotate(${angle})` }, stems);
    element('path', {
      d: `M 0 0 C ${-size * 0.45} ${-size * 0.35} -12 ${-size * 0.85} 0 ${-size} C ${size * 0.36} ${-size * 0.65} ${size * 0.26} ${-size * 0.18} 0 0`,
      fill: 'url(#leaf)', opacity: '.92',
    }, leaf);
    element('path', {
      d: `M 0 0 Q 3 ${-size * 0.4} 0 ${-size * 0.9}`,
      fill: 'none', stroke: '#b2b994', 'stroke-width': '.8',
    }, leaf);
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
  const song = document.getElementById('song');
  if (!toggle || !song) return;

  // Segundo aproximado del coro / “mejor parte” de Yellow (ajusta si tu archivo empieza distinto).
  const BEST_PART_START = 52;

  function setPlaying(isPlaying) {
    toggle.setAttribute('aria-pressed', String(isPlaying));
    toggle.textContent = isPlaying ? 'pausar' : 'la mejor parte';
    document.body.classList.toggle('music-active', isPlaying);
  }

  async function playBestPart() {
    try {
      if (Number.isFinite(BEST_PART_START)) song.currentTime = BEST_PART_START;
      await song.play();
      setPlaying(true);
    } catch (_) {
      setPlaying(false);
    }
  }

  function pauseMusic() {
    song.pause();
    setPlaying(false);
  }

  toggle.addEventListener('click', () => {
    if (!song.paused) pauseMusic();
    else playBestPart();
  });

  song.addEventListener('ended', () => setPlaying(false));
  song.addEventListener('error', () => {
    setPlaying(false);
    toggle.title = 'Falta assets/la-mejor-parte.mp3 (archivo legal)';
  });

  // Intento automático; si el navegador bloquea, el primer toque lo inicia.
  playBestPart();
  const unlock = () => {
    if (song.paused) playBestPart();
  };
  document.addEventListener('pointerdown', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
})();
