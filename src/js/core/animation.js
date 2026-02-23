// Animation loop and mode management

import * as state from './state.js';
import { getCanvas, getCtx } from './canvas.js';
import { getCategoryForMode } from '../config/mode-registry.js';
import { renderColorMode } from '../modes/color.js';
import { initWindowsMode, renderWindowsMode, cleanupWindowsMode } from '../modes/windows.js';
import { initAppleMode, renderAppleMode, cleanupAppleMode } from '../modes/apple.js';
import { initPrankMode, renderPrankMode, cleanupPrankMode } from '../modes/pranks.js';
import { initMiscMode, renderMiscMode, cleanupMiscMode } from '../modes/misc.js';
import { initGamesMode, renderGamesMode, cleanupGame, isGamesMode } from '../modes/games.js';
import { resetUITimer } from '../ui/ui-timer.js';
import { handleModeChange } from '../ui/game-screensaver.js';

const canvas = getCanvas();
const ctx = getCtx();

// Track initialization to prevent race conditions
let initToken = 0;
let currentInitMode = null;

export async function initMode() {
    initToken++;
    const token = initToken;

    state.resetProgress();
    state.resetFrame();

    const mode = state.getCurrentMode();
    const previousMode = currentInitMode;
    currentInitMode = mode;
    const category = getCategoryForMode(mode);
    const prevCategory = previousMode ? getCategoryForMode(previousMode) : null;

    try {
        if (previousMode && prevCategory !== category) {
            if (prevCategory === 'games') cleanupGame();
            else if (prevCategory === 'apple') cleanupAppleMode();
            else if (prevCategory === 'misc') cleanupMiscMode();
            else if (prevCategory === 'pranks') cleanupPrankMode();
            else if (prevCategory === 'windows') cleanupWindowsMode();
        }

        if (category === 'games') {
            await initGamesMode(mode, canvas);
        } else if (category === 'apple') {
            await initAppleMode(mode, canvas);
        } else if (category === 'misc') {
            await initMiscMode(mode, canvas);
        } else if (category === 'pranks') {
            await initPrankMode(mode, canvas);
        } else if (category === 'windows') {
            await initWindowsMode(mode, canvas);
        }

        if (token !== initToken) return;
    } catch (error) {
        console.error('Error initializing mode:', error);
        if (token === initToken) {
            console.warn(`Mode initialization failed for ${mode}, continuing with previous state`);
        }
    }
}

export function animate() {
    // Validate canvas and context before proceeding
    if (!canvas || !ctx) {
        console.warn('Canvas or context not available, skipping animation frame');
        requestAnimationFrame(animate);
        return;
    }
    
    try {
        state.incrementFrame();
        state.incrementProgress();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'left';
        
        const mode = state.getCurrentMode();
        const category = getCategoryForMode(mode);

        if (mode === 'color') {
            renderColorMode(ctx, canvas);
        } else if (category === 'games') {
            renderGamesMode(mode, ctx, canvas);
        } else if (category === 'windows') {
            renderWindowsMode(mode, ctx, canvas);
        } else if (category === 'apple') {
            renderAppleMode(mode, ctx, canvas);
        } else if (category === 'pranks') {
            renderPrankMode(mode, ctx, canvas);
        } else if (category === 'misc') {
            renderMiscMode(mode, ctx, canvas);
        }
    } catch (error) {
        console.error('Error in animation loop:', error);
    }
    
    requestAnimationFrame(animate);
}

export async function setMode(mode, val, el) {
    // Show canvas view when a mode is selected
    if (window.showCanvasView) {
        window.showCanvasView();
    }
    
    // Notify screensaver of mode change (will stop if switching to non-game mode)
    handleModeChange(mode);
    
    // Set mode immediately for UI responsiveness
    state.setCurrentMode(mode);
    if (val) {
        state.setCurrentColor(val);
    }
    
    // Update UI immediately (don't wait for async init)
    // Remove active class from all buttons and swatches
    const allButtons = document.querySelectorAll('.swatch, .dropdown-content button, .mobile-option-btn, .mobile-swatch');
    if (allButtons) {
        allButtons.forEach(i => i.classList.remove('active'));
    }
    
    // Add active class to clicked element
    if (el) {
        el.classList.add('active');
    }
    
    // Also update mobile menu buttons if they exist
    if (mode !== 'color') {
        const mobileBtn = document.querySelector(`.mobile-option-btn[data-mode="${mode}"]`);
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
    
    // Initialize mode asynchronously (may be cancelled if mode changes again)
    try {
        await initMode();
    } catch (error) {
        // Error already logged in initMode
    }
    
    resetUITimer();
    
    // Return a flag indicating if mobile menu should close
    // This allows the onclick handler to wait before closing
    return true;
}

