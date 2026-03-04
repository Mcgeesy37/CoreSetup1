// FX Layer: Cursor glow + spotlight + stars + progress bar
(() => {
  const glow = document.querySelector(".cursor-glow");
  const spot = document.querySelector(".bg-spotlight");
  const progress = document.querySelector(".scroll-progress span");
  const starsWrap = document.getElementById("stars");

  // Stars (lightweight)
  if (starsWrap) {
    const count = 90;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.style.position = "absolute";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      const size = Math.random() * 2.2 + 0.6;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.borderRadius = "50%";
      s.style.background = "rgba(255,255,255," + (Math.random() * 0.6 + 0.15) + ")";
      s.style.boxShadow = "0 0 18px rgba(200,169,106," + (Math.random() * 0.18) + ")";
      s.style.opacity = (Math.random() * 0.7 + 0.2).toFixed(2);
      s.style.transform = `translateY(${Math.random() * 10}px)`;
      frag.appendChild(s);
    }
    starsWrap.appendChild(frag);
  }

  // Cursor + Spotlight
  let mx = 0, my = 0;
  const onMove = (e) => {
    mx = e.clientX;
    my = e.clientY;

    if (glow) {
      glow.style.left = mx + "px";
      glow.style.top = my + "px";
    }

    // Spotlight vars for CSS
    document.documentElement.style.setProperty("--sx", mx + "px");
    document.documentElement.style.setProperty("--sy", my + "px");
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (!e.touches || !e.touches[0]) return;
    onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
  }, { passive: true });

  // Scroll progress
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (progress) progress.style.width = p.toFixed(2) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
