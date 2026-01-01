// Event handlers

import { getCanvas, getBody, getIsTouchDevice, resizeCanvas } from '../core/canvas.js';
import { resetUITimer } from '../ui/ui-timer.js';
import { closeMobileMenu } from '../ui/mobile-menu.js';
import { setMode, initMode } from '../core/animation.js';

const canvas = getCanvas();
const body = getBody();
const isTouchDevice = getIsTouchDevice();
let lastMouseY = 0;

export function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

export function initEventHandlers() {
    // Resize handlers
    window.addEventListener('resize', () => {
        resizeCanvas();
        initMode();
    });
    
    window.addEventListener('orientationchange', () => {
        // Delay to ensure viewport has updated
        setTimeout(() => {
            resizeCanvas();
            initMode();
        }, 100);
    });
    
    // Mouse move handler
    window.addEventListener('mousemove', (e) => {
        resetUITimer();
        lastMouseY = e.clientY;
        
        // Show UI when mouse moves near top of screen (within 120px) on desktop/tablet
        if (!isTouchDevice) {
            if (e.clientY < 120 && body.classList.contains('hide-ui')) {
                body.classList.add('show-ui-on-hover');
            } else if (e.clientY > 180) {
                body.classList.remove('show-ui-on-hover');
            }
        }
    });
    
    // UI container hover handlers (desktop/tablet only)
    if (!isTouchDevice) {
        const uiContainer = document.getElementById('ui-container');
        if (uiContainer) {
            uiContainer.addEventListener('mouseenter', () => {
                if (body.classList.contains('hide-ui')) {
                    body.classList.add('show-ui-on-hover');
                }
            });
            
            uiContainer.addEventListener('mouseleave', () => {
                // Only remove if mouse moves away from top area
                if (lastMouseY > 180) {
                    body.classList.remove('show-ui-on-hover');
                }
            });
        }
    }
    
    // Touch handlers
    window.addEventListener('touchstart', (e) => {
        // Don't reset timer if touching mobile menu (but allow if menu is closed)
        const mobileMenu = document.getElementById('mobileMenu');
        const isMenuOpen = mobileMenu && mobileMenu.classList.contains('show');
        
        if (!isMenuOpen && !e.target.closest('#mobileMenuBtn')) {
            resetUITimer();
        } else if (!e.target.closest('#mobileMenu') && !e.target.closest('#mobileMenuBtn')) {
            // If menu is open and clicking outside, close it and reset timer
            closeMobileMenu();
            resetUITimer();
        }
    });
    
    // Canvas interaction handlers
    canvas.addEventListener('click', (e) => {
        if (isTouchDevice) {
            resetUITimer();
        }
    });
    
    canvas.addEventListener('touchstart', (e) => {
        if (isTouchDevice && !e.target.closest('#mobileMenu') && !e.target.closest('#mobileMenuBtn')) {
            resetUITimer();
        }
    });
    
    // Keyboard handlers
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'f') {
            toggleFullscreen();
        }
        if (e.code === 'Space') {
            setMode('color', '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
        }
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

