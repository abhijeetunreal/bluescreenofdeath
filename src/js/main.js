// Main entry point - initializes the application

import { getCanvas, resizeCanvas } from './core/canvas.js';
import { animate, setMode, initMode } from './core/animation.js';
import { resetUITimer } from './ui/ui-timer.js';
import { toggleMobileMenu, closeMobileMenu, handleMobileMenuItemClick, initMobileMenuHandlers } from './ui/mobile-menu.js';
import { buildMenus } from './ui/menu-builder.js';
import { initDropdowns } from './ui/dropdowns.js';
import { initEventHandlers, toggleFullscreen } from './events/handlers.js';
import { initHomeOverlay, showHomeOverlay, showHomePage, showCanvasView } from './ui/home-overlay.js';
import { initGameScreensaver, toggleGameScreensaver } from './ui/game-screensaver.js';
import { initRandomScreensaver, stopRandomScreensaver, isRandomScreensaverRunning } from './ui/random-screensaver.js';

// Make functions available globally for HTML onclick handlers
window.setMode = setMode;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.handleMobileMenuItemClick = handleMobileMenuItemClick;
window.toggleFullscreen = toggleFullscreen;
window.showHomeOverlay = showHomeOverlay;
window.showHomePage = showHomePage;
window.showCanvasView = showCanvasView;
window.toggleGameScreensaver = toggleGameScreensaver;
window.stopRandomScreensaver = stopRandomScreensaver;
window.isRandomScreensaverRunning = isRandomScreensaverRunning;

// Initialize canvas
resizeCanvas();

// Initialize mode
initMode();

// Start animation loop
animate();

// Initialize UI timer
resetUITimer();

// Build desktop and mobile menus from registry, then init dropdown behavior
buildMenus();
initDropdowns();

// Initialize event handlers
initEventHandlers();

// Initialize home overlay (shows on first visit)
initHomeOverlay();

// Initialize game screensaver
initGameScreensaver();

// Initialize random screensaver
initRandomScreensaver();

// Initialize mobile menu handlers (fixes double-click issue)
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initMobileMenuHandlers, 100);
    });
} else {
    setTimeout(initMobileMenuHandlers, 100);
}

