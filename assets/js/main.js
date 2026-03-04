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

  // Parallax orb (lightweight)
  const orb = document.getElementById("orb");
  const orbWrap = document.getElementById("orbWrap");
  let lastY = 0;

  const parallax = () => {
    const y = window.scrollY;
    const dy = (y - lastY);
    lastY = y;

    if (orb) {
      // Subtle translate with scroll
      const t = Math.min(22, y * 0.06);
      orb.style.transform = `translateY(${-t}px) rotate(${t * 0.45}deg)`;
    }

    if (orbWrap) {
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
