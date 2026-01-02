// Home overlay functions

import { getBody } from '../core/canvas.js';
import { resetUITimer } from './ui-timer.js';

const body = getBody();
const STORAGE_KEY = 'bluescreen_home_shown';

export function showHomeOverlay() {
    const overlay = document.getElementById('homeOverlay');
    if (!overlay) {
        console.warn('Home overlay element not found');
        return;
    }
    
    overlay.classList.add('show');
    body.classList.add('home-overlay-open');
    body.style.overflow = 'hidden';
    resetUITimer();
}

export function hideHomeOverlay() {
    const overlay = document.getElementById('homeOverlay');
    if (!overlay) {
        console.warn('Home overlay element not found');
        return;
    }
    
    overlay.classList.remove('show');
    body.classList.remove('home-overlay-open');
    body.style.overflow = '';
    
    // Mark as shown in localStorage
    try {
        localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
        console.warn('Failed to save home overlay state:', e);
    }
}

export function initHomeOverlay() {
    // Check if this is the first visit
    try {
        const hasShown = localStorage.getItem(STORAGE_KEY);
        if (!hasShown) {
            // Show overlay on first visit after a short delay
            setTimeout(() => {
                showHomeOverlay();
            }, 300);
        }
    } catch (e) {
        console.warn('Failed to check home overlay state:', e);
    }
    
    // Set up close button handlers
    const closeBtn = document.getElementById('homeOverlayClose');
    const getStartedBtn = document.getElementById('homeOverlayGetStarted');
    const overlay = document.getElementById('homeOverlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideHomeOverlay);
    }
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', hideHomeOverlay);
    }
    
    // Close on overlay background click
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideHomeOverlay();
            }
        });
    }
}

