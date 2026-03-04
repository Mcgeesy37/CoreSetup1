(() => {
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Mobile Nav
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll for anchors (nice on iOS too)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add("show");
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // Active nav highlight
  const sections = ["#leistungen","#preise","#projekte","#kontakt"]
    .map(id => document.querySelector(id))
    .filter(Boolean);
  const navItems = document.querySelectorAll("[data-nav]");

  const setActive = (id) => {
    navItems.forEach(a => {
      const href = a.getAttribute("href");
      if (href === id) a.classList.add("active");
      else a.classList.remove("active");
    });
  };

  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) setActive("#" + en.target.id);
    });
  }, { threshold: 0.35 });

  sections.forEach(s => navIO.observe(s));

 // =========================
// ORB: Drag-to-rotate + Inertia (iPad & Desktop)
// =========================
const orb = document.getElementById("orb");
const orbWrap = document.getElementById("orbWrap");

if (orb && orbWrap) {
  let isDown = false;
  let lastX = 0, lastY = 0;

  // Rotation state
  let rotY = 10;
  let rotX = -6;

  // Velocity for inertia
  let vY = 0;
  let vX = 0;

  let rafId = null;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const apply = () => {
    // reine Rotation (Float-Animation läuft separat; beim Drag pausieren wir sie)
    orb.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
  };

  const stopInertia = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

  const startInertia = () => {
    stopInertia();

    const friction = 0.92;   // 0.88..0.96 (mehr = länger drehen)
    const minVel = 0.02;     // Stop threshold

    const tick = () => {
      // velocity abklingen
      vY *= friction;
      vX *= friction;

      // anwenden
      rotY += vY;
      rotX += vX;
      rotX = clamp(rotX, -35, 35);

      apply();

      if (Math.abs(vY) > minVel || Math.abs(vX) > minVel) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        // Float wieder laufen lassen, wenn wir wirklich stehen
        orb.style.animationPlayState = "running";
      }
    };

    // Float pausieren während inertia, damit es nicht “gegen” die Rotation arbeitet
    orb.style.animationPlayState = "paused";
    rafId = requestAnimationFrame(tick);
  };

  const onDown = (e) => {
    isDown = true;
    stopInertia();

    // Pointer capture (falls verfügbar)
    orbWrap.setPointerCapture?.(e.pointerId);

    lastX = e.clientX;
    lastY = e.clientY;

    // Float pausieren beim direkten Drag
    orb.style.animationPlayState = "paused";

    e.preventDefault();
  };

  const onMove = (e) => {
    if (!isDown) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    lastX = e.clientX;
    lastY = e.clientY;

    // Sensitivity
    const s = 0.35;

    // Update rotation
    rotY += dx * s;
    rotX -= dy * s;
    rotX = clamp(rotX, -35, 35);

    // Update velocity (für inertia)
    vY = dx * s;
    vX = -dy * s;

    apply();
    e.preventDefault();
  };

  const onUp = () => {
    if (!isDown) return;
    isDown = false;

    // Wenn kaum Bewegung, float wieder aktivieren
    const speed = Math.abs(vY) + Math.abs(vX);
    if (speed < 0.4) {
      orb.style.animationPlayState = "running";
      return;
    }

    // sonst inertia starten
    startInertia();
  };

  // Pointer Events (iPad + Desktop)
  orbWrap.addEventListener("pointerdown", onDown, { passive: false });
  window.addEventListener("pointermove", onMove, { passive: false });
  window.addEventListener("pointerup", onUp);
}
      // micro background shift
      const shift = Math.min(16, y * 0.03);
      orbWrap.style.backgroundPosition = `${shift}px ${shift}px`;
    }
  };
  window.addEventListener("scroll", parallax, { passive: true });
  parallax();

  // Orb mouse tilt (premium feel)
  if (orbWrap && orb) {
    orbWrap.addEventListener("mousemove", (e) => {
      const r = orbWrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-py * 8).toFixed(2);
      const ry = (px * 10).toFixed(2);
      orb.style.transform = `translateY(-10px) rotate(${ry}deg)`;
      orbWrap.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    orbWrap.addEventListener("mouseleave", () => {
      orbWrap.style.transform = "none";
      orb.style.transform = "";
    });
  }

  // Projects lightbox
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalSub = document.getElementById("modalSub");

  const openModal = (img, title, sub) => {
    if (!modal || !modalImg) return;
    modalImg.src = img;
    if (modalTitle) modalTitle.textContent = title || "Projekt";
    if (modalSub) modalSub.textContent = sub || "Preview";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal || !modalImg) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".project").forEach(btn => {
    btn.addEventListener("click", () => {
      const img = btn.getAttribute("data-img");
      const title = btn.getAttribute("data-title");
      const sub = btn.getAttribute("data-sub");
      openModal(img, title, sub);
    });
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.hasAttribute("data-close")) closeModal();
    });
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

})();
