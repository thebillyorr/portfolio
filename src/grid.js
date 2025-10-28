// grid.js
// ---- Grid state (read from CSS) ----
let GRID_SIZE = 0, GRID_OFFSET_X = 0, GRID_OFFSET_Y = 0, GRID_PHASE_X = 0, GRID_PHASE_Y = 0;

const root = document.documentElement;
const playground = document.getElementById('playground');

const readNumberVar = (name) => parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;

export function syncGridConstants() {
  GRID_SIZE    = readNumberVar('--grid-size');
  GRID_PHASE_X = readNumberVar('--grid-phase-x');
  GRID_PHASE_Y = readNumberVar('--grid-phase-y');

  const cs = getComputedStyle(playground);
  GRID_OFFSET_X = parseFloat(cs.paddingLeft) || 0;
  GRID_OFFSET_Y = parseFloat(cs.paddingTop)  || 0;

  root.style.setProperty('--grid-offset-x', GRID_OFFSET_X + 'px');
  root.style.setProperty('--grid-offset-y', GRID_OFFSET_Y + 'px');
}

export function getGridVars() {
  return { GRID_SIZE, GRID_OFFSET_X, GRID_OFFSET_Y, GRID_PHASE_X, GRID_PHASE_Y };
}

// ---- Constants & presets ----
export const EPS = 1e-4;
export const PRESETS = {
  S: { w: 5,  h: 4 },
  M: { w: 10, h: 4 },
  L: { w: 10, h: 8 },
};

export function presetToPx(key) {
  const p = PRESETS[key];
  return { w: p.w * GRID_SIZE, h: p.h * GRID_SIZE };
}

// ---- Helpers (math) ----
export const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

export function snapToGrid(valuePx, originPx, phasePx, gridPx) {
  valuePx = Number(valuePx);
  originPx = Number(originPx);
  phasePx = Number(phasePx);
  gridPx = Number(gridPx);
  return Math.round((valuePx - originPx - phasePx) / gridPx) * gridPx + originPx + phasePx;
}

export function nearestPreset(widthPx, heightPx) {
  const cx = widthPx / GRID_SIZE;
  const cy = heightPx / GRID_SIZE;
  let bestKey = 'S', bestDist = Infinity;
  for (const [key, p] of Object.entries(PRESETS)) {
    const d = Math.hypot(cx - p.w, cy - p.h);
    if (d < bestDist) { bestDist = d; bestKey = key; }
  }
  return bestKey;
}

// ---- px ↔ cell space + bounds ----
export function pxToCol(xPx) {
  return Math.floor((xPx - GRID_OFFSET_X - GRID_PHASE_X + EPS) / GRID_SIZE);
}
export function pxToRow(yPx) {
  return Math.floor((yPx - GRID_OFFSET_Y - GRID_PHASE_Y + EPS) / GRID_SIZE);
}
export function colToPx(col) {
  return col * GRID_SIZE + GRID_OFFSET_X + GRID_PHASE_X;
}
export function rowToPx(row) {
  return row * GRID_SIZE + GRID_OFFSET_Y + GRID_PHASE_Y;
}

export function getBounds() {
  const r = playground.getBoundingClientRect();
  return {
    left: GRID_OFFSET_X,
    top: GRID_OFFSET_Y,
    right: r.width  - GRID_OFFSET_X,
    bottom: r.height - GRID_OFFSET_Y
  };
}

export function getBoundsCells() {
  const r = playground.getBoundingClientRect();
  const innerW = r.width  - 2 * GRID_OFFSET_X;
  const innerH = r.height - 2 * GRID_OFFSET_Y;
  const cols = Math.max(0, Math.floor((innerW - GRID_PHASE_X + EPS) / GRID_SIZE));
  const rows = Math.max(0, Math.floor((innerH - GRID_PHASE_Y + EPS) / GRID_SIZE));
  return { cols, rows };
}

export function resnapAllCards() {
  document.querySelectorAll('.module-card').forEach(card => {
    const w = card.offsetWidth, h = card.offsetHeight;
    const left = parseFloat(card.style.left) || 0;
    const top  = parseFloat(card.style.top)  || 0;
    const bounds = getBounds();
    const snappedLeft = clamp(
      snapToGrid(left,  GRID_OFFSET_X, GRID_PHASE_X, GRID_SIZE),
      bounds.left, bounds.right - w
    );
    const snappedTop = clamp(
      snapToGrid(top,   GRID_OFFSET_Y, GRID_PHASE_Y, GRID_SIZE),
      bounds.top, bounds.bottom - h
    );
    card.style.left = snappedLeft + 'px';
    card.style.top  = snappedTop  + 'px';
  });
}

// ---- Animation helpers ----
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function snapDuration(fromW, fromH, toW, toH, fromL, fromT, toL, toT) {
  const { GRID_SIZE } = getGridVars();
  const dWCells = Math.abs(toW - fromW) / GRID_SIZE;
  const dHCells = Math.abs(toH - fromH) / GRID_SIZE;
  const dXCells = Math.abs(toL - fromL) / GRID_SIZE;
  const dYCells = Math.abs(toT - fromT) / GRID_SIZE;
  const distCells = Math.hypot(dWCells + dXCells, dHCells + dYCells);
  const minS = 0.18, maxS = 0.55, stepPerCell = 0.06;
  const dur = Math.min(maxS, Math.max(minS, minS + distCells * stepPerCell));
  return `${dur.toFixed(2)}s`;
}

export function animateSnapTo(card, { left, top, width, height }, onDone) {
  if (prefersReducedMotion()) {
    card.style.left   = left + 'px';
    card.style.top    = top + 'px';
    card.style.width  = width + 'px';
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
  const easeWH = 'cubic-bezier(0.22,1,0.36,1)';
  const easePos = 'ease';
  card.style.transition =
    `left ${dur} ${easePos}, top ${dur} ${easePos}, width ${dur} ${easeWH}, height ${dur} ${easeWH}`;
  card.style.left   = left + 'px';
  card.style.top    = top  + 'px';
  card.style.width  = width + 'px';
  card.style.height = height + 'px';

  const cleanup = () => {
    card.style.transition = '';
    card.removeEventListener('transitionend', onEnd);
    onDone?.();
  };
  const endedProps = new Set();
  const onEnd = (e) => {
    if (e.target !== card) return;
    endedProps.add(e.propertyName);
    if (endedProps.has('width') && endedProps.has('height')) cleanup();
  };
  card.addEventListener('transitionend', onEnd);
  setTimeout(cleanup, parseFloat(dur) * 1000 + 60);
}

// ---- Rects / layout in cells ----
export function rectsIntersect(a, b) {
  return !(a.col + a.w <= b.col ||
           b.col + b.w <= a.col ||
           a.row + a.h <= b.row ||
           b.row + b.h <= a.row);
}
export function rectWithinBounds(rect, bounds) {
  return rect.col >= 0 && rect.row >= 0 &&
         rect.col + rect.w <= bounds.cols &&
         rect.row + rect.h <= bounds.rows;
}
export function presetCells(key) {
  const p = PRESETS[key];
  return { w: p.w, h: p.h };
}

export function getCardRectCells(card) {
  const { GRID_OFFSET_X, GRID_OFFSET_Y } = getGridVars();
  const leftPx  = parseFloat(card.style.left)  || GRID_OFFSET_X;
  const topPx   = parseFloat(card.style.top)   || GRID_OFFSET_Y;

  const key = card.dataset.preset;
  let wCells, hCells;
  if (key && PRESETS[key]) {
    ({ w: wCells, h: hCells } = presetCells(key));
  } else {
    const { GRID_SIZE } = getGridVars();
    const wPx = parseFloat(card.style.width)  || card.offsetWidth;
    const hPx = parseFloat(card.style.height) || card.offsetHeight;
    wCells = Math.max(1, Math.round((wPx + EPS) / GRID_SIZE));
    hCells = Math.max(1, Math.round((hPx + EPS) / GRID_SIZE));
  }

  const col = pxToCol(leftPx);
  const row = pxToRow(topPx);
  return { col, row, w: wCells, h: hCells };
}

export function getLayoutCells() {
  const map = {};
  document.querySelectorAll('.module-card').forEach(c => {
    const id = c.getAttribute('data-id');
    map[id] = getCardRectCells(c);
  });
  return map;
}

export function cloneLayout(layout) {
  const copy = {};
  for (const [id, r] of Object.entries(layout)) copy[id] = { ...r };
  return copy;
}

export function animateToCellRect(card, rectCells, onDone) {
  const leftPx   = colToPx(rectCells.col);
  const topPx    = rowToPx(rectCells.row);
  const widthPx  = rectCells.w * getGridVars().GRID_SIZE;
  const heightPx = rectCells.h * getGridVars().GRID_SIZE;
  animateSnapTo(card, { left: leftPx, top: topPx, width: widthPx, height: heightPx }, onDone);
}

export const overlapsAny = (rect, layout, exceptId = null) =>
  Object.entries(layout).some(([id, r]) => (id !== exceptId) && rectsIntersect(rect, r));

// Minimal “just enough” push
export function pushToTouch(a, b, dir) {
  if (dir === 'right') {
    const dx = (a.col + a.w) - b.col;
    return { ...b, col: b.col + Math.max(1, dx) };
  }
  if (dir === 'left') {
    const dx = (b.col + b.w) - a.col;
    return { ...b, col: b.col - Math.max(1, dx) };
  }
  if (dir === 'down') {
    const dy = (a.row + a.h) - b.row;
    return { ...b, row: b.row + Math.max(1, dy) };
  }
  const dy = (b.row + b.h) - a.row; // up
  return { ...b, row: b.row - Math.max(1, dy) };
}

export function findSlideSpot(rect, dir, layout, bounds, maxSteps = 200) {
  const step = (r) => {
    if (dir === 'right') return { ...r, col: r.col + 1 };
    if (dir === 'left')  return { ...r, col: r.col - 1 };
    if (dir === 'down')  return { ...r, row: r.row + 1 };
    return { ...r, row: r.row - 1 }; // up
  };
  let probe = { ...rect };
  for (let i = 0; i < maxSteps; i++) {
    if (rectWithinBounds(probe, bounds) && !overlapsAny(probe, layout)) return probe;
    probe = step(probe);
  }
  return null;
}

// Main solver
export function shove(layout, activeId, targetRect, bounds, visited = new Set(), pushOrder = ['right','down','left','up']) {
  layout[activeId] = { ...targetRect };

  const blockers = Object.entries(layout)
    .filter(([id]) => id !== activeId)
    .filter(([, r]) => rectsIntersect(layout[activeId], r));

  if (blockers.length === 0) return true;

  for (const [blockerId, blockerRect] of blockers) {
    // Prevent exact-state cycles, but allow re-moving the same card if state changed
    const vKey = `${blockerId}:${blockerRect.col},${blockerRect.row}`;
    if (visited.has(vKey)) return false;
    visited.add(vKey);

    let moved = false;

    // 1) Minimal push first
    for (const dir of pushOrder) {
      const candidate = pushToTouch(layout[activeId], blockerRect, dir);
      if (!rectWithinBounds(candidate, bounds)) continue;

      const snapshot = layout[blockerId];
      layout[blockerId] = candidate;

      if (shove(layout, activeId, layout[activeId], bounds, visited, pushOrder)) {
        moved = true;
        break;
      }
      layout[blockerId] = snapshot;
    }

    // 2) Fallback: slide farther until it fits
    if (!moved) {
      for (const dir of pushOrder) {
        const spot = findSlideSpot(blockerRect, dir, layout, bounds);
        if (!spot) continue;

        const snapshot = layout[blockerId];
        layout[blockerId] = spot;

        if (shove(layout, activeId, layout[activeId], bounds, visited, pushOrder)) {
          moved = true;
          break;
        }
        layout[blockerId] = snapshot;
      }
    }

    if (!moved) return false;
  }

  return true;
}
