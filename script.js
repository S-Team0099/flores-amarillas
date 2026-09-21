(function createPetals() {
  const layer = document.getElementById("petals");
  if (!layer) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const count = window.innerWidth < 700 ? 12 : 22;

  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${8 + Math.random() * 10}s`;
    petal.style.animationDelay = `${Math.random() * 8}s`;
    petal.style.width = `${10 + Math.random() * 10}px`;
    petal.style.height = `${12 + Math.random() * 12}px`;
    petal.style.opacity = String(0.45 + Math.random() * 0.4);
    layer.appendChild(petal);
  }
})();
