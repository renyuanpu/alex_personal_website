# Personal Portfolio — Architecture & Design

Professional single-page portfolio for a UC San Diego Mathematics & Computer Science student. Built with semantic HTML5, modular CSS3, and vanilla JavaScript—no frameworks.

## 1. Website Architecture

**Pattern:** Single-page application (SPA-style navigation without a JS framework).

| Layer | Responsibility |
|--------|----------------|
| **HTML** | Semantic structure, content hierarchy, SEO/OG metadata, accessible landmarks (`header`, `nav`, `main`, `section`, `footer`). |
| **CSS** | Design tokens (variables), layout (Grid/Flexbox), responsive breakpoints, motion (with `prefers-reduced-motion`). |
| **JavaScript** | Progressive enhancement: nav behavior, smooth scroll, scroll-reveal, hero canvas background, dynamic project cards from a data object, optional theme toggle. |

**Navigation flow:** Fixed top navbar → anchor links to section IDs → smooth scroll with offset for fixed header. Active section highlighting updates on scroll.

**Performance:** Hero animation uses `requestAnimationFrame` on a single canvas with capped particle count; animations pause when tab is hidden (`visibilitychange`). No heavy libraries.

**Contact form:** Presentational UI only—wire to a backend or form service when ready.

## 2. Design System

**Aesthetic:** Futuristic minimalism—dark base, high-contrast type, thin borders, glassmorphism cards, monospace accents for a technical/research-lab feel.

**Color tokens (CSS variables):**

- Background: near-black (`#0a0a0b`) with subtle radial gradients
- Surface: dark gray glass panels (`rgba` + `backdrop-filter`)
- Text: white primary, light gray secondary, dark gray muted
- Borders: 1px `rgba(255,255,255,0.08–0.15)`

**Typography:**

- **Sans:** Inter — headings and body
- **Mono:** JetBrains Mono — labels, tags, code-like accents

**Spacing scale:** `--space-xs` through `--space-3xl` (4px base rhythm).

**Components:** Buttons (primary ghost + solid), skill bars/tags, timeline cards, achievement dashboard grid, experience cards, project cards, research interest chips, contact form fields.

**Responsive breakpoints:** 480px, 768px, 1024px — mobile-first stacking; hero and grids reflow at each step.

**Accessibility:** Skip link, focus-visible outlines, sufficient contrast, `aria-*` on nav and interactive controls, reduced motion disables non-essential animation.

## 3. File Structure

```
/
├── index.html          # All sections, semantic markup, meta/OG tags
├── css/
│   └── style.css       # Variables, layout, components, responsive rules
├── js/
│   └── script.js       # Nav, scroll, reveal, canvas, projects, theme
├── assets/
│   ├── images/         # Profile photo, og-image (add your files here)
│   └── resume.pdf      # Place your resume PDF here
└── README.md           # This document
```

**Customization checklist:**

1. Replace `[YOUR NAME]` and contact placeholders in `index.html`.
2. Add `assets/images/profile.jpg` and update `src` in the hero.
3. Add `assets/resume.pdf` and verify the download link.
4. Edit `projects` array in `js/script.js` when projects are ready.
5. Optional: add `assets/images/og-image.png` and set `og:image` in `<head>`.

## Local Development

Open `index.html` in a browser, or serve statically:

```bash
npx serve .
```

## License

Personal portfolio — all rights reserved by the site owner.
