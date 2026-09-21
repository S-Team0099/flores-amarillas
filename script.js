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
