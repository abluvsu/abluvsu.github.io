document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveals();
  initNavScrubbing();
  initCustomCursor();
  initMagneticElements();
  initParallax();
});

// Theme Toggle functionality
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleBtn.textContent = '[DARK MODE]';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.textContent = '[LIGHT MODE]';
  }
  
  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    toggleBtn.textContent = newTheme === 'light' ? '[DARK MODE]' : '[LIGHT MODE]';
  });
}

// Intersection Observer for scroll reveal animations
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);
  
  revealElements.forEach(el => observer.observe(el));
}

function initNavScrubbing() {
  let lastScrollY = window.scrollY;
  const nav = document.querySelector('.nav');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      nav.style.transform = 'translateY(-100%)';
      nav.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
  }, { passive: true });
}

// Custom Cursor
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  
  // Hide default cursor on body
  document.body.style.cursor = 'none';
  
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  });
  
  // Hover states for clickable elements
  const clickables = document.querySelectorAll('a, button, .work-card, .magnetic');
  
  clickables.forEach(el => {
    // Hide default cursor on clickables too
    el.style.cursor = 'none';
    
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}

// Magnetic Elements
function initMagneticElements() {
  const magnets = document.querySelectorAll('.magnetic');
  
  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
      const position = magnet.getBoundingClientRect();
      const x = e.pageX - position.left - position.width / 2;
      const y = e.pageY - position.top - position.height / 2;
      
      magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });
    
    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = 'translate(0px, 0px)';
    });
  });
}

// Subtle Parallax
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-speed') || 0.1;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}
