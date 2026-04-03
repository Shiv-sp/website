/* ══════════════════════════════════════
   Portfolio — script.js
══════════════════════════════════════ */

// ── Page Registry ──────────────────────────────────────────────────────────
const PAGE_MAP = {
  home:       { page: 'page-home',       nav: 'nav-home'       },
  //experience: { page: 'page-experience', nav: 'nav-experience' },
  //extras:     { page: 'page-extras',     nav: 'nav-extras'     },
  //projects:   { page: 'page-projects',   nav: 'nav-projects'   },
  resume:     { page: 'page-resume',     nav: 'nav-resume'     },
};

/**
 * showPage — switch the active page and highlight the correct nav link.
 * @param {string} name - key from PAGE_MAP
 */
function showPage(name) {
  Object.entries(PAGE_MAP).forEach(([key, ids]) => {
    const pageEl = document.getElementById(ids.page);
    const navEl  = document.getElementById(ids.nav);

    const isActive = key === name;
    pageEl.classList.toggle('active', isActive);
    if (navEl) navEl.classList.toggle('active', isActive);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Theme Toggle ────────────────────────────────────────────────────────────
function toggleTheme() {
  const html    = document.documentElement;
  const current = html.getAttribute('data-theme');
  html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');

  // Persist preference across page reloads
  try {
    localStorage.setItem('portfolio-theme', html.getAttribute('data-theme'));
  } catch (_) {
    // localStorage may be unavailable in some contexts — silently ignore
  }
}

/** Restore saved theme on load */
function initTheme() {
  try {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (_) {
    // ignore
  }
}

// ── Typing Effect ───────────────────────────────────────────────────────────
const PHRASES = [
  'computer engineering @ mcmasterU',
  '[incoming] PM @ AMD',
  'aspiring project manager',
  'creative problem solver',
  'sports enthusiast',
  'music lover',
  'natural leader',
];

const TYPING_SPEED   = 95;   // ms per character (typing)
const DELETING_SPEED = 45;   // ms per character (deleting)
const PAUSE_AFTER    = 1800; // ms to hold completed phrase
const START_DELAY    = 1200; // ms before first character

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
let isPaused     = false;

function runTyper() {
  if (isPaused) return;

  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  const phrase = PHRASES[phraseIndex];

  if (!isDeleting) {
    // Type forward
    typedEl.textContent = phrase.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === phrase.length) {
      // Finished typing — pause before deleting
      isPaused = true;
      setTimeout(() => {
        isPaused    = false;
        isDeleting  = true;
        runTyper();
      }, PAUSE_AFTER);
      return;
    }
  } else {
    // Delete backward
    typedEl.textContent = phrase.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
    }
  }

  setTimeout(runTyper, isDeleting ? DELETING_SPEED : TYPING_SPEED);
}

// ── Keyboard Shortcuts — quick page switching ───────────────────────────────
const KEY_MAP = {
  '1': 'home',
  //'2': 'experience',
  //'3': 'extras',
  //'4': 'projects',
  '5': 'resume',
};

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ignore when typing in an input/textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (KEY_MAP[e.key]) {
      showPage(KEY_MAP[e.key]);
    }

    // 'T' toggles theme
    if (e.key === 't' || e.key === 'T') {
      toggleTheme();
    }
  });
}

// ── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initKeyboardShortcuts();
  setTimeout(runTyper, START_DELAY);
});