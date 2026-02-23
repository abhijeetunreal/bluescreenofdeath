// Dropdown handling logic – click only (no hover)

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

        // Click to toggle (desktop and mobile) – no hover
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

        // Stop propagation so document listener doesn’t close when clicking inside
        content.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close dropdown when a menu item (button) is clicked
            if (e.target.closest('button')) {
                content.classList.remove('show');
                openDropdowns.delete(dropdown);
            }
        }, { signal });
    });

    // Close dropdowns when clicking outside – use capture so we run before other handlers
    document.addEventListener('click', (e) => {
        if (e.target.closest('#mobileMenu') || e.target.closest('.mobile-menu-btn')) {
            return;
        }
        let inside = false;
        dropdowns.forEach(dropdown => {
            if (dropdown.contains(e.target)) inside = true;
        });
        if (!inside) {
            dropdowns.forEach(dropdown => {
                const content = dropdown.querySelector('.dropdown-content');
                if (content) {
                    content.classList.remove('show');
                    openDropdowns.delete(dropdown);
                }
            });
        }
    }, { capture: true, signal });
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

