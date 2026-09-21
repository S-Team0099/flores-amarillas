(() => {
  const CONFIG = {
    para: "Karen Leici",
    de: "Tu amigo",
    mensaje: [
      "Karen, hoy quería regalarte algo que no se marchita en un florero: un jardín solo para ti.",
      "Gracias por tu risa, por tu compañía y por esa forma tuya de hacer que todo se sienta más liviano. Tu amistad es luz de verdad.",
      "Que estas flores amarillas te recuerden lo especial que eres para mí. Feliz 21 de septiembre, Karen Leici.",
    ],
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const welcome = document.getElementById("welcome");
  const garden = document.getElementById("garden");
  const note = document.getElementById("note");
  const bouquet = document.getElementById("bouquet");
  const petals = document.getElementById("petals");
  const butterflies = document.getElementById("butterflies");
  const cardText = document.getElementById("cardText");
  const soundBtn = document.getElementById("soundBtn");
  const bloomBtn = document.getElementById("bloomBtn");
  const noteBtn = document.getElementById("noteBtn");
  const backGarden = document.getElementById("backGarden");
  const againBtn = document.getElementById("againBtn");

  document.querySelector(".card__sign").textContent = CONFIG.de;

  let audioCtx = null;
  let musicOn = false;
  let musicNodes = null;
  let typingTimer = null;

  function sunflowerSVG() {
    return `
      <svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M60 70 C58 110 55 150 52 178" stroke="#2f6d2c" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M58 120 C40 110 28 118 24 130" fill="#3f8f3a"/>
        <path d="M62 135 C80 125 92 132 96 146" fill="#3f8f3a"/>
        <g class="head">
          ${Array.from({ length: 16 }, (_, i) => {
            const a = (i * 22.5 * Math.PI) / 180;
            const x = 60 + Math.cos(a) * 28;
            const y = 58 + Math.sin(a) * 28;
            return `<ellipse cx="${x}" cy="${y}" rx="10" ry="22" fill="${i % 2 ? "#ffd54a" : "#f5b820"}" transform="rotate(${i * 22.5} ${x} ${y})" />`;
          }).join("")}
          <circle cx="60" cy="58" r="18" fill="#6b3b12"/>
          <circle cx="60" cy="58" r="14" fill="#8a4f1d"/>
          ${Array.from({ length: 18 }, () => {
            const ang = Math.random() * Math.PI * 2;
            const r = Math.random() * 10;
            return `<circle cx="${60 + Math.cos(ang) * r}" cy="${58 + Math.sin(ang) * r}" r="1.2" fill="#5a3010"/>`;
          }).join("")}
        </g>
      </svg>`;
  }

  function plantGarden() {
    bouquet.innerHTML = "";
    const layout = [
      { left: "8%", size: 92, delay: 0.05, z: 2 },
      { left: "22%", size: 120, delay: 0.18, z: 4 },
      { left: "38%", size: 150, delay: 0.28, z: 6 },
      { left: "52%", size: 135, delay: 0.15, z: 5 },
      { left: "68%", size: 112, delay: 0.32, z: 3 },
      { left: "82%", size: 98, delay: 0.22, z: 2 },
      { left: "30%", size: 88, delay: 0.4, z: 1 },
      { left: "60%", size: 95, delay: 0.45, z: 1 },
    ];

    layout.forEach((item, index) => {
      const el = document.createElement("div");
      el.className = "sunflower";
      el.style.left = item.left;
      el.style.setProperty("--size", `${item.size}px`);
      el.style.zIndex = String(item.z);
      el.style.bottom = `${(index % 3) * 4}%`;
      el.innerHTML = sunflowerSVG();
      bouquet.appendChild(el);
      requestAnimationFrame(() => {
        setTimeout(() => el.classList.add("is-grown"), item.delay * 1000);
      });
    });
  }

  function spawnPetals() {
    if (reduced) return;
    petals.innerHTML = "";
    const count = window.innerWidth < 700 ? 14 : 24;
    for (let i = 0; i < count; i += 1) {
      const p = document.createElement("span");
      p.className = "petal-bit";
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${7 + Math.random() * 9}s`;
      p.style.animationDelay = `${Math.random() * 6}s`;
      p.style.width = `${9 + Math.random() * 10}px`;
      p.style.height = `${12 + Math.random() * 12}px`;
      petals.appendChild(p);
    }
  }

  function spawnButterflies() {
    if (reduced) return;
    butterflies.innerHTML = "";
    ["🦋", "🦋", "🐝"].forEach((glyph, i) => {
      const b = document.createElement("span");
      b.className = "butterfly";
      b.textContent = glyph;
      b.style.left = `${15 + i * 28}%`;
      b.style.top = `${28 + i * 8}%`;
      b.style.animationDelay = `${i * 1.4}s`;
      b.style.animationDuration = `${8 + i * 2}s`;
      butterflies.appendChild(b);
    });
  }

  function show(stage) {
    [welcome, garden, note].forEach((el) => {
      const on = el === stage;
      el.hidden = !on;
      el.classList.toggle("is-on", on);
    });
    document.body.classList.toggle("is-garden", stage === garden || stage === note);
  }

  function typeMessage() {
    cardText.innerHTML = "";
    cardText.classList.add("typing");
    clearInterval(typingTimer);

    if (reduced) {
      CONFIG.mensaje.forEach((t) => {
        const p = document.createElement("p");
        p.textContent = t;
        cardText.appendChild(p);
      });
      cardText.classList.remove("typing");
      return;
    }

    let pi = 0;
    let ci = 0;
    let p = document.createElement("p");
    cardText.appendChild(p);

    typingTimer = setInterval(() => {
      const text = CONFIG.mensaje[pi];
      p.textContent = text.slice(0, ci + 1);
      ci += 1;
      if (ci >= text.length) {
        pi += 1;
        ci = 0;
        if (pi >= CONFIG.mensaje.length) {
          clearInterval(typingTimer);
          cardText.classList.remove("typing");
          return;
        }
        p = document.createElement("p");
        cardText.appendChild(p);
      }
    }, 18);
  }

  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function startMusic() {
    const ctx = ensureAudio();
    if (ctx.state === "suspended") ctx.resume();
    if (musicNodes) return;
    musicOn = true;
    soundBtn.setAttribute("aria-pressed", "true");

    const master = ctx.createGain();
    master.gain.value = 0.04;
    master.connect(ctx.destination);

    const notes = [261.63, 329.63, 392.0, 523.25];
    const oscillators = notes.map((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.12 / notes.length;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.04 + i * 0.015;
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      lfo.start();
      return { osc, lfo };
    });
    musicNodes = { master, oscillators };
  }

  function stopMusic() {
    musicOn = false;
    soundBtn.setAttribute("aria-pressed", "false");
    if (!musicNodes || !audioCtx) return;
    musicNodes.master.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
    setTimeout(() => {
      if (!musicNodes) return;
      musicNodes.oscillators.forEach(({ osc, lfo }) => {
        try {
          osc.stop();
          lfo.stop();
        } catch (_) {}
      });
      musicNodes = null;
    }, 400);
  }

  bloomBtn.addEventListener("click", () => {
    show(garden);
    plantGarden();
    spawnPetals();
    spawnButterflies();
    startMusic();
  });

  noteBtn.addEventListener("click", () => {
    show(note);
    typeMessage();
  });

  backGarden.addEventListener("click", () => {
    clearInterval(typingTimer);
    show(garden);
  });

  againBtn.addEventListener("click", () => {
    clearInterval(typingTimer);
    bouquet.innerHTML = "";
    petals.innerHTML = "";
    butterflies.innerHTML = "";
    stopMusic();
    show(welcome);
  });

  soundBtn.addEventListener("click", () => {
    if (musicOn) stopMusic();
    else startMusic();
  });

  show(welcome);
})();
