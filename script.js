document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveals();
  initNavScrubbing();
  initCustomCursor();
  initMagneticElements();
  initParallax();
  initROICalculator();
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

// ROI Calculator Logic
function initROICalculator() {
  const submissionsInput = document.getElementById('submissions');
  const salaryInput = document.getElementById('salary');
  const timeInput = document.getElementById('time');
  const automationInput = document.getElementById('automation');
  const automationVal = document.getElementById('automation-val');
  
  const outSavings = document.getElementById('out-savings');
  const outHours = document.getElementById('out-hours');
  const outTtq = document.getElementById('out-ttq');

  if (!submissionsInput) return; // Only run on pibit page

  function formatCurrency(num) {
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return '$' + (num / 1000).toFixed(0) + 'K';
    return '$' + num.toLocaleString();
  }

  function formatNumber(num) {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  }

  function calculate() {
    const subs = parseFloat(submissionsInput.value) || 0;
    const salary = parseFloat(salaryInput.value) || 0;
    const time = parseFloat(timeInput.value) || 0;
    const autoGain = parseFloat(automationInput.value) || 0;

    automationVal.textContent = `${autoGain}% Time Saved`;

    // 1. Hours Reclaimed = Total Manual Hours * Automation %
    const totalManualHours = subs * time;
    const hoursSaved = totalManualHours * (autoGain / 100);

    // 2. Savings = (Hours Saved / 2000 hours per FTE) * Avg Salary
    const fteSaved = hoursSaved / 2000;
    const directSavings = fteSaved * salary;

    // 3. TTQ Acceleration (Synthetic metric based on automation)
    // If you save 70% of time, TTQ velocity increases by ~ (1 / (1 - 0.7)) - 1
    const ttqBoost = Math.min((1 / (1 - (autoGain / 100))) - 1, 9.99); // Cap at 999%
    const ttqPercentage = Math.floor(ttqBoost * 100);

    // Render outputs
    outSavings.textContent = formatCurrency(directSavings);
    outHours.textContent = formatNumber(hoursSaved);
    outTtq.textContent = `+${ttqPercentage}%`;
  }

  // Event Listeners
  submissionsInput.addEventListener('input', calculate);
  salaryInput.addEventListener('input', calculate);
  timeInput.addEventListener('input', calculate);
  automationInput.addEventListener('input', calculate);

  // Initial Calculation
  calculate();
}
