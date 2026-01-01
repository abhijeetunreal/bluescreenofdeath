// Dropdown handling logic

import { getIsTouchDevice } from '../core/canvas.js';
import { closeMobileMenu } from './mobile-menu.js';

const isTouchDevice = getIsTouchDevice();

export function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const openDropdowns = new Map(); // Track which dropdowns are open

    dropdowns.forEach(dropdown => {
        const content = dropdown.querySelector('.dropdown-content');
        const dropBtn = dropdown.querySelector('.drop-btn');
        let hideTimeout = null;

        function showDropdown() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            content.classList.add('show');
            openDropdowns.set(dropdown, true);
        }

        function hideDropdown() {
            hideTimeout = setTimeout(() => {
                content.classList.remove('show');
                openDropdowns.delete(dropdown);
                hideTimeout = null;
            }, 150);
        }

        // Mouse events for desktop
        if (!isTouchDevice) {
            dropdown.addEventListener('mouseenter', showDropdown);
            dropdown.addEventListener('mouseleave', hideDropdown);
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
                        otherContent.classList.remove('show');
                        openDropdowns.delete(otherDropdown);
                    }
                });
                showDropdown();
            }
        });

        // Prevent dropdown from closing when clicking inside it
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
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
                    content.classList.remove('show');
                    openDropdowns.delete(dropdown);
                });
            }
        });
    }
}

