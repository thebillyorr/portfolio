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
  createModule, getSavedLayout, persistLayout
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

  // Fill face content with all size variants
  if (CARD_CONTENT[id]) {
    const body = card.querySelector('.card-body');
    body.innerHTML = `
      <div data-size="small">${CARD_CONTENT[id].small || ''}</div>
      <div data-size="medium">${CARD_CONTENT[id].medium || ''}</div>
      <div data-size="large">${CARD_CONTENT[id].large || ''}</div>
    `;
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

  // Only enable drag/resize on desktop (not mobile)
  const isMobile = window.innerWidth < 768;
  if (!isMobile) {
    attachDrag(card);
    attachResize(card, card.querySelector('.resizable-handle'));
  }
  
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
  });

  card.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;

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
    
    // Update preset in real-time for smooth content transitions
    const currentPreset = nearestPreset(newW, newH);
    if (card.dataset.preset !== currentPreset) {
      card.dataset.preset = currentPreset;
    }
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

  // Check if mobile viewport
  const isMobile = window.innerWidth < 768;

  mountModule({
    id: 'resume',
    title: 'Resume / Career',
    preset: isMobile ? 'S' : 'L',
    leftCells: isMobile ? 0 : 1,
    topCells: isMobile ? 0 : 1,
  });

  mountModule({
    id: 'posters',
    title: 'Design / Posters',
    preset: isMobile ? 'S' : 'M',
    leftCells: isMobile ? 0 : 14,
    topCells: isMobile ? 6 : 1
  });

  mountModule({
    id: 'steamed',
    title: 'Project / Steamed',
    preset: isMobile ? 'S' : 'L',
    leftCells: isMobile ? 0 : 14,
    topCells: isMobile ? 12 : 6
  });

  // Theme toggle checkbox handler
  const themeCheckbox = document.querySelector('#checkbox');
  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', toggleTheme);
  }

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

  // Billy Orr sparkle and tilt effect
  const heroName = document.querySelector('.hero-name');
  const heroSection = document.querySelector('#hero');
  
  if (heroName && heroSection) {
    let lastSparkleTime = 0;
    const sparkleThrottle = 50; // ms between sparkles

    // Global mouse tilt effect - follows mouse across entire hero section
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroName.getBoundingClientRect();
      const nameX = rect.left + rect.width / 2;
      const nameY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to the text center
      const deltaX = (e.clientX - nameX) / window.innerWidth;
      const deltaY = (e.clientY - nameY) / window.innerHeight;
      
      // Apply more pronounced 3D tilt
      const tiltX = -deltaY * 35; // Increased tilt based on vertical distance
      const tiltY = deltaX * 35; // Increased tilt based on horizontal distance
      
      heroName.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    // Reset tilt when mouse leaves hero section
    heroSection.addEventListener('mouseleave', () => {
      heroName.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });

    // Sparkle creation only when hovering over the text itself
    heroName.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSparkleTime < sparkleThrottle) return;
      lastSparkleTime = now;

      const rect = heroName.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create 1-2 sparkles per mouse move
      const sparkleCount = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < sparkleCount; i++) {
        createSparkle(x, y);
      }
    });

    function createSparkle(x, y) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      
      // Random offset from cursor
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      
      // Random travel distance
      const tx = (Math.random() - 0.5) * 40;
      const ty = (Math.random() - 0.5) * 40 - 20; // Slight upward bias
      
      sparkle.style.left = `${x + offsetX}px`;
      sparkle.style.top = `${y + offsetY}px`;
      sparkle.style.setProperty('--tx', `${tx}px`);
      sparkle.style.setProperty('--ty', `${ty}px`);
      
      // Load and inject the SVG
      sparkle.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.17296,13.0036 L6.34297,13.3752 C7.07036,14.88 8.21624,16.1431 9.6428,17.0133 L9.90768,17.1685 C10.0308,17.2377 10.0308,17.4149 9.90768,17.4842 C9.81836,17.5344 9.73005,17.5862 9.6428,17.6394 C8.21624,18.5095 7.07036,19.7727 6.34297,21.2775 L6.17296,21.649 C6.10635,21.7989 5.89365,21.7989 5.82704,21.649 L5.65703,21.2775 C4.92964,19.7727 3.78376,18.5095 2.3572,17.6394 C2.26995,17.5862 2.18164,17.5344 2.09232,17.4842 C1.96923,17.4149 1.96923,17.2377 2.09232,17.1685 L2.3572,17.0133 C3.78376,16.1431 4.92964,14.88 5.65703,13.3752 L5.82704,13.0036 C5.89365,12.8538 6.10635,12.8538 6.17296,13.0036 Z M15.0779,2.72991 C15.1747,2.94774 15.2716,3.16544 15.3754,3.38009 C16.6483,6.01348 18.6536,8.22403 21.1501,9.74673 C21.3028,9.83987 21.4573,9.93043 21.6137,10.0184 C21.8291,10.1395 21.8291,10.4497 21.6137,10.5708 C21.4573,10.6588 21.3028,10.7493 21.1501,10.8425 C18.6536,12.3651 16.6483,14.5757 15.3754,17.2091 C15.2716,17.4237 15.1747,17.6414 15.0779,17.8593 C14.9613,18.1215 14.5891,18.1215 14.4725,17.8593 C14.3757,17.6414 14.2788,17.4237 14.175,17.2091 C12.9021,14.5757 10.8968,12.3651 8.40031,10.8425 C8.24761,10.7493 8.09308,10.6588 7.93676,10.5708 C7.72136,10.4497 7.72136,10.1395 7.93676,10.0184 C8.09308,9.93043 8.24761,9.83987 8.40031,9.74673 C10.8968,8.22403 12.9021,6.01348 14.175,3.38009 C14.2786,3.16578 14.3757,2.94781 14.4725,2.72991 C14.5891,2.46764 14.9613,2.46764 15.0779,2.72991 Z" fill="currentColor"/>
        </svg>
      `;
      
      heroName.appendChild(sparkle);
      
      // Remove after animation completes
      setTimeout(() => sparkle.remove(), 800);
    }
  }
});
