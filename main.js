/* ================================================
   MAIN.JS — GSAP Animations, Lenis Scroll & Interactions
   Premium portfolio — inspired by abetterlou.com
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Guard: wait for GSAP
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded — removing preloader, skipping animations.');
    const pl = document.getElementById('preloader');
    if (pl) pl.style.display = 'none';
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initSmoothScroll();
  initPreloader();
  initHeader();
  initHamburger();
  initHeroAnimations();
  initScrollAnimations();
  initStatCounters();
});

/* ─── Smooth Scroll (Lenis) ─────────────────────── */
let lenis;

function initSmoothScroll() {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Handle anchor links with smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = anchor.getAttribute('href');
      if (hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        lenis.scrollTo(target, { offset: -80 });
        // Close mobile menu if open
        const navLinks = document.getElementById('nav-links');
        const hamburger = document.getElementById('nav-hamburger');
        if (navLinks) navLinks.classList.remove('open');
        if (hamburger) hamburger.classList.remove('active');
      }
    });
  });
}

/* ─── Preloader ─────────────────────────────────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const tl = gsap.timeline();

  tl.to('.preloader-text', {
    opacity: 0,
    y: -20,
    duration: 0.4,
    delay: 1.6, // Let the bar fill animation (~1.5s) finish
    ease: 'power2.inOut',
  })
    .to('.preloader-bar', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    }, '-=0.2')
    .to(preloader, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
    })
    .set(preloader, { display: 'none' });
}

/* ─── Header scroll effect ──────────────────────── */
function initHeader() {
  const header = document.getElementById('header');
  if (!header || typeof ScrollTrigger === 'undefined') return;

  ScrollTrigger.create({
    start: 'top -100',
    end: 99999,
    onUpdate: (self) => {
      if (self.scroll() > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    },
  });
}

/* ─── Mobile Hamburger ──────────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
}

/* ─── Hero Animations ───────────────────────────── */
function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 2.6 }); // After preloader

  // Hero label
  tl.from('.hero-label', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
  })
    // Title lines — dramatic reveal
    .from('.title-line', {
      yPercent: 130,
      opacity: 0,
      duration: 1.1,
      stagger: 0.18,
      ease: 'power4.out',
    }, '-=0.5')
    // Subtitle
    .from('.hero-subtitle', {
      opacity: 0,
      y: 25,
      duration: 0.9,
      ease: 'power3.out',
    }, '-=0.5')
    // Meta items — staggered
    .from('.hero-meta-item', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
    }, '-=0.4')
    // Meta border line
    .from('.hero-meta', {
      '--border-opacity': 0,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.6');
}

/* ─── Scroll-triggered Animations ───────────────── */
function initScrollAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  // Fade-up elements
  const fadeUpEls = document.querySelectorAll('[data-animate="fade-up"]');

  fadeUpEls.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });
  });

  // Stagger children (stats grid, etc.)
  const staggerContainers = document.querySelectorAll('[data-animate="stagger"]');

  staggerContainers.forEach((container) => {
    const items = container.children;
    gsap.from(items, {
      scrollTrigger: {
        trigger: container,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
    });
  });

  // Work cards — stagger with slight scale
  const workCards = document.querySelectorAll('.work-card');
  if (workCards.length) {
    gsap.fromTo(workCards,
      { opacity: 0, y: 60, scale: 0.97 },
      {
        scrollTrigger: {
          trigger: '.work-grid',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      }
    );
  }

  // Footer headline
  const footerHL = document.querySelector('.footer-headline');
  if (footerHL) {
    gsap.from(footerHL, {
      scrollTrigger: {
        trigger: footerHL,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 1.2,
      ease: 'power3.out',
    });
  }
}

/* ─── Stat Counter Animation ────────────────────── */
function initStatCounters() {
  if (typeof ScrollTrigger === 'undefined') return;

  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  statNumbers.forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const isFloat = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            if (isFloat) {
              el.textContent = counter.val.toFixed(1);
            } else {
              el.textContent = Math.floor(counter.val);
            }
          },
        });
      },
    });
  });
}
