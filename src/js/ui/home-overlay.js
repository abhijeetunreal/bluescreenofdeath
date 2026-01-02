// Home page navigation functions

import { getBody } from '../core/canvas.js';
import { resetUITimer } from './ui-timer.js';

const body = getBody();
const STORAGE_KEY = 'bluescreen_home_shown';

// Category to modes mapping
const CATEGORY_MODES = {
    windows: [
        { mode: 'win_xp_upd', name: 'Windows XP Update' },
        { mode: 'win_10_bsod_enhanced', name: 'Windows 10 BSOD' },
        { mode: 'win_xp_bsod', name: 'Windows XP BSOD' },
        { mode: 'win_bios', name: 'BIOS Boot' },
        { mode: 'win_11_loading', name: 'Windows 11 Loading' },
        { mode: 'win_ransomware', name: 'Windows Security Alert' }
    ],
    apple: [
        { mode: 'macos_drift', name: 'macOS Drift' },
        { mode: 'macos_hello', name: 'macOS Hello' },
        { mode: 'macos_boot', name: 'macOS Boot' },
        { mode: 'macos_panic', name: 'Kernel Panic' },
        { mode: 'ios_update', name: 'iOS Update' },
        { mode: 'ios_disabled', name: 'iPhone Disabled' }
    ],
    games: [
        { mode: 'tetris', name: 'Tetris Horizon Engine' },
        { mode: 'snake', name: 'Snake Engine Simulation' },
        { mode: 'pacman', name: 'Pac-Man Engine - Turbo Edition' },
        { mode: 'mario', name: 'Super Mario Engine - Auto Simulation' },
        { mode: 'flap', name: 'Neon Flap - Full Width Engine' },
        { mode: 'neon_vector', name: 'Neon Vector - Space Engine' },
        { mode: 'neon_boids', name: 'Neon Boids - Morphological Evolution' },
        { mode: 'chess', name: 'Chess Pro - AI & Multiplayer Edition' },
        { mode: 'circular_maze', name: 'Infinite Circular Maze - Neural Engine' },
        { mode: 'maze', name: 'Infinite Maze - High Performance Engine' },
        { mode: 'neon_ecosystem', name: '3D Neon Ecosystem - Fixed' }
    ],
    pranks: [
        { mode: 'broken_screen', name: 'Broken Screen' },
        { mode: 'white_noise', name: 'White Noise' },
        { mode: 'radar', name: 'Radar Screen' },
        { mode: 'hacker', name: 'Hacker Typer' },
        { mode: 'no_signal', name: 'No Signal' }
    ],
    more: [
        { mode: 'ubuntu', name: 'Ubuntu 22.04' },
        { mode: 'chromeos', name: 'Chrome OS' },
        { mode: 'matrix', name: 'Matrix Rain' },
        { mode: 'dvd', name: 'DVD Bouncing' },
        { mode: 'flip_clock', name: 'Flip Clock' },
        { mode: 'quotes', name: 'Quotes' }
    ]
};

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

function showCategoryModes(category) {
    const modes = CATEGORY_MODES[category];
    if (!modes) return;
    
    // Remove any existing modal first
    const existingModal = document.querySelector('.category-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal overlay for mode selection
    const modal = document.createElement('div');
    modal.className = 'category-modal';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 3000; background: rgba(139, 69, 19, 0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1rem; opacity: 0; transition: opacity 0.3s ease-in-out;';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'category-modal-content';
    modalContent.style.cssText = 'background: linear-gradient(135deg, rgba(255, 248, 220, 0.98) 0%, rgba(255, 215, 0, 0.2) 100%); border: 4px solid rgba(139, 69, 19, 0.7); border-radius: 1.5rem; padding: 1.5rem 2rem; max-width: 42rem; width: 100%; max-height: 80vh; overflow-y: auto; box-shadow: 0 12px 32px rgba(139, 69, 19, 0.5); position: relative;';
    
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-6';
    header.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;';
    
    const title = document.createElement('h2');
    title.className = 'tom-jerry-heading';
    title.style.cssText = 'font-size: 1.875rem; font-weight: 700; color: #8B4513; text-shadow: 2px 2px 0px rgba(255, 215, 0, 0.6); font-family: "Comic Sans MS", "Comic Sans", "Chalkboard SE", "Comic Neue", cursive; margin: 0;';
    title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'category-modal-close';
    closeBtn.style.cssText = 'width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; background: rgba(139, 69, 19, 0.2); border: 2px solid rgba(139, 69, 19, 0.5); border-radius: 50%; color: #8B4513; cursor: pointer; transition: all 0.2s ease; font-size: 1.5rem; line-height: 1;';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close');
    
    // Close button hover
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 107, 53, 0.3)';
        closeBtn.style.borderColor = 'rgba(255, 107, 53, 0.7)';
        closeBtn.style.transform = 'scale(1.1)';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(139, 69, 19, 0.2)';
        closeBtn.style.borderColor = 'rgba(139, 69, 19, 0.5)';
        closeBtn.style.transform = 'scale(1)';
    });
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);
    
    const modesGrid = document.createElement('div');
    modesGrid.className = 'category-modes-grid';
    modesGrid.style.cssText = 'display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 0.75rem;';
    
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
        modeBtn.className = 'category-modal-button';
        modeBtn.style.cssText = 'background: linear-gradient(135deg, rgba(255, 248, 220, 0.9) 0%, rgba(255, 215, 0, 0.15) 100%); border: 2px solid rgba(139, 69, 19, 0.4); border-radius: 0.75rem; padding: 1rem; text-align: left; color: #8B4513; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: "Comic Sans MS", "Comic Sans", "Chalkboard SE", "Comic Neue", cursive;';
        modeBtn.textContent = name;
        
        // Button hover effects
        modeBtn.addEventListener('mouseenter', () => {
            modeBtn.style.background = 'linear-gradient(135deg, rgba(255, 248, 220, 1) 0%, rgba(255, 215, 0, 0.3) 100%)';
            modeBtn.style.borderColor = 'rgba(255, 107, 53, 0.6)';
            modeBtn.style.transform = 'translateX(5px)';
            modeBtn.style.boxShadow = '0 4px 8px rgba(139, 69, 19, 0.3)';
        });
        modeBtn.addEventListener('mouseleave', () => {
            modeBtn.style.background = 'linear-gradient(135deg, rgba(255, 248, 220, 0.9) 0%, rgba(255, 215, 0, 0.15) 100%)';
            modeBtn.style.borderColor = 'rgba(139, 69, 19, 0.4)';
            modeBtn.style.transform = 'translateX(0)';
            modeBtn.style.boxShadow = 'none';
        });
        
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

