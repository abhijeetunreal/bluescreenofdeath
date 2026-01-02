// Dropdown handling logic

import { getIsTouchDevice } from '../core/canvas.js';
import { closeMobileMenu } from './mobile-menu.js';

const isTouchDevice = getIsTouchDevice();
let abortController = null;
const hideTimeouts = new Map(); // Track all hide timeouts for cleanup
const openDropdowns = new Map(); // Track which dropdowns are open

export function initDropdowns() {
    // Cleanup existing handlers if any
    cleanupDropdowns();
    
    // Create new AbortController for this set of handlers
    abortController = new AbortController();
    const signal = abortController.signal;
    
    const dropdowns = document.querySelectorAll('.dropdown');
    if (!dropdowns.length) return;

    dropdowns.forEach(dropdown => {
        const content = dropdown.querySelector('.dropdown-content');
        const dropBtn = dropdown.querySelector('.drop-btn');
        
        if (!content || !dropBtn) return;

        function showDropdown() {
            const existingTimeout = hideTimeouts.get(dropdown);
            if (existingTimeout) {
                clearTimeout(existingTimeout);
                hideTimeouts.delete(dropdown);
            }
            content.classList.add('show');
            openDropdowns.set(dropdown, true);
        }

        function hideDropdown() {
            const timeout = setTimeout(() => {
                content.classList.remove('show');
                openDropdowns.delete(dropdown);
                hideTimeouts.delete(dropdown);
            }, 150);
            hideTimeouts.set(dropdown, timeout);
        }

        // Mouse events for desktop
        if (!isTouchDevice) {
            dropdown.addEventListener('mouseenter', showDropdown, { signal });
            dropdown.addEventListener('mouseleave', hideDropdown, { signal });
        }

        // Touch/Click events for mobile
        dropBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = openDropdowns.has(dropdown);
            if (isOpen) {
                content.classList.remove('show');
                openDropdowns.delete(dropdown);
            } else {
                // Close other open dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        const otherContent = otherDropdown.querySelector('.dropdown-content');
                        if (otherContent) {
                            otherContent.classList.remove('show');
                            openDropdowns.delete(otherDropdown);
                        }
                    }
                });
                showDropdown();
            }
        }, { signal });

        // Prevent dropdown from closing when clicking inside it
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        }, { signal });
    });

    // Close dropdowns when clicking outside (single global handler)
    if (isTouchDevice) {
        document.addEventListener('click', (e) => {
            // Don't close if clicking on mobile menu elements
            if (e.target.closest('#mobileMenu') || e.target.closest('#mobileMenuBtn')) {
                return;
            }
            
            let clickedInsideDropdown = false;
            dropdowns.forEach(dropdown => {
                if (dropdown.contains(e.target)) {
                    clickedInsideDropdown = true;
                }
            });
            
            if (!clickedInsideDropdown) {
                dropdowns.forEach(dropdown => {
                    const content = dropdown.querySelector('.dropdown-content');
                    if (content) {
                        content.classList.remove('show');
                        openDropdowns.delete(dropdown);
                    }
                });
            }
        }, { signal });
    }
}

export function cleanupDropdowns() {
    // Abort all event listeners
    if (abortController) {
        abortController.abort();
        abortController = null;
    }
    
    // Clear all hide timeouts
    hideTimeouts.forEach(timeout => clearTimeout(timeout));
    hideTimeouts.clear();
    
    // Close all open dropdowns
    openDropdowns.forEach((_, dropdown) => {
        const content = dropdown.querySelector('.dropdown-content');
        if (content) {
            content.classList.remove('show');
        }
    });
    openDropdowns.clear();
}

