/**
 * Portfolio interactions: navigation, scroll reveal, hero canvas,
 * skill bars, achievement filters, projects, theme, contact stub.
 */

(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     Project data — edit titles, links, and descriptions as work ships.
     -------------------------------------------------------------------------- */
  const projects = [
    {
      name: "Algorithm Project",
      type: "Algorithms",
      description:
        "Placeholder for a systems or competitive-programming style project emphasizing correctness proofs, complexity analysis, and clean C++/Python implementations.",
      technologies: ["C++", "Python", "Proof sketches"],
      github: "#github-algorithm-project",
      demo: "#demo-algorithm-project",
    },
    {
      name: "Mathematical Research Project",
      type: "Mathematics",
      description:
        "Placeholder for expository or exploratory work in combinatorics, number theory, or graph theory—write-ups, lemmas, and computational verification.",
      technologies: ["LaTeX", "Python", "Sage (optional)"],
      github: "#github-math-research",
      demo: "#demo-math-research",
    },
    {
      name: "AI / ML Project",
      type: "Artificial Intelligence",
      description:
        "Placeholder for a machine learning pipeline or AI application with reproducible experiments, baselines, and evaluation metrics.",
      technologies: ["Python", "PyTorch (placeholder)", "NumPy"],
      github: "#github-ai-ml",
      demo: "#demo-ai-ml",
    },
    {
      name: "Software Engineering Project",
      type: "Software Engineering",
      description:
        "Placeholder for a full-stack or tooling project demonstrating API design, testing discipline, and deployment-minded architecture.",
      technologies: ["JavaScript", "HTML/CSS", "Git"],
      github: "#github-software-eng",
      demo: "#demo-software-eng",
    },
  ];

  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const themeToggle = document.getElementById("theme-toggle");
  const projectGrid = document.getElementById("project-grid");
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");
  const canvas = document.getElementById("hero-canvas");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
     Render project cards from data
     -------------------------------------------------------------------------- */
  function renderProjects() {
    if (!projectGrid) return;

    projectGrid.innerHTML = projects
      .map(
        (p) => `
      <article class="glass card project-card reveal">
        <span class="project-type">${escapeHtml(p.type)}</span>
        <h3 class="project-name">${escapeHtml(p.name)}</h3>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="project-tech">
          ${p.technologies.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}
        </div>
        <div class="project-links">
          <a href="${escapeHtml(p.github)}" aria-label="GitHub repository for ${escapeHtml(p.name)}">GitHub →</a>
          <a href="${escapeHtml(p.demo)}" aria-label="Live demo for ${escapeHtml(p.name)}">Demo →</a>
        </div>
      </article>
    `
      )
      .join("");

    observeReveal(document.querySelectorAll("#project-grid .reveal"));
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* --------------------------------------------------------------------------
     Skill bars from data attributes
     -------------------------------------------------------------------------- */
  function initSkillBars() {
    document.querySelectorAll("[data-skills]").forEach((container) => {
      let skills;
      try {
        skills = JSON.parse(container.getAttribute("data-skills"));
      } catch {
        return;
      }

      skills.forEach((skill) => {
        const li = document.createElement("li");
        li.className = "skill-row";
        li.innerHTML = `
          <div class="skill-row-header">
            <span>${escapeHtml(skill.name)}</span>
            <span class="mono">${skill.level}%</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill" style="--level: ${skill.level}%"></div>
          </div>
        `;
        container.appendChild(li);
      });
    });

    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".skill-bar-fill").forEach((fill) => {
              fill.classList.add("is-visible");
            });
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".skill-bars").forEach((el) => barObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
     Achievement category filter
     -------------------------------------------------------------------------- */
  function initAchievementFilters() {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".achievement-card");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        buttons.forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });

        cards.forEach((card) => {
          const cat = card.getAttribute("data-category");
          const show = filter === "all" || cat === filter;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     Mobile navigation
     -------------------------------------------------------------------------- */
  function closeNav() {
    siteNav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
  }

  navToggle?.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => closeNav());
  });

  /* --------------------------------------------------------------------------
     Header scroll state & active nav link
     -------------------------------------------------------------------------- */
  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    let current = "";
    const offset = 120;

    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      if (window.scrollY >= top) {
        current = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("is-active", href === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------------------------------
     Smooth scroll for in-page anchors (respect reduced motion)
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 72;

      window.scrollTo({
        top: y,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  /* --------------------------------------------------------------------------
     Scroll reveal
     -------------------------------------------------------------------------- */
  function observeReveal(elements) {
    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  }

  observeReveal(document.querySelectorAll(".reveal"));

  /* --------------------------------------------------------------------------
     Theme toggle (optional light mode)
     -------------------------------------------------------------------------- */
  const THEME_KEY = "portfolio-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next === "light" ? "light" : "dark");
    localStorage.setItem(THEME_KEY, next);
  });

  /* --------------------------------------------------------------------------
     Contact form (client-side validation stub)
     -------------------------------------------------------------------------- */
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = /** @type {HTMLInputElement} */ (document.getElementById("contact-name")).value.trim();
    const email = /** @type {HTMLInputElement} */ (document.getElementById("contact-email")).value.trim();
    const message = /** @type {HTMLTextAreaElement} */ (document.getElementById("contact-message")).value.trim();

    if (!name || !email || !message) {
      if (formNote) formNote.textContent = "Please fill in all fields.";
      return;
    }

    if (formNote) {
      formNote.textContent =
        "Thanks — connect this form to EmailJS, Formspree, or your backend to deliver messages.";
    }
    contactForm.reset();
  });

  /* --------------------------------------------------------------------------
     Hero canvas: grid + particles + subtle code fragments
     -------------------------------------------------------------------------- */
  function initHeroCanvas() {
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId = 0;
    let particles = [];
    const PARTICLE_COUNT = 48;
    const GRID = 48;

    const codeSnippets = ["O(n log n)", "∀x∈V", "while(true)", "∫", "if(dp[i]", "Σ", "λ", "git push"];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      initParticles();
    }

    function initParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.2 + 0.3,
      }));
    }

    function drawGrid() {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      ctx.strokeStyle = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;

      for (let x = 0; x <= width; x += GRID) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += GRID) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    function drawParticles() {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const dotColor = isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.35)";
      const lineColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = 1 - dist / 120;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });
    }

    let snippetIndex = 0;
    let frame = 0;

    function drawCodeHints() {
      if (frame % 180 !== 0) return;
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      ctx.font = "11px JetBrains Mono, monospace";
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)";
      const text = codeSnippets[snippetIndex % codeSnippets.length];
      snippetIndex += 1;
      const x = (Math.random() * 0.6 + 0.2) * width;
      const y = (Math.random() * 0.5 + 0.15) * height;
      ctx.fillText(text, x, y);
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawParticles();
      drawCodeHints();
      frame += 1;
      animationId = requestAnimationFrame(loop);
    }

    resize();
    loop();

    window.addEventListener("resize", resize);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        loop();
      }
    });
  }

  /* --------------------------------------------------------------------------
     Boot
     -------------------------------------------------------------------------- */
  renderProjects();
  initSkillBars();
  initAchievementFilters();
  initHeroCanvas();
})();
