// Mobile menu functions

import { getBody } from '../core/canvas.js';
import { resetUITimer } from './ui-timer.js';

const body = getBody();

export function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');
    
    if (menu && overlay && menuBtn) {
        const isOpen = menu.classList.contains('show');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
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

