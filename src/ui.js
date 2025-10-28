// ui.js
export const STORAGE_KEYS = {
  theme: 'pu_theme',
  layout: 'pu_layout_v1'
};

export function initializeTheme() {
  let savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  
  // Default to light mode if no preference saved
  if (!savedTheme) {
    savedTheme = 'light';
    localStorage.setItem(STORAGE_KEYS.theme, 'light');
  }
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Sync checkbox state with theme (checked = light/day with sun, unchecked = dark/night with moon)
  const checkbox = document.querySelector('#checkbox');
  if (checkbox) {
    checkbox.checked = savedTheme === 'light';
  }
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

  const body = document.createElement('div');
  body.className = 'card-body';
  body.textContent = opts.proof || '';

  const resize = document.createElement('div');
  resize.className = 'resizable-handle';
  resize.setAttribute('aria-hidden', 'true');

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

  // === Window ===
  const win = document.createElement('div');
  win.className = 'module-window';
  win.setAttribute('data-source', card.getAttribute('data-id'));
  Object.assign(win.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'var(--bg)',
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
  header.style.justifyContent = 'flex-end';
  header.style.alignItems = 'center';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '×';
  closeBtn.style.fontSize = '1.25rem';
  closeBtn.style.background = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.color = 'var(--fg)';

  header.appendChild(closeBtn);
  win.appendChild(header);

  // === Scrollable Content ===
  const body = document.createElement('div');
  body.className = 'module-window-content';
  const id = card.getAttribute('data-id');

  import('./content.js').then(({ CARD_CONTENT }) => {
    body.innerHTML = CARD_CONTENT[id]?.modal || '<p>No content yet.</p>';
  });

  win.appendChild(body);

  // === Mount ===
  document.body.appendChild(win);

  // Lock background scroll
  document.body.classList.add('modal-open');

  // === Close / focus handling ===
  setTimeout(() => closeBtn.focus(), 10);

  function onKey(e) {
    if (e.key === 'Escape') closeWindow();
  }
  function closeWindow() {
    window.removeEventListener('keydown', onKey);
    win.remove();
    document.body.classList.remove('modal-open'); // re-enable page scroll
  }

  window.addEventListener('keydown', onKey);
  closeBtn.addEventListener('click', closeWindow);
}








