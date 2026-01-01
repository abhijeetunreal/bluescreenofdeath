// Main entry point - initializes the application

import { getCanvas, resizeCanvas } from './core/canvas.js';
import { animate, setMode, initMode } from './core/animation.js';
import { resetUITimer } from './ui/ui-timer.js';
import { toggleMobileMenu, closeMobileMenu } from './ui/mobile-menu.js';
import { initDropdowns } from './ui/dropdowns.js';
import { initEventHandlers, toggleFullscreen } from './events/handlers.js';

// Make functions available globally for HTML onclick handlers
window.setMode = setMode;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleFullscreen = toggleFullscreen;

// Initialize canvas
resizeCanvas();

// Initialize mode
initMode();

// Start animation loop
animate();

// Initialize UI timer
resetUITimer();

// Initialize dropdowns
initDropdowns();

// Initialize event handlers
initEventHandlers();

