// ui.js
export const STORAGE_KEYS = {
  theme: 'pu_theme',
  layout: 'pu_layout_v1'
};

export function initializeTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}
export function toggleTheme() {
  const el = document.documentElement;
  const next = el.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  el.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_KEYS.theme, next);
}

// Layout persistence
export function getSavedLayout(id) {
  const layouts = JSON.parse(localStorage.getItem(STORAGE_KEYS.layout) || '{}');
  return layouts[id] || {};
}
export function persistLayout(card) {
  const id = card.getAttribute('data-id');
  const layouts = JSON.parse(localStorage.getItem(STORAGE_KEYS.layout) || '{}');
  layouts[id] = {
    left: parseInt(card.style.left),
    top: parseInt(card.style.top),
    width: parseInt(card.style.width),
    height: parseInt(card.style.height),
    preset: card.dataset.preset || null
  };
  localStorage.setItem(STORAGE_KEYS.layout, JSON.stringify(layouts));
}

// Card factory
export function createModule(opts = {}) {
  const card = document.createElement('div');
  card.className = 'card module-card';
  card.setAttribute('data-id', opts.id || `m-${Date.now()}`);
  card.setAttribute('role', 'button');

  const header = document.createElement('div');
  header.className = 'card-header';
  header.textContent = opts.title || 'Module';

  const body = document.createElement('div');
  body.className = 'card-body';
  body.textContent = opts.proof || '';

  const resize = document.createElement('div');
  resize.className = 'resizable-handle';
  resize.setAttribute('aria-hidden', 'true');

  card.appendChild(header);
  card.appendChild(body);
  card.appendChild(resize);

  // Basic defaults in case CSS is missing
  card.style.position = 'absolute';
  card.style.left = '0px';
  card.style.top = '0px';
  card.style.width = opts.width || '200px';
  card.style.height = opts.height || '150px';

  // Click opens modal (but not when resizing/dragging)
  card.addEventListener('click', (e) => {
    if (e.target.closest('.resizable-handle')) return;
    if (card._dragMoved) return;
    openModuleWindow(card);
  });

  return card;
}

// ui.js
export function openModuleWindow(card) {
  // prevent duplicates
  if (document.querySelector(`.module-window[data-source="${card.getAttribute('data-id')}"]`)) return;

  const titleText = card.querySelector('.card-header')?.textContent || 'Module';

  // === Backdrop ===
  const backdrop = document.createElement('div');
  backdrop.className = 'module-backdrop';
  const themeNow = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const backdropBg = themeNow === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.3)';
  Object.assign(backdrop.style, {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9998,
    background: backdropBg,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  });

  // === Window ===
  const win = document.createElement('div');
  win.className = 'module-window';
  win.setAttribute('data-source', card.getAttribute('data-id'));
  const bgColor = themeNow === 'dark' ? 'rgba(45,45,42,0.82)' : 'rgba(246,247,235,0.88)';
  Object.assign(win.style, {
    background: bgColor,
    borderRadius: '14px',
    padding: '18px',
    width: '90vw',
    height: '90vh',
    maxWidth: '90vw',
    maxHeight: '90vh',
    zIndex: 9999,
    border: '1px solid var(--border)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
    overflow: 'hidden', // parent hides; child scrolls
  });

  // === Header ===
  const header = document.createElement('div');
  header.className = 'module-window-header';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';

  const hTitle = document.createElement('div');
  hTitle.textContent = titleText;
  hTitle.style.fontWeight = '600';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '×';
  closeBtn.style.fontSize = '1.25rem';
  closeBtn.style.background = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.cursor = 'pointer';

  header.appendChild(hTitle);
  header.appendChild(closeBtn);
  win.appendChild(header);

  // === Scrollable Content ===
  const body = document.createElement('div');
  body.className = 'module-window-content';
  const id = card.getAttribute('data-id');

  import('./content.js').then(({ CARD_CONTENT }) => {
    body.innerHTML = CARD_CONTENT[id]?.modal || '<p>No content yet.</p>';

    // If the resume tabs exist, wire them up (safe to call always)
    if (typeof initResumeTabs === 'function') {
      initResumeTabs(body);
    }
  });

  win.appendChild(body);

  // === Mount ===
  backdrop.appendChild(win);
  document.body.appendChild(backdrop);

  // Lock background scroll
  document.body.classList.add('modal-open');

  // === Close / focus handling ===
  setTimeout(() => closeBtn.focus(), 10);

  function onKey(e) {
    if (e.key === 'Escape') closeWindow();
  }
  function onBackdropClick(e) {
    if (e.target === backdrop) closeWindow();
  }
  function closeWindow() {
    window.removeEventListener('keydown', onKey);
    backdrop.removeEventListener('click', onBackdropClick);
    backdrop.remove();
    document.body.classList.remove('modal-open'); // re-enable page scroll
  }

  window.addEventListener('keydown', onKey);
  backdrop.addEventListener('click', onBackdropClick);
  closeBtn.addEventListener('click', closeWindow);
}



// Overlap (visual) helpers used during drag
export function rectsOverlapPx(aEl, bEl) {
  const a = aEl.getBoundingClientRect();
  const b = bEl.getBoundingClientRect();
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

let _overlapRAF = null;
export function updateOverlapsForActive(activeEl) {
  if (_overlapRAF) return;
  _overlapRAF = requestAnimationFrame(() => {
    _overlapRAF = null;
    const cards = document.querySelectorAll('.module-card');
    cards.forEach(c => {
      if (c === activeEl) { c.classList.remove('overlapped'); return; }
      if (rectsOverlapPx(activeEl, c)) c.classList.add('overlapped');
      else c.classList.remove('overlapped');
    });
  });
}
export function clearAllOverlaps() {
  document.querySelectorAll('.module-card.overlapped')
    .forEach(c => c.classList.remove('overlapped'));
}

// ui.js (add this helper)
export function initResumeTabs(rootEl) {
  const menu = rootEl.querySelector('.rp-menu');
  if (!menu) return;

  menu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-target]');
    if (!btn) return;

    // toggle active button
    menu.querySelectorAll('button').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });

    // toggle sections
    const target = btn.dataset.target;
    const sections = rootEl.querySelectorAll('.rp-section');
    sections.forEach(sec => sec.classList.remove('active'));
    rootEl.querySelector(`#rp-${target}`)?.classList.add('active');
  });
}
