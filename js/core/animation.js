// Animation loop and mode management

import * as state from './state.js';
import { getCanvas, getCtx } from './canvas.js';
import { renderColorMode } from '../modes/color.js';
import { initWindowsMode, renderWindowsMode } from '../modes/windows.js';
import { initAppleMode, renderAppleMode } from '../modes/apple.js';
import { initPrankMode, renderPrankMode } from '../modes/pranks.js';
import { initMiscMode, renderMiscMode } from '../modes/misc.js';
import { resetUITimer } from '../ui/ui-timer.js';

const canvas = getCanvas();
const ctx = getCtx();

export function initMode() {
    state.resetProgress();
    state.resetFrame();
    
    const mode = state.getCurrentMode();
    
    if (mode === 'macos_drift') {
        initAppleMode(mode, canvas);
    } else if (mode === 'matrix' || mode === 'quotes') {
        initMiscMode(mode, canvas);
    } else if (mode === 'hacker' || mode === 'broken_screen') {
        initPrankMode(mode, canvas);
    }
    // Windows modes and other modes don't need initialization
}

export function animate() {
    state.incrementFrame();
    state.incrementProgress();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'left';
    
    const mode = state.getCurrentMode();
    
    // Route to appropriate mode renderer
    if (mode === 'color') {
        renderColorMode(ctx, canvas);
    } else if (mode.startsWith('win_')) {
        renderWindowsMode(mode, ctx, canvas);
    } else if (mode.startsWith('macos_') || mode.startsWith('ios_')) {
        renderAppleMode(mode, ctx, canvas);
    } else if (['broken_screen', 'white_noise', 'radar', 'hacker', 'no_signal'].includes(mode)) {
        renderPrankMode(mode, ctx, canvas);
    } else {
        renderMiscMode(mode, ctx, canvas);
    }
    
    requestAnimationFrame(animate);
}

export function setMode(mode, val, el) {
    state.setCurrentMode(mode);
    if (val) {
        state.setCurrentColor(val);
    }
    initMode();
    
    // Remove active class from all buttons and swatches
    document.querySelectorAll('.swatch, .dropdown-content button, .mobile-option-btn, .mobile-swatch').forEach(i => i.classList.remove('active'));
    
    // Add active class to clicked element
    if (el) {
        el.classList.add('active');
    }
    
    // Also update mobile menu buttons if they exist
    if (mode !== 'color') {
        const mobileBtn = document.querySelector(`.mobile-option-btn[onclick*="${mode}"]`);
        if (mobileBtn) {
            mobileBtn.classList.add('active');
        }
    } else if (val) {
        // For color mode, update swatch
        const swatch = document.querySelector(`.swatch[style*="${val}"], .mobile-swatch[style*="${val}"]`);
        if (swatch) {
            swatch.classList.add('active');
        }
    }
    
    resetUITimer();
}

