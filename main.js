// main.js
import {
  PRESETS, presetToPx, nearestPreset,
  clamp, snapToGrid,
  syncGridConstants, getGridVars,
  getBounds, getBoundsCells,
  pxToCol, pxToRow,
  animateSnapTo, animateToCellRect,
  getLayoutCells, cloneLayout, shove
} from './grid.js';

import {
  initializeTheme, toggleTheme,
  createModule, getSavedLayout, persistLayout,
  updateOverlapsForActive, clearAllOverlaps
} from './ui.js';

import { CARD_CONTENT } from './content.js';
import { GALLERY_DATA } from './gallery-data.js';

// --- Apply a preset (DOM size + persist) ---
function applyPreset(card, key) {
  const { w, h } = presetToPx(key);
  const bounds = getBounds();
  const { GRID_OFFSET_X, GRID_OFFSET_Y } = getGridVars();
  const left = parseFloat(card.style.left)  || GRID_OFFSET_X;
  const top  = parseFloat(card.style.top)   || GRID_OFFSET_Y;

  const newLeft = Math.min(left, bounds.right  - w);
  const newTop  = Math.min(top,  bounds.bottom - h);

  card.style.left = newLeft + 'px';
  card.style.top  = newTop  + 'px';
  card.style.width  = w + 'px';
  card.style.height = h + 'px';
  card.dataset.preset = key;

  persistLayout(card);
}

// --- Mount a card ---
function mountModule({ id, title, proof = 'click to expand', preset = 'S', leftCells = 1, topCells = 1 }) {
  const card = createModule({ id, title, proof });

  // Fill face content
  if (CARD_CONTENT[id]?.face) {
    card.querySelector('.card-body').innerHTML = CARD_CONTENT[id].face;
  }

  // Restore or place + preset
  const saved = getSavedLayout(id);
  const { GRID_SIZE, GRID_OFFSET_X, GRID_OFFSET_Y } = getGridVars();

  if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
    card.style.left = saved.left + 'px';
    card.style.top  = saved.top  + 'px';

    if (saved.preset && PRESETS[saved.preset]) {
      applyPreset(card, saved.preset);
    } else if (Number.isFinite(saved.width) && Number.isFinite(saved.height)) {
      card.style.width  = saved.width  + 'px';
      card.style.height = saved.height + 'px';
      const key = nearestPreset(saved.width, saved.height);
      applyPreset(card, key);
    }
  } else {
    card.style.left = (GRID_OFFSET_X + GRID_SIZE * leftCells) + 'px';
    card.style.top  = (GRID_OFFSET_Y + GRID_SIZE * topCells)  + 'px';
    applyPreset(card, preset);
  }

  attachDrag(card);
  attachResize(card, card.querySelector('.resizable-handle'));
  document.getElementById('playground').appendChild(card);
  return card;
}

// --- Drag ---
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

    // optional visual feedback for overlaps
    updateOverlapsForActive(card);
  });

  card.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    clearAllOverlaps();

    const bounds = getBounds();
    const w = card.offsetWidth;
    const h = card.offsetHeight;

    const currentLeft = parseFloat(card.style.left);
    const currentTop  = parseFloat(card.style.top);

    const { GRID_OFFSET_X, GRID_OFFSET_Y, GRID_PHASE_X, GRID_PHASE_Y, GRID_SIZE } = getGridVars();

    const snappedLeft = clamp(
      snapToGrid(currentLeft, GRID_OFFSET_X, GRID_PHASE_X, GRID_SIZE),
      bounds.left, bounds.right - w
    );
    const snappedTop = clamp(
      snapToGrid(currentTop,  GRID_OFFSET_Y, GRID_PHASE_Y, GRID_SIZE),
      bounds.top,  bounds.bottom - h
    );

    animateSnapTo(card, { left: snappedLeft, top: snappedTop, width: w, height: h }, () => {
      resolveDragWithShove(card, snappedLeft, snappedTop);
    });

    card.classList.remove('dragging');
    card.releasePointerCapture(e.pointerId);
    setTimeout(() => { card._dragMoved = false; }, 0);
    e.preventDefault();
  });

  card.addEventListener('pointercancel', () => {
    if (!dragging) return;
    dragging = false;
    clearAllOverlaps();
    card.classList.remove('dragging');
    card._dragMoved = false;
  });
}

// --- Resize ---
function attachResize(card, handle) {
  let resizing = false, startW = 0, startH = 0, startX = 0, startY = 0;
  const MIN_W = 200, MIN_H = 160, MAX_W = 560, MAX_H = 420;

  handle.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    resizing = true;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
    document.body.style.userSelect = 'none';
    card.classList.add('resizing');

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
    card.classList.remove('resizing');

    const desiredKey = nearestPreset(card.offsetWidth, card.offsetHeight);
    resolveResizeWithShove(card, desiredKey);
  });
}

// --- Shove orchestration (drag) ---
function resolveDragWithShove(card, snappedLeft, snappedTop) {
  const id = card.getAttribute('data-id');
  const bounds = getBoundsCells();
  const baseLayout = getLayoutCells();
  const cur = baseLayout[id];

  const target = {
    col: pxToCol(snappedLeft),
    row: pxToRow(snappedTop),
    w: cur.w,
    h: cur.h
  };

  const draft = cloneLayout(baseLayout);
  if (shove(draft, id, target, bounds)) {
    Object.entries(draft).forEach(([cid, r]) => {
      const node = document.querySelector(`.module-card[data-id="${cid}"]`);
      if (!node) return;
      animateToCellRect(node, r, () => { persistLayout(node); });
    });
    return true;
  }

  // If solver fails, revert to previous persisted position
  const prev = getSavedLayout(id);
  if (prev && Number.isFinite(prev.left) && Number.isFinite(prev.top)) {
    animateSnapTo(card, {
      left: prev.left,
      top:  prev.top,
      width:  prev.width  ?? card.offsetWidth,
      height: prev.height ?? card.offsetHeight
    }, () => { persistLayout(card); });
  }
  return false;
}

// --- Shove orchestration (resize) ---
function resolveResizeWithShove(card, desiredKey) {
  const id = card.getAttribute('data-id');
  const bounds = getBoundsCells();
  const baseLayout = getLayoutCells();
  const startRect = baseLayout[id];

  const order = desiredKey === 'L' ? ['L','M','S']
              : desiredKey === 'M' ? ['M','L','S']
              : ['S','M','L'];

  for (const key of order) {
    const size = PRESETS[key]; // cells
    const target = { col: startRect.col, row: startRect.row, w: size.w, h: size.h };
    const draft = cloneLayout(baseLayout);

    if (shove(draft, id, target, bounds)) {
      Object.entries(draft).forEach(([cid, r]) => {
        const node = document.querySelector(`.module-card[data-id="${cid}"]`);
        if (!node) return;
        animateToCellRect(node, r, () => {
          if (cid === id) node.dataset.preset = key;
          persistLayout(node);
        });
      });
      return true;
    }
  }

  // Revert if nothing fits
  const prev = getSavedLayout(id);
  if (prev && prev.preset && PRESETS[prev.preset]) {
    const { GRID_OFFSET_X, GRID_OFFSET_Y } = getGridVars();
    // previous px -> snap back to cells based on px
    const rect = {
      col: pxToCol(prev.left ?? GRID_OFFSET_X),
      row: pxToRow(prev.top  ?? GRID_OFFSET_Y),
      w: PRESETS[prev.preset].w,
      h: PRESETS[prev.preset].h
    };
    animateToCellRect(card, rect, () => {
      card.dataset.preset = prev.preset;
      persistLayout(card);
    });
  }
  return false;
}

// --- Boot ---
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  syncGridConstants();

  mountModule({
    id: 'resume',
    title: 'Resume / Career',
    preset: 'S',
    leftCells: 1,
    topCells: 1
  });

  mountModule({
    id: 'design',
    title: 'Design / Posters',
    preset: 'M',
    leftCells: 8,
    topCells: 1
  });

  document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);

  // Recompute grid constants on resize
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      syncGridConstants();
      // Optional: resnapAllCards(); // import from grid.js if you want this behavior
    }, 120);
  });

  // Gallery Modal Handler
  const galleryContainer = document.getElementById('heroGallery');
  const galleryModal = document.getElementById('galleryModal');
  const galleryModalImage = document.getElementById('galleryModalImage');
  const galleryModalCaption = document.getElementById('galleryModalCaption');
  const galleryModalClose = document.querySelector('.gallery-modal-close');
  const galleryModalBackdrop = document.querySelector('.gallery-modal-backdrop');

  // Shuffle array function
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Select 4 random images from gallery data
  const randomGallery = shuffleArray(GALLERY_DATA).slice(0, 4);

  // Render gallery items from random selection
  const galleryItems = [];
  randomGallery.forEach((item, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = `gallery-item gallery-item-${index + 1}`;
    galleryItem.dataset.id = item.id;
    galleryItem.dataset.caption = item.caption;
    galleryItem.innerHTML = `<img src="${item.src}" alt="${item.alt}">`;
    galleryContainer.appendChild(galleryItem);
    galleryItems.push(galleryItem);
  });

  function openGalleryModal(item) {
    const caption = item.dataset.caption || '';
    const img = item.querySelector('img');
    
    galleryModalImage.src = img.src;
    galleryModalImage.alt = img.alt;
    galleryModalCaption.textContent = caption;
    
    galleryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeGalleryModal() {
    galleryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openGalleryModal(item));
  });

  galleryModalClose.addEventListener('click', closeGalleryModal);
  galleryModalBackdrop.addEventListener('click', closeGalleryModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryModal.getAttribute('aria-hidden') === 'false') {
      closeGalleryModal();
    }
  });
});
