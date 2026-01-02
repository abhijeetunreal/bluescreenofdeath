// Mobile menu functions

import { getBody } from '../core/canvas.js';
import { resetUITimer } from './ui-timer.js';

const body = getBody();

export function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');
    
    if (!menu || !overlay || !menuBtn) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    const isOpen = menu.classList.contains('show');
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

export function openMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');
    
    if (menu && overlay && menuBtn) {
        menu.classList.add('show');
        overlay.classList.add('show');
        menuBtn.classList.add('active');
        body.classList.add('mobile-menu-open');
        body.style.overflow = 'hidden';
        resetUITimer();
    }
}

export function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');
    
    if (menu && overlay && menuBtn) {
        menu.classList.remove('show');
        overlay.classList.remove('show');
        menuBtn.classList.remove('active');
        body.classList.remove('mobile-menu-open');
        body.style.overflow = '';
    }
}

/**
 * Handle mobile menu item click - ensures mode is set before closing menu
 * @param {string} mode - The mode to set
 * @param {string|null} val - Optional value (e.g., color)
 * @param {HTMLElement} el - The clicked element
 */
export async function handleMobileMenuItemClick(mode, val, el) {
    // Prevent event propagation to avoid conflicts
    if (window.event) {
        window.event.stopPropagation();
        window.event.preventDefault();
    }
    
    // Set mode and wait for it to complete
    if (window.setMode) {
        await window.setMode(mode, val, el);
    }
    
    // Small delay to ensure mode is fully initialized before closing
    setTimeout(() => {
        closeMobileMenu();
    }, 100);
}

/**
 * Initialize mobile menu button handlers to fix double-click issue
 */
export function initMobileMenuHandlers() {
    // Add touch event handlers to mobile menu buttons to prevent double-click requirement
    const mobileMenuButtons = document.querySelectorAll('#mobileMenu button[onclick*="setMode"]');
    
    mobileMenuButtons.forEach(button => {
        // Remove default onclick behavior and use touch/click handler
        const originalOnclick = button.getAttribute('onclick');
        if (originalOnclick && originalOnclick.includes('setMode')) {
            // Extract mode and value from onclick string
            const modeMatch = originalOnclick.match(/setMode\(['"]([^'"]+)['"]/);
            const valMatch = originalOnclick.match(/setMode\([^,]+,\s*(null|['"][^'"]+['"])/);
            
            if (modeMatch) {
                const mode = modeMatch[1];
                const val = valMatch && valMatch[1] !== 'null' ? valMatch[1].replace(/['"]/g, '') : null;
                
                // Remove onclick to prevent double execution
                button.removeAttribute('onclick');
                
                // Add proper event handler that works on first tap
                const handleClick = async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Add visual feedback
                    button.style.opacity = '0.7';
                    setTimeout(() => {
                        button.style.opacity = '';
                    }, 150);
                    
                    // Set mode and close menu
                    if (window.handleMobileMenuItemClick) {
                        await window.handleMobileMenuItemClick(mode, val, button);
                    } else if (window.setMode) {
                        await window.setMode(mode, val, button);
                        setTimeout(() => closeMobileMenu(), 100);
                    }
                };
                
                // Use both touchstart and click for maximum compatibility
                button.addEventListener('touchstart', handleClick, { passive: false });
                button.addEventListener('click', handleClick);
            }
        }
    });
}

