// Home page navigation functions

import { getBody } from '../core/canvas.js';
import { getCategories, getModesForCategory } from '../config/mode-registry.js';
import { resetUITimer } from './ui-timer.js';

const body = getBody();
const STORAGE_KEY = 'bluescreen_home_shown';

export function showHomePage() {
    const homePage = document.getElementById('homePage');
    const canvas = document.getElementById('colorCanvas');
    const uiContainer = document.getElementById('ui-container');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (homePage) {
        homePage.style.display = 'block';
    }
    
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    if (uiContainer) {
        uiContainer.style.display = 'none';
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.style.display = 'none';
    }
    
    body.classList.add('home-view');
    body.classList.remove('canvas-view');
    body.style.overflow = 'auto';
}

export function showCanvasView() {
    const homePage = document.getElementById('homePage');
    const canvas = document.getElementById('colorCanvas');
    const uiContainer = document.getElementById('ui-container');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (homePage) {
        homePage.style.display = 'none';
    }
    
    if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
    if (uiContainer) {
        uiContainer.style.display = '';
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.style.display = '';
    }
    
    body.classList.remove('home-view');
    body.classList.add('canvas-view');
    body.style.overflow = 'hidden';
    resetUITimer();
}

// Make showCanvasView available globally
window.showCanvasView = showCanvasView;

export function showHomeOverlay() {
    // Legacy function for compatibility - now shows home page
    showHomePage();
}

export function hideHomeOverlay() {
    // Legacy function for compatibility - now shows canvas view
    showCanvasView();
}

function showCategoryModes(categoryId) {
    const modesList = getModesForCategory(categoryId);
    if (!modesList || modesList.length === 0) return;
    const modes = modesList.map(m => ({ mode: m.id, name: m.label }));
    const categories = getCategories();
    const categoryLabel = (categories.find(c => c.id === categoryId) || {}).label || categoryId;
    
    // Remove any existing modal first
    const existingModal = document.querySelector('.category-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'category-modal';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.2s ease';

    const modalContent = document.createElement('div');
    modalContent.className = 'category-modal-content';
    modalContent.style.maxWidth = '28rem';
    modalContent.style.width = '100%';
    modalContent.style.maxHeight = '80vh';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-4';

    const title = document.createElement('h2');
    title.className = 'text-lg font-semibold text-[var(--color-text)] m-0';
    title.textContent = categoryLabel;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'category-modal-close w-8 h-8 flex items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] cursor-pointer text-xl leading-none hover:bg-[var(--color-hover)]';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close');

    header.appendChild(title);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);

    const modesGrid = document.createElement('div');
    modesGrid.className = 'category-modes-grid grid gap-2';
    modesGrid.style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))';
    
    // Responsive grid - update on resize
    const updateGrid = () => {
        if (window.innerWidth >= 640) {
            modesGrid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
        } else {
            modesGrid.style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))';
        }
    };
    
    updateGrid();
    window.addEventListener('resize', updateGrid);
    
    // Clean up resize listener when modal closes
    const cleanup = () => {
        window.removeEventListener('resize', updateGrid);
    };
    
    const originalCloseHandler = () => {
        cleanup();
        if (modal.parentNode) {
            document.body.removeChild(modal);
        }
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', originalCloseHandler);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cleanup();
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
                document.body.style.overflow = '';
            }, 300);
        }
    });
    
    modes.forEach(({ mode, name }) => {
        const modeBtn = document.createElement('button');
        modeBtn.className = 'category-modal-button w-full text-left py-2 px-3 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm cursor-pointer hover:bg-[var(--color-hover)]';
        modeBtn.textContent = name;

        modeBtn.addEventListener('click', () => {
            cleanup();
            if (window.setMode) {
                window.setMode(mode, null, null);
            }
            showCanvasView();
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
                document.body.style.overflow = '';
            }, 300);
        });
        modesGrid.appendChild(modeBtn);
    });
    
    modalContent.appendChild(modesGrid);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });
}

export function initHomeOverlay() {
    // Initialize home page state on load
    // Show home page by default unless URL has a mode parameter
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode')) {
            // If mode is specified in URL, show canvas view
            showCanvasView();
        } else {
            // Otherwise show home page
            showHomePage();
        }
    } catch (e) {
        console.warn('Failed to initialize home state:', e);
        showHomePage();
    }
    
    // Set up category card click handlers
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            if (category) {
                showCategoryModes(category);
            }
        });
    });
    
    // Update Home button to show home page
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showHomePage();
        });
        // Override onclick
        homeBtn.setAttribute('onclick', 'showHomePage()');
    }
}

