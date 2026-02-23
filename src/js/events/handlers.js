// Event handlers

import { getCanvas, getBody, getIsTouchDevice, resizeCanvas } from '../core/canvas.js';
import { resetUITimer } from '../ui/ui-timer.js';
import { closeMobileMenu } from '../ui/mobile-menu.js';
import { setMode, initMode } from '../core/animation.js';

const canvas = getCanvas();
const body = getBody();
const isTouchDevice = getIsTouchDevice();
let abortController = null;
let orientationTimeout = null;
let lastTapTime = 0;
const DOUBLE_TAP_THRESHOLD = 300; // milliseconds

// Get fullscreen API with browser prefix support
function getFullscreenAPI() {
    const doc = document.documentElement;
    if (doc.requestFullscreen) {
        return {
            request: () => doc.requestFullscreen(),
            exit: () => document.exitFullscreen(),
            element: () => document.fullscreenElement,
            change: 'fullscreenchange',
            error: 'fullscreenerror'
        };
    } else if (doc.webkitRequestFullscreen) {
        return {
            request: () => doc.webkitRequestFullscreen(),
            exit: () => document.webkitExitFullscreen(),
            element: () => document.webkitFullscreenElement,
            change: 'webkitfullscreenchange',
            error: 'webkitfullscreenerror'
        };
    } else if (doc.mozRequestFullScreen) {
        return {
            request: () => doc.mozRequestFullScreen(),
            exit: () => document.mozCancelFullScreen(),
            element: () => document.mozFullScreenElement,
            change: 'mozfullscreenchange',
            error: 'mozfullscreenerror'
        };
    } else if (doc.msRequestFullscreen) {
        return {
            request: () => doc.msRequestFullscreen(),
            exit: () => document.msExitFullscreen(),
            element: () => document.msFullscreenElement,
            change: 'msfullscreenchange',
            error: 'msfullscreenerror'
        };
    }
    return null;
}

export function toggleFullscreen() {
    const fsAPI = getFullscreenAPI();
    if (!fsAPI) {
        console.warn('Fullscreen API not supported');
        return;
    }
    
    try {
        if (!fsAPI.element()) {
            fsAPI.request().catch(err => {
                console.warn('Failed to enter fullscreen:', err);
            });
        } else {
            fsAPI.exit().catch(err => {
                console.warn('Failed to exit fullscreen:', err);
            });
        }
    } catch (error) {
        console.warn('Fullscreen operation failed:', error);
    }
}

export function initEventHandlers() {
    // Cleanup existing handlers if any
    cleanupEventHandlers();
    
    // Create new AbortController for this set of handlers
    abortController = new AbortController();
    const signal = abortController.signal;
    
    // Resize handlers
    window.addEventListener('resize', () => {
        resizeCanvas();
        initMode();
    }, { signal });
    
    window.addEventListener('orientationchange', () => {
        // Clear any existing timeout
        if (orientationTimeout) {
            clearTimeout(orientationTimeout);
        }
        // Delay to ensure viewport has updated
        orientationTimeout = setTimeout(() => {
            resizeCanvas();
            initMode();
            orientationTimeout = null;
        }, 100);
    }, { signal });
    
    // Mouse move – no hover show/hide; UI bar stays visible
    window.addEventListener('mousemove', () => {
        resetUITimer();
    }, { signal });
    
    // Consolidated touch handler with double tap detection
    window.addEventListener('touchstart', (e) => {
        // Don't reset timer if touching mobile menu (but allow if menu is closed)
        const mobileMenu = document.getElementById('mobileMenu');
        const isMenuOpen = mobileMenu && mobileMenu.classList.contains('show');
        
        // Check if this is a double tap (within 300ms of last tap)
        const currentTime = Date.now();
        const timeSinceLastTap = currentTime - lastTapTime;
        const isDoubleTap = timeSinceLastTap < DOUBLE_TAP_THRESHOLD && timeSinceLastTap > 0;
        
        // Update last tap time
        lastTapTime = currentTime;
        
        // Only show UI on double tap (not single tap)
        if (isDoubleTap) {
            if (!isMenuOpen && !e.target.closest('#mobileMenuBtn')) {
                resetUITimer();
            } else if (!e.target.closest('#mobileMenu') && !e.target.closest('#mobileMenuBtn')) {
                // If menu is open and clicking outside, close it and reset timer
                closeMobileMenu();
                resetUITimer();
            }
        }
    }, { signal });
    
    // Canvas interaction handlers (double tap for mobile)
    if (canvas) {
        canvas.addEventListener('click', (e) => {
            if (isTouchDevice) {
                // Double tap detection for canvas clicks
                const currentTime = Date.now();
                const timeSinceLastTap = currentTime - lastTapTime;
                const isDoubleTap = timeSinceLastTap < DOUBLE_TAP_THRESHOLD && timeSinceLastTap > 0;
                
                if (isDoubleTap) {
                    resetUITimer();
                }
                
                lastTapTime = currentTime;
            }
        }, { signal });
    }
    
    // Keyboard handlers
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'f') {
            toggleFullscreen();
        }
        if (e.code === 'Space') {
            setMode('color', '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
        }
        if (e.key === 'Escape') {
            if (body.classList.contains('ui-bar-hidden')) {
                body.classList.remove('ui-bar-hidden');
            } else {
                closeMobileMenu();
            }
        }
    }, { signal });
}

export function cleanupEventHandlers() {
    // Abort all event listeners
    if (abortController) {
        abortController.abort();
        abortController = null;
    }
    
    // Clear orientation timeout
    if (orientationTimeout) {
        clearTimeout(orientationTimeout);
        orientationTimeout = null;
    }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanupEventHandlers);
}

