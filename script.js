(() => {
  /**
   * Personaliza aquí la dedicación para tu amiga
   */
  const CONFIG = {
    para: "Mi amiga",
    de: "Tu amigo",
    carta: [
      "Hoy no quería enviarte un mensaje cualquiera. Quería darte un pedacito de cielo con flores amarillas… porque así se siente tu amistad: cálida, luminosa y imposible de olvidar.",
      "Gracias por estar, por reír conmigo, por escucharme y por hacer que los días pesados se sientan más livianos. Contigo la vida tiene más color.",
      "Que estas flores te recuerden lo especial que eres para mí. Feliz Día de las Flores Amarillas, amiga.",
    ],
  };

  const canvas = document.getElementById("galaxy");
  const ctx = canvas.getContext("2d", { alpha: false });
  const flowersLayer = document.getElementById("flowers");
  const soundBtn = document.getElementById("soundBtn");
  const envelopeBtn = document.getElementById("envelopeBtn");
  const letterBtn = document.getElementById("letterBtn");
  const backBtn = document.getElementById("backBtn");
  const replayBtn = document.getElementById("replayBtn");
  const letterBody = document.getElementById("letterBody");

  document.getElementById("toName").textContent = CONFIG.para;
  document.getElementById("fromName").textContent = CONFIG.de;
  document.getElementById("letterFrom").textContent = CONFIG.de;

  const scenes = {
    envelope: document.getElementById("sceneEnvelope"),
    heart: document.getElementById("sceneHeart"),
    letter: document.getElementById("sceneLetter"),
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let heartPoints = [];
  let particles = [];
  let heartProgress = 0;
  let opened = false;
  let pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let audioCtx = null;
  let musicOn = false;
  let musicNodes = null;
  let typingTimer = null;
  let raf = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
    buildHeart();
  }

  function heartPath(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
  }

  function buildHeart() {
    const scale = Math.min(width, height) * 0.018;
    const cx = width * 0.5;
    const cy = height * 0.42;
    heartPoints = [];
    const count = Math.floor(Math.min(width, height) * 0.55);
    for (let i = 0; i < count; i += 1) {
      const t = (i / count) * Math.PI * 2;
      const p = heartPath(t);
      heartPoints.push({
        x: cx + p.x * scale,
        y: cy + p.y * scale,
        r: 1.2 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2,
        hue: 42 + Math.random() * 18,
      });
    }
    for (let i = 0; i < count * 0.45; i += 1) {
      const t = Math.random() * Math.PI * 2;
      const p = heartPath(t);
      const shrink = 0.35 + Math.random() * 0.55;
      heartPoints.push({
        x: cx + p.x * scale * shrink,
        y: cy + p.y * scale * shrink,
        r: 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        hue: 48 + Math.random() * 12,
        inner: true,
      });
    }
  }

  function buildStars() {
    const count = Math.floor((width * height) / 4500);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random(),
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function spawnParticles() {
    particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.35,
      r: 0.8 + Math.random() * 2,
      a: 0.2 + Math.random() * 0.55,
    }));
  }

  function createFloatingFlowers() {
    if (reducedMotion) return;
    flowersLayer.innerHTML = "";
    const glyphs = ["🌻", "🌼", "❀", "✿"];
    const count = width < 700 ? 10 : 16;
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement("span");
      el.className = "flower";
      el.textContent = glyphs[i % glyphs.length];
      el.style.left = `${Math.random() * 100}%`;
      el.style.bottom = `${-10 - Math.random() * 30}%`;
      el.style.setProperty("--drift", `${(Math.random() - 0.5) * 120}px`);
      el.style.animationDuration = `${10 + Math.random() * 14}s`;
      el.style.animationDelay = `${Math.random() * 10}s`;
      el.style.fontSize = `${1 + Math.random() * 1.4}rem`;
      flowersLayer.appendChild(el);
    }
  }

  function drawBackground(time) {
    const g = ctx.createRadialGradient(
      width * 0.5 + pointer.x * 20,
      height * 0.4 + pointer.y * 20,
      0,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.75
    );
    g.addColorStop(0, "#1a1230");
    g.addColorStop(0.45, "#0b0818");
    g.addColorStop(1, "#05040c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    for (const s of stars) {
      const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(time * 0.0015 + s.tw));
      const size = 0.6 + s.z * 1.8;
      ctx.fillStyle = `rgba(255, 245, 210, ${twinkle * (0.25 + s.z * 0.75)})`;
      ctx.beginPath();
      ctx.arc(
        s.x + pointer.x * s.z * 18,
        s.y + pointer.y * s.z * 12,
        size,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  function drawParticles() {
    for (const p of particles) {
      p.x += p.vx + pointer.x * 0.15;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 213, 74, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawHeart(time) {
    if (!opened) return;
    heartProgress = Math.min(1, heartProgress + (reducedMotion ? 1 : 0.0065));
    const visible = Math.floor(heartPoints.length * heartProgress);

    const aura = ctx.createRadialGradient(
      width * 0.5,
      height * 0.42,
      10,
      width * 0.5,
      height * 0.42,
      Math.min(width, height) * 0.28
    );
    aura.addColorStop(0, `rgba(255, 184, 40, ${0.22 * heartProgress})`);
    aura.addColorStop(1, "rgba(255, 184, 40, 0)");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < visible; i += 1) {
      const h = heartPoints[i];
      const pulse = 1 + Math.sin(time * 0.003 + h.phase) * 0.15;
      const px = h.x + pointer.x * (h.inner ? 6 : 14);
      const py = h.y + pointer.y * (h.inner ? 6 : 14);
      const alpha = h.inner ? 0.35 : 0.75;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${h.hue}, 100%, ${h.inner ? 68 : 62}%, ${alpha * heartProgress})`;
      ctx.shadowColor = "rgba(255, 200, 60, 0.85)";
      ctx.shadowBlur = h.inner ? 6 : 14;
      ctx.arc(px, py, h.r * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    if (heartProgress > 0.55) {
      const orbitCount = 18;
      const radius = Math.min(width, height) * 0.22;
      for (let i = 0; i < orbitCount; i += 1) {
        const ang = time * 0.0007 + (i / orbitCount) * Math.PI * 2;
        const ox = width * 0.5 + Math.cos(ang) * radius;
        const oy = height * 0.42 + Math.sin(ang) * radius * 0.72;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 233, 160, ${0.35 + 0.35 * Math.sin(ang * 3)})`;
        ctx.arc(ox, oy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function frame(time) {
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    drawBackground(time);
    drawParticles();
    drawHeart(time);
    raf = requestAnimationFrame(frame);
  }

  function showScene(name) {
    Object.entries(scenes).forEach(([key, el]) => {
      const active = key === name;
      el.hidden = !active;
      el.classList.toggle("is-active", active);
    });
  }

  function typeLetter() {
    letterBody.innerHTML = "";
    letterBody.classList.add("cursor-blink");
    let paraIndex = 0;
    let charIndex = 0;
    let current = document.createElement("p");
    letterBody.appendChild(current);

    clearInterval(typingTimer);
    if (reducedMotion) {
      CONFIG.carta.forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        letterBody.appendChild(p);
      });
      letterBody.classList.remove("cursor-blink");
      return;
    }

    typingTimer = setInterval(() => {
      const text = CONFIG.carta[paraIndex];
      current.textContent = text.slice(0, charIndex + 1);
      charIndex += 1;
      if (charIndex >= text.length) {
        paraIndex += 1;
        charIndex = 0;
        if (paraIndex >= CONFIG.carta.length) {
          clearInterval(typingTimer);
          letterBody.classList.remove("cursor-blink");
          return;
        }
        current = document.createElement("p");
        letterBody.appendChild(current);
      }
    }, 22);
  }

  function openDedication() {
    opened = true;
    heartProgress = reducedMotion ? 1 : 0;
    showScene("heart");
    createFloatingFlowers();
    startMusic(true);
  }

  function openLetter() {
    showScene("letter");
    typeLetter();
  }

  function backToGalaxy() {
    clearInterval(typingTimer);
    showScene("heart");
  }

  function replay() {
    clearInterval(typingTimer);
    opened = false;
    heartProgress = 0;
    flowersLayer.innerHTML = "";
    showScene("envelope");
  }

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function startMusic(fromGesture) {
    if (!fromGesture && !musicOn) return;
    const ctxA = ensureAudio();
    if (ctxA.state === "suspended") ctxA.resume();
    if (musicNodes) return;

    musicOn = true;
    soundBtn.setAttribute("aria-pressed", "true");

    const master = ctxA.createGain();
    master.gain.value = 0.045;
    master.connect(ctxA.destination);

    const notes = [196, 246.94, 293.66, 369.99, 440];
    const oscillators = notes.map((freq, i) => {
      const osc = ctxA.createOscillator();
      const gain = ctxA.createGain();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      gain.gain.value = 0.15 / notes.length;
      const lfo = ctxA.createOscillator();
      const lfoGain = ctxA.createGain();
      lfo.frequency.value = 0.05 + i * 0.02;
      lfoGain.gain.value = 0.04;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      lfo.start();
      return { osc, gain, lfo };
    });

    musicNodes = { master, oscillators };
  }

  function stopMusic() {
    musicOn = false;
    soundBtn.setAttribute("aria-pressed", "false");
    if (!musicNodes || !audioCtx) return;
    musicNodes.master.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
    setTimeout(() => {
      if (!musicNodes) return;
      musicNodes.oscillators.forEach(({ osc, lfo }) => {
        try {
          osc.stop();
          lfo.stop();
        } catch (_) {
          /* noop */
        }
      });
      musicNodes = null;
    }, 450);
  }

  function toggleMusic() {
    if (musicOn) stopMusic();
    else startMusic(true);
  }

  function onPointer(e) {
    const x = (e.clientX ?? e.touches?.[0]?.clientX ?? width / 2) / width;
    const y = (e.clientY ?? e.touches?.[0]?.clientY ?? height / 2) / height;
    pointer.tx = (x - 0.5) * 2;
    pointer.ty = (y - 0.5) * 2;
  }

  envelopeBtn.addEventListener("click", openDedication);
  letterBtn.addEventListener("click", openLetter);
  backBtn.addEventListener("click", backToGalaxy);
  replayBtn.addEventListener("click", replay);
  soundBtn.addEventListener("click", toggleMusic);
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("resize", () => {
    resize();
    spawnParticles();
  });

  resize();
  spawnParticles();
  showScene("envelope");
  raf = requestAnimationFrame(frame);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
})();
