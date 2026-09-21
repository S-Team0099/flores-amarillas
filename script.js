(() => {
  const ns = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (parent) parent.appendChild(node);
    return node;
  }

  function ensureDefs(svg) {
    let defs = svg.querySelector('defs');
    if (defs) return defs;
    defs = el('defs', {}, svg);
    const petal = el('linearGradient', { id: `${svg.id}-petal`, x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
    el('stop', { 'stop-color': '#f5dd80' }, petal);
    el('stop', { offset: '.55', 'stop-color': '#dcb33e' }, petal);
    el('stop', { offset: '1', 'stop-color': '#b88726' }, petal);
    const leaf = el('linearGradient', { id: `${svg.id}-leaf` }, defs);
    el('stop', { 'stop-color': '#788568' }, leaf);
    el('stop', { offset: '1', 'stop-color': '#394b39' }, leaf);
    const heart = el('radialGradient', { id: `${svg.id}-heart` }, defs);
    el('stop', { 'stop-color': '#7b6540' }, heart);
    el('stop', { offset: '1', 'stop-color': '#443c29' }, heart);
    return defs;
  }

  function drawBloom(parent, { x, y, r, angle }, fillPetal, fillHeart, delay = 0) {
    const group = el('g', { transform: `translate(${x} ${y}) rotate(${angle})` }, parent);
    const bloom = el('g', { class: 'flower-head', style: `animation-delay:-${delay}s` }, group);
    [0, 1].forEach(layer => {
      for (let i = 0; i < 15; i++) {
        const length = r * (layer ? 0.86 : 1.04);
        el('path', {
          d: `M -5 -10 C ${-r * 0.38} ${-r * 0.54} ${-r * 0.24} ${-length} 0 ${-length} C ${r * 0.22} ${-length * 0.93} ${r * 0.28} ${-r * 0.45} 5 -10 Z`,
          fill: fillPetal, stroke: '#b28b32', 'stroke-width': '.55',
          transform: `rotate(${i * 24 + layer * 12})`, opacity: layer ? 1 : 0.86,
        }, bloom);
        el('path', {
          d: `M 0 -15 Q -3 ${-length * 0.58} 0 ${-length * 0.89}`,
          fill: 'none', stroke: '#9c752d', 'stroke-width': '.5', opacity: '.4',
          transform: `rotate(${i * 24 + layer * 12})`,
        }, bloom);
      }
    });
    el('circle', { r: r * 0.29, fill: fillHeart }, bloom);
    for (let i = 0; i < 90; i++) {
      const a = i * 2.399963;
      const distance = Math.sqrt(i / 90) * r * 0.255;
      el('circle', {
        cx: Math.cos(a) * distance, cy: Math.sin(a) * distance, r: 0.85,
        fill: i % 3 ? '#b49a55' : '#d3b86c', opacity: '.8',
      }, bloom);
    }
  }

  function drawLeaf(parent, x, y, angle, size, fillLeaf) {
    const leaf = el('g', { transform: `translate(${x} ${y}) rotate(${angle})` }, parent);
    el('path', {
      d: `M 0 0 C ${-size * 0.45} ${-size * 0.35} -12 ${-size * 0.85} 0 ${-size} C ${size * 0.36} ${-size * 0.65} ${size * 0.26} ${-size * 0.18} 0 0`,
      fill: fillLeaf, opacity: '.92',
    }, leaf);
    el('path', {
      d: `M 0 0 Q 3 ${-size * 0.4} 0 ${-size * 0.9}`,
      fill: 'none', stroke: '#b2b994', 'stroke-width': '.8',
    }, leaf);
  }

  // Ramo botánico (pantalla de flores)
  const stems = document.getElementById('botanical-stems');
  const heads = document.getElementById('botanical-heads');
  if (stems && heads) {
    const bouquet = [
      { x: 156, y: 287, r: 48, angle: -22 },
      { x: 377, y: 290, r: 55, angle: 18 },
      { x: 229, y: 192, r: 58, angle: -12 },
      { x: 325, y: 153, r: 44, angle: 16 },
      { x: 278, y: 335, r: 60, angle: 4 },
    ];
    bouquet.forEach((flower, index) => {
      el('path', {
        d: `M ${270 + index * 5} 570 Q ${flower.x + 25} 423 ${flower.x} ${flower.y}`,
        fill: 'none', stroke: '#667653', 'stroke-width': 3.4, 'stroke-linecap': 'round',
      }, stems);
      drawBloom(heads, flower, 'url(#petal)', 'url(#heart)', index);
    });
    [
      [267, 509, -58, 87], [282, 483, 47, 90], [236, 448, -65, 83],
      [316, 426, 52, 78], [214, 381, -64, 64], [328, 367, 39, 59],
      [263, 404, -23, 68], [252, 308, -53, 61], [310, 270, 38, 63],
    ].forEach(([x, y, angle, size]) => drawLeaf(stems, x, y, angle, size, 'url(#leaf)'));
  }

  // Una sola flor del mismo estilo (bienvenida, sello, etc.)
  function paintSolo(svgId, opts) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    ensureDefs(svg);
    const stemsG = el('g', {}, svg);
    const headsG = el('g', {}, svg);
    const petal = `url(#${svgId}-petal)`;
    const heart = `url(#${svgId}-heart)`;
    const leaf = `url(#${svgId}-leaf)`;
    const { cx, cy, r, stemTo, leaves } = opts;
    el('path', {
      d: `M ${cx} ${stemTo} Q ${cx + 4} ${(cy + stemTo) / 2} ${cx} ${cy + r * 0.2}`,
      fill: 'none', stroke: '#667653', 'stroke-width': opts.stemWidth || 4, 'stroke-linecap': 'round',
    }, stemsG);
    (leaves || []).forEach(([lx, ly, ang, size]) => drawLeaf(stemsG, lx, ly, ang, size, leaf));
    drawBloom(headsG, { x: cx, y: cy, r, angle: opts.angle || -4 }, petal, heart, 0);
  }

  paintSolo('welcome-bloom', {
    cx: 100, cy: 78, r: 52, stemTo: 228, stemWidth: 4.5, angle: -8,
    leaves: [[92, 150, -55, 42], [108, 170, 48, 38]],
  });
  paintSolo('seal-bloom', {
    cx: 60, cy: 58, r: 34, stemTo: 110, stemWidth: 3, angle: 0,
    leaves: [],
  });
  paintSolo('aside-bloom', {
    cx: 80, cy: 70, r: 42, stemTo: 190, stemWidth: 4, angle: -6,
    leaves: [[72, 130, -50, 36], [90, 145, 45, 32]],
  });
  paintSolo('sign-bloom', {
    cx: 40, cy: 40, r: 26, stemTo: 70, stemWidth: 2.5, angle: 4,
    leaves: [],
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
  const song = document.getElementById('song');
  if (!song) return;
  const BEST_PART_START = 52;

  async function playBestPart() {
    try {
      if (Number.isFinite(BEST_PART_START)) song.currentTime = BEST_PART_START;
      await song.play();
    } catch (_) { /* autoplay bloqueado hasta el primer toque */ }
  }

  playBestPart();
  const unlock = () => { if (song.paused) playBestPart(); };
  document.addEventListener('pointerdown', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
})();
