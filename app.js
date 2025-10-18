// Grid and DOM constants
const root = document.documentElement;
const playground = document.getElementById('playground');


// Grid settings
let GRID_SIZE = 0;
let GRID_OFFSET_X = 0;
let GRID_OFFSET_Y = 0;
let GRID_PHASE_X = 0;
let GRID_PHASE_Y = 0;

// ---- Size presets (in grid cells) ----
const PRESETS = {
  S: { w: 5,  h: 4 },  // 5x4 cells
  M: { w: 10, h: 4 },  // 10x4 cells (wide)
  L: { w: 10, h: 8 },  // 10x8 cells (largest)
};

function presetToPx(key) {
  const p = PRESETS[key];
  return { w: p.w * GRID_SIZE, h: p.h * GRID_SIZE };
}

// choose nearest preset by Euclidean distance in **cells**
function nearestPreset(widthPx, heightPx) {
  const cx = widthPx / GRID_SIZE;
  const cy = heightPx / GRID_SIZE;
  let bestKey = 'S';
  let bestDist = Infinity;
  for (const [key, p] of Object.entries(PRESETS)) {
    const dx = cx - p.w;
    const dy = cy - p.h;
    const d = Math.hypot(dx, dy);
    if (d < bestDist) { bestDist = d; bestKey = key; }
  }
  return bestKey;
}

// Apply a preset to a card, keep within bounds, persist
function applyPreset(card, key) {
  const { w, h } = presetToPx(key);
  const bounds = getBounds();
  const left = parseFloat(card.style.left)  || GRID_OFFSET_X;
  const top  = parseFloat(card.style.top)   || GRID_OFFSET_Y;

  // Adjust position if new size would overflow
  const newLeft = Math.min(left, bounds.right  - w);
  const newTop  = Math.min(top,  bounds.bottom - h);

  card.style.left = newLeft + 'px';
  card.style.top  = newTop + 'px';
  card.style.width  = w + 'px';
  card.style.height = h + 'px';
  card.dataset.preset = key;

  persistLayout(card);
}


// Storage keys
const STORAGE_KEYS = {
    theme: 'pu_theme',
    layout: 'pu_layout_v1'
};

// State
let isDragging = false;
let isResizing = false;
let startX, startY, startWidth, startHeight;
let currentElement = null;

// Utility function

function snapToGrid(valuePx, originPx, phasePx, gridPx) {
    // Ensure all inputs are numbers
    valuePx = Number(valuePx);
    originPx = Number(originPx);
    phasePx = Number(phasePx);
    gridPx = Number(gridPx);
    
    // Round to nearest grid line, accounting for origin and phase
    return Math.round((valuePx - originPx - phasePx) / gridPx) * gridPx + originPx + phasePx;
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(v, max));
}



// Drag functionality
function attachDrag(card) {
  let dragging = false;
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;
  const MOVE_THRESHOLD = 6;

  card.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.resizable-handle')) return;

    card._dragMoved = false;
    dragging = true;

    startX = e.clientX;
    startY = e.clientY;

    const cs = getComputedStyle(card);
    startLeft = parseFloat(cs.left);
    startTop  = parseFloat(cs.top);

    card.classList.add('dragging');
    card.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  card.addEventListener('pointermove', (e) => {
    if (!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!card._dragMoved && (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD)) {
      card._dragMoved = true;
    }

    const bounds = getBounds();
    const w = card.offsetWidth;
    const h = card.offsetHeight;

    const newLeft = clamp(startLeft + dx, bounds.left,  bounds.right  - w);
    const newTop  = clamp(startTop  + dy, bounds.top,   bounds.bottom - h);

    card.style.left = `${newLeft}px`;
    card.style.top  = `${newTop}px`;
  });

  card.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;

    const bounds = getBounds();
    const w = card.offsetWidth;
    const h = card.offsetHeight;

    const currentLeft = parseFloat(card.style.left);
    const currentTop  = parseFloat(card.style.top);

    const snappedLeft = clamp(
      snapToGrid(currentLeft, GRID_OFFSET_X, GRID_PHASE_X, GRID_SIZE),
      bounds.left, bounds.right - w
    );
    const snappedTop = clamp(
      snapToGrid(currentTop,  GRID_OFFSET_Y, GRID_PHASE_Y, GRID_SIZE),
      bounds.top,  bounds.bottom - h
    );

    // Animate position only
    animateSnapTo(card, { left: snappedLeft, top: snappedTop, width: w, height: h }, () => {
      persistLayout(card);
    });

    card.classList.remove('dragging');
    card.releasePointerCapture(e.pointerId);
    setTimeout(() => { card._dragMoved = false; }, 0);
    e.preventDefault();
  });

  card.addEventListener('pointercancel', () => {
    if (dragging) {
      dragging = false;
      card.classList.remove('dragging');
      card._dragMoved = false;
    }
  });
}


// Resize functionality
function attachResize(card, handle) {
    let resizing = false, startW = 0, startH = 0, startX = 0, startY = 0;
    const MIN_W = 200, MIN_H = 160, MAX_W = 560, MAX_H = 420;

    handle.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        resizing = true;
        handle.setPointerCapture(e.pointerId);
        e.preventDefault();
        document.body.style.userSelect = 'none';

        startW = card.offsetWidth;
        startH = card.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
    });

    handle.addEventListener('pointermove', (e) => {
        if (!resizing) return;
        const dX = e.clientX - startX;
        const dY = e.clientY - startY;
        const newW = Math.max(MIN_W, Math.min(startW + dX, MAX_W));
        const newH = Math.max(MIN_H, Math.min(startH + dY, MAX_H));
        card.style.width = newW + 'px';
        card.style.height = newH + 'px';
    });

    handle.addEventListener('pointerup', (e) => {
  if (!resizing) return;
  resizing = false;
  handle.releasePointerCapture(e.pointerId);
  document.body.style.userSelect = '';

  const wRaw = card.offsetWidth;
  const hRaw = card.offsetHeight;

  const key = nearestPreset(wRaw, hRaw);

  // Compute target rect and animate to it
  const target = computePresetRect(card, key);
  animateSnapTo(card, target, () => {
    card.dataset.preset = key;
    persistLayout(card);
  });
});


}

// Dialog Management
function openDialog(data) {
    const dialog = document.getElementById('moduleDialog');
    const title = dialog.querySelector('#dialog-title');
    
    title.textContent = data.title;
    dialog.setAttribute('aria-hidden', 'false');
    
    trapFocus(dialog);
}

function closeDialog() {
    const dialog = document.getElementById('moduleDialog');
    dialog.setAttribute('aria-hidden', 'true');
}

// Minimal focus trap for dialogs (keeps tab focus inside dialog while open)
function trapFocus(container) {
    const focusable = Array.from(container.querySelectorAll('a[href], button, textarea, input, select'));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function onKey(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    container.addEventListener('keydown', onKey);
    // When dialog closes, remove listener
    const observer = new MutationObserver(() => {
        if (container.getAttribute('aria-hidden') === 'true') {
            container.removeEventListener('keydown', onKey);
            observer.disconnect();
        }
    });
    observer.observe(container, { attributes: true });
    // Focus first element
    first.focus();
}

// Simple createModule factory used by initialization code
function createModule(opts = {}) {
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

    // Basic styles to ensure visibility if CSS missing
    card.style.position = 'absolute';
    card.style.left = '0px';
    card.style.top = '0px';
    card.style.width = opts.width || '200px';
    card.style.height = opts.height || '150px';

    // Open a near-fullscreen editable window when the card is clicked.
    // Guard so clicks on the resize handle or during drag don't open it.
    card.addEventListener('click', (e) => {
        if (e.target.closest('.resizable-handle')) return;
        // If the card was just moved (pointerdown->move->up), don't open editor
        if (card._dragMoved) return;
        openModuleWindow(card);
    });

    return card;
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.theme, newTheme);
}

// Layout persistence
function getSavedLayout(id) {
    const layouts = JSON.parse(localStorage.getItem(STORAGE_KEYS.layout) || '{}');
    return layouts[id] || {};
}

function persistLayout(card) {
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


function readNumberVar(name) {
  return parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;
}

function syncGridConstants() {
  // Read from CSS
  GRID_SIZE    = readNumberVar('--grid-size');
  GRID_PHASE_X = readNumberVar('--grid-phase-x'); // 0 => corners on dots
  GRID_PHASE_Y = readNumberVar('--grid-phase-y');

  // Content-box origin (padding defines draggable area)
  const cs = getComputedStyle(playground);
  GRID_OFFSET_X = parseFloat(cs.paddingLeft) || 0;
  GRID_OFFSET_Y = parseFloat(cs.paddingTop)  || 0;

  // Write offsets back so the visible dots start at the same origin
  root.style.setProperty('--grid-offset-x', GRID_OFFSET_X + 'px');
  root.style.setProperty('--grid-offset-y', GRID_OFFSET_Y + 'px');
}


document.addEventListener('DOMContentLoaded', () => {
  // Theme first
  initializeTheme();

  // Grid/dots single source of truth
  syncGridConstants();

  // Create single test card AFTER constants are synced
  const card = createModule({
    id: 'sample',
    title: 'My Universe',
    proof: 'click to expand'
  });

  // Try to restore saved layout/preset
  const saved = getSavedLayout('sample');
  if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
    // Position first
    card.style.left = saved.left + 'px';
    card.style.top  = saved.top  + 'px';

    // If a preset exists, apply it (ensures exact px that match current GRID_SIZE)
    if (saved.preset && PRESETS[saved.preset]) {
      applyPreset(card, saved.preset);
    } else if (Number.isFinite(saved.width) && Number.isFinite(saved.height)) {
      // Otherwise honor stored px (then snap width/height to nearest preset for consistency)
      card.style.width  = saved.width  + 'px';
      card.style.height = saved.height + 'px';
      const key = nearestPreset(saved.width, saved.height);
      applyPreset(card, key);
    }
  } else {
    // First-run defaults: place one cell in from origin and apply Small preset (5x4)
    card.style.left = (GRID_OFFSET_X + GRID_SIZE) + 'px';
    card.style.top  = (GRID_OFFSET_Y + GRID_SIZE) + 'px';
    applyPreset(card, 'S');
  }

  attachDrag(card);
  attachResize(card, card.querySelector('.resizable-handle'));
  playground.appendChild(card);

  // Wire UI
  document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);
  document.querySelector('.dialog-close')?.addEventListener('click', closeDialog);
  document.querySelector('.dialog-backdrop')?.addEventListener('click', closeDialog);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDialog(); });
});



// Recompute grid constants when the viewport resizes (fixes mobile vs desktop misalignment)
let resizeTimer = null;
window.addEventListener('resize', () => {
    // throttle / debounce
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // re-sync constants and write offsets back to CSS
        syncGridConstants();
        resnapAllCards();
    }, 120);
});

    // Minimal module window: small modal with title and close (×)
    function openModuleWindow(card) {
        if (document.querySelector(`.module-window[data-source="${card.getAttribute('data-id')}"]`)) return;
        const titleText = card.querySelector('.card-header')?.textContent || 'Module';

        const backdrop = document.createElement('div');
        backdrop.className = 'module-backdrop';
        // pick backdrop color based on theme
        const themeNow = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const backdropBg = themeNow === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.3)';
        Object.assign(backdrop.style, { position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, background: backdropBg, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' });

    const win = document.createElement('div');
    win.className = 'module-window';
    win.setAttribute('data-source', card.getAttribute('data-id'));
    // Use viewport-percentage sizing so margins scale across devices (leave 5% on each side → 90vw/90vh)
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
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
    });

        const header = document.createElement('div');
        header.className = 'module-window-header';
        header.style.display = 'flex'; header.style.justifyContent = 'space-between'; header.style.alignItems = 'center';

        const hTitle = document.createElement('div');
        hTitle.textContent = titleText; hTitle.style.fontWeight = '600';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button'; closeBtn.textContent = '×';
        closeBtn.style.fontSize = '1.25rem'; closeBtn.style.background = 'transparent'; closeBtn.style.border = 'none'; closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', closeWindow);

        header.appendChild(hTitle);
        header.appendChild(closeBtn);
        win.appendChild(header);
        backdrop.appendChild(win);
        document.body.appendChild(backdrop);

        // Focus handling and close on ESC / backdrop
        setTimeout(() => closeBtn.focus(), 10);
        function onKey(e) { if (e.key === 'Escape') closeWindow(); }
        window.addEventListener('keydown', onKey);
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeWindow(); });

        function closeWindow() {
            persistLayout(card);
            window.removeEventListener('keydown', onKey);
            backdrop.remove();
        }
    }

function getBounds() {
  const r = playground.getBoundingClientRect();
  return {
    left: GRID_OFFSET_X,
    top:  GRID_OFFSET_Y,
    right: r.width  - GRID_OFFSET_X,
    bottom:r.height - GRID_OFFSET_Y
  };
}

function resnapAllCards() {
  document.querySelectorAll('.module-card').forEach(card => {
    const w = card.offsetWidth, h = card.offsetHeight;
    const left = parseFloat(card.style.left) || 0;
    const top  = parseFloat(card.style.top)  || 0;

    const bounds = getBounds();
    const snappedLeft = clamp(
      snapToGrid(left, GRID_OFFSET_X, GRID_PHASE_X, GRID_SIZE),
      bounds.left, bounds.right - w
    );
    const snappedTop = clamp(
      snapToGrid(top,  GRID_OFFSET_Y, GRID_PHASE_Y, GRID_SIZE),
      bounds.top,  bounds.bottom - h
    );
    card.style.left = snappedLeft + 'px';
    card.style.top  = snappedTop  + 'px';
  });
}



function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Compute a nice duration based on how many grid cells we’re changing.
// Returns seconds (string like "0.32s").
function snapDuration(fromW, fromH, toW, toH, fromL, fromT, toL, toT) {
  // Convert deltas to "cell units" so it scales with your grid
  const dWCells = Math.abs(toW - fromW) / GRID_SIZE;
  const dHCells = Math.abs(toH - fromH) / GRID_SIZE;
  const dXCells = Math.abs(toL - fromL) / GRID_SIZE;
  const dYCells = Math.abs(toT - fromT) / GRID_SIZE;

  // Euclidean distance in cells (size + position)
  const distCells = Math.hypot(dWCells + dXCells, dHCells + dYCells);

  // Map cells → duration: base 0.18s + 0.06s per cell, capped
  const minS = 0.18, maxS = 0.55, stepPerCell = 0.06;
  const dur = Math.min(maxS, Math.max(minS, minS + distCells * stepPerCell));
  return `${dur.toFixed(2)}s`;
}

// Animate to target rect with a one-off transition; then clean up.
function animateSnapTo(card, { left, top, width, height }, onDone) {
  if (prefersReducedMotion()) {
    // Jump instantly if user prefers reduced motion
    card.style.left = left + 'px';
    card.style.top = top + 'px';
    card.style.width = width + 'px';
    card.style.height = height + 'px';
    onDone?.();
    return;
  }

  const from = {
    left: parseFloat(card.style.left) || 0,
    top:  parseFloat(card.style.top)  || 0,
    width:  card.offsetWidth,
    height: card.offsetHeight
  };

  const dur = snapDuration(from.width, from.height, width, height, from.left, from.top, left, top);

  // Set a one-off transition just for this snap
  const easeWH = 'cubic-bezier(0.22,1,0.36,1)';
  const easePos = 'ease';
  card.style.transition = `left ${dur} ${easePos}, top ${dur} ${easePos}, width ${dur} ${easeWH}, height ${dur} ${easeWH}`;

  // Apply target rect
  card.style.left = left + 'px';
  card.style.top = top + 'px';
  card.style.width = width + 'px';
  card.style.height = height + 'px';

  // Clean up transition after it finishes
  const cleanup = () => {
    card.style.transition = ''; // revert to stylesheet
    card.removeEventListener('transitionend', onEnd);
    onDone?.();
  };
  let endedProps = new Set();
  const onEnd = (e) => {
    // Wait until at least width/height are done
    if (e.target !== card) return;
    endedProps.add(e.propertyName);
    if (endedProps.has('width') && endedProps.has('height')) {
      cleanup();
    }
  };
  card.addEventListener('transitionend', onEnd);

  // Fallback timer in case transitionend doesn’t fire (display:none etc.)
  const timeoutMs = parseFloat(dur) * 1000 + 60;
  setTimeout(cleanup, timeoutMs);
}

// Compute where a preset would land (respecting bounds) WITHOUT changing the card yet.
function computePresetRect(card, presetKey) {
  const { w, h } = presetToPx(presetKey);
  const bounds = getBounds();
  const left = parseFloat(card.style.left) || GRID_OFFSET_X;
  const top  = parseFloat(card.style.top)  || GRID_OFFSET_Y;

  return {
    left: Math.min(left, bounds.right  - w),
    top:  Math.min(top,  bounds.bottom - h),
    width: w,
    height: h,
    key: presetKey
  };
}
