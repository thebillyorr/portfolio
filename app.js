// Grid and DOM constants
const root = document.documentElement;
const playground = document.getElementById('playground');

// Initialize grid settings and boundaries from CSS variables
function initializeGridSettings() {
    GRID_SIZE = readNumberVar('--grid-size');
    
    // Get offsets and boundaries from playground
    const cs = getComputedStyle(playground);
    GRID_OFFSET_X = parseFloat(cs.paddingLeft) || 0;
    GRID_OFFSET_Y = parseFloat(cs.paddingTop) || 0;
    
    // Calculate playground boundaries (content box)
    const playgroundRect = playground.getBoundingClientRect();
    const maxRight = playgroundRect.width - GRID_OFFSET_X; // Subtract right padding
    const maxBottom = playgroundRect.height - GRID_OFFSET_Y; // Subtract bottom padding
    
    console.log('Grid settings initialized:', {
        GRID_SIZE,
        GRID_OFFSET_X,
        GRID_OFFSET_Y,
        bounds: {
            left: GRID_OFFSET_X,
            top: GRID_OFFSET_Y,
            right: maxRight,
            bottom: maxBottom
        }
    });
    
    return {
        left: GRID_OFFSET_X,
        top: GRID_OFFSET_Y,
        right: maxRight,
        bottom: maxBottom
    };
}

// Create a card when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeGridSettings();
});

// Grid settings
let GRID_SIZE = 0;
let GRID_OFFSET_X = 0;
let GRID_OFFSET_Y = 0;
let GRID_PHASE_X = 0;
let GRID_PHASE_Y = 0;

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

// Utility functions
const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

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

function readNumberVar(name) {
    return parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;
}

function syncGridOriginToPadding() {
    const cs = getComputedStyle(playground);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padT = parseFloat(cs.paddingTop) || 0;
    root.style.setProperty('--grid-offset-x', padL + 'px');
    root.style.setProperty('--grid-offset-y', padT + 'px');
    GRID_OFFSET_X = padL;
    GRID_OFFSET_Y = padT;
}

// Drag functionality
function attachDrag(card) {
    console.log('Attaching drag handlers to card:', card);
    let dragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    card.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.resizable-handle')) return;

        dragging = true;
        
        // Store initial pointer position
        startX = e.clientX;
        startY = e.clientY;
        
        // Store current card position
        const computedStyle = getComputedStyle(card);
        startLeft = parseFloat(computedStyle.left);
        startTop = parseFloat(computedStyle.top);
        
        console.log('Starting position:', {
            rawComputedLeft: computedStyle.left,
            rawComputedTop: computedStyle.top,
            parsedLeft: startLeft,
            parsedTop: startTop
        });

        console.log('Start drag:', {
            pointer: { x: startX, y: startY },
            cardPos: { left: startLeft, top: startTop }
        });

        card.classList.add('dragging');
        card.setPointerCapture(e.pointerId);
        e.preventDefault();
    });

    card.addEventListener('pointermove', (e) => {
        if (!dragging) return;

        // Calculate the delta from start position
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Calculate new position
        const bounds = initializeGridSettings(); // Get current boundaries
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;

        // Calculate new position with bounds checking
        const newLeft = clamp(
            startLeft + dx,
            bounds.left, // Min X (left padding)
            bounds.right - cardWidth // Max X (right edge - card width)
        );
        const newTop = clamp(
            startTop + dy,
            bounds.top, // Min Y (top padding)
            bounds.bottom - cardHeight // Max Y (bottom edge - card height)
        );

        // During drag, move smoothly without snapping
        card.style.left = `${newLeft}px`;
        card.style.top = `${newTop}px`;

        console.log('Movement:', {
            delta: { x: dx, y: dy },
            position: { x: newLeft, y: newTop },
            bounds
        });
    });

    card.addEventListener('pointerup', (e) => {
        if (!dragging) return;
        dragging = false;

        // Get current position and boundaries
        const currentLeft = parseFloat(card.style.left);
        const currentTop = parseFloat(card.style.top);
        const bounds = initializeGridSettings();
        const cardRect = card.getBoundingClientRect();

        // Snap to grid while respecting boundaries
        const snappedLeft = clamp(
            snapToGrid(currentLeft, GRID_OFFSET_X, 0, GRID_SIZE),
            bounds.left,
            bounds.right - cardRect.width
        );
        const snappedTop = clamp(
            snapToGrid(currentTop, GRID_OFFSET_Y, 0, GRID_SIZE),
            bounds.top,
            bounds.bottom - cardRect.height
        );

        console.log('Snapping:', {
            from: { x: currentLeft, y: currentTop },
            to: { x: snappedLeft, y: snappedTop },
            bounds,
            grid: { size: GRID_SIZE, offsetX: GRID_OFFSET_X, offsetY: GRID_OFFSET_Y }
        });

        // Animate to snapped position
        card.style.transition = 'left 0.2s, top 0.2s';
        card.style.left = `${snappedLeft}px`;
        card.style.top = `${snappedTop}px`;
        
        // Reset transition after animation
        setTimeout(() => {
            card.style.transition = '';
        }, 200);

        card.classList.remove('dragging');
        card.releasePointerCapture(e.pointerId);
        persistLayout(card);
        e.preventDefault();
    });

    card.addEventListener('pointercancel', (e) => {
        if (dragging) {
            dragging = false;
            card.classList.remove('dragging');
            card.releasePointerCapture(e.pointerId);
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
        const wSnap = Math.max(MIN_W, Math.min(snapToGrid(wRaw, 0, 0, GRID_SIZE), MAX_W));
        const hSnap = Math.max(MIN_H, Math.min(snapToGrid(hRaw, 0, 0, GRID_SIZE), MAX_H));
        card.style.width = wSnap + 'px';
        card.style.height = hSnap + 'px';

        persistLayout(card);
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
        height: parseInt(card.style.height)
    };
    
    localStorage.setItem(STORAGE_KEYS.layout, JSON.stringify(layouts));
}

// Initialization
// Grid and Layout functions
function syncGridConstants() {
    GRID_SIZE = readNumberVar('--grid-size');
    GRID_PHASE_X = readNumberVar('--grid-phase-x');
    GRID_PHASE_Y = readNumberVar('--grid-phase-y');

    // Use the content origin: padding-left/top define the draggable area
    const cs = getComputedStyle(playground);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padT = parseFloat(cs.paddingTop) || 0;

    GRID_OFFSET_X = padL;
    GRID_OFFSET_Y = padT;

    // Expose to CSS so the background dots start at exactly the same origin + phase
    root.style.setProperty('--grid-offset-x', GRID_OFFSET_X + 'px');
    root.style.setProperty('--grid-offset-y', GRID_OFFSET_Y + 'px');
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();
    
    // Initialize grid constants - use explicit numbers
    GRID_SIZE = 40;
    GRID_OFFSET_X = 32;
    GRID_OFFSET_Y = 32;
    GRID_PHASE_X = 0;
    GRID_PHASE_Y = 0;
    
    console.log('Grid constants initialized:', {
        GRID_SIZE,
        GRID_OFFSET_X,
        GRID_OFFSET_Y,
        GRID_PHASE_X,
        GRID_PHASE_Y
    });
    
    // Create single test card
    const card = createModule({
        id: 'sample',
        title: 'My Universe',
        proof: 'click to expand'
    });
    
    // Position card in desktop mode
    if (!isMobile()) {
        Object.assign(card.style, {
            left: `${GRID_OFFSET_X + GRID_SIZE}px`,
            top: `${GRID_OFFSET_Y + GRID_SIZE}px`,
            width: '320px',
            height: '240px'
        });
        
        // Attach drag and resize handlers
        attachDrag(card);
        attachResize(card, card.querySelector('.resizable-handle'));
    }
    
    playground.appendChild(card);
    
    // Wire up event listeners
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
    document.querySelector('.dialog-close').addEventListener('click', closeDialog);
    document.querySelector('.dialog-backdrop').addEventListener('click', closeDialog);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDialog();
    });
});