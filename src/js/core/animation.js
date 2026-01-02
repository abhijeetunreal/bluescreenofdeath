// Animation loop and mode management

import * as state from './state.js';
import { getCanvas, getCtx } from './canvas.js';
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
    // Increment token to mark this initialization
    initToken++;
    const token = initToken;
    
    state.resetProgress();
    state.resetFrame();
    
    const mode = state.getCurrentMode();
    const previousMode = currentInitMode;
    currentInitMode = mode;
    
    try {
        // Clean up previous mode if switching away from it
        if (previousMode && isGamesMode(previousMode) && !isGamesMode(mode)) {
            cleanupGame();
        } else if (previousMode && (previousMode === 'macos_drift' || previousMode.startsWith('macos_') || previousMode.startsWith('ios_')) && 
                   !(mode === 'macos_drift' || mode.startsWith('macos_') || mode.startsWith('ios_'))) {
            cleanupAppleMode();
        } else if (previousMode && ['ubuntu', 'chromeos', 'matrix', 'dvd', 'flip_clock', 'quotes'].includes(previousMode) && 
                   !['ubuntu', 'chromeos', 'matrix', 'dvd', 'flip_clock', 'quotes'].includes(mode)) {
            cleanupMiscMode();
        } else if (previousMode && ['broken_screen', 'white_noise', 'radar', 'hacker', 'no_signal'].includes(previousMode) && 
                   !['broken_screen', 'white_noise', 'radar', 'hacker', 'no_signal'].includes(mode)) {
            cleanupPrankMode();
        } else if (previousMode && previousMode.startsWith('win_') && !mode.startsWith('win_')) {
            cleanupWindowsMode();
        }
        
        if (isGamesMode(mode)) {
            await initGamesMode(mode, canvas);
        } else if (mode === 'macos_drift' || mode.startsWith('macos_') || mode.startsWith('ios_')) {
            await initAppleMode(mode, canvas);
        } else if (['ubuntu', 'chromeos', 'matrix', 'dvd', 'flip_clock', 'quotes'].includes(mode)) {
            await initMiscMode(mode, canvas);
        } else if (['broken_screen', 'white_noise', 'radar', 'hacker', 'no_signal'].includes(mode)) {
            await initPrankMode(mode, canvas);
        } else if (mode.startsWith('win_')) {
            await initWindowsMode(mode, canvas);
        }
        
        // Only proceed if this is still the current initialization
        if (token !== initToken) {
            // Another initialization started, ignore this one
            return;
        }
    } catch (error) {
        console.error('Error initializing mode:', error);
        // Only log if this is still the current initialization
        if (token === initToken) {
            console.warn(`Mode initialization failed for ${mode}, continuing with previous state`);
        }
    }
    
    // Other modes don't need initialization
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
        
        // Route to appropriate mode renderer
        if (isGamesMode(mode)) {
            // Games handle their own rendering, but we still call this for consistency
            renderGamesMode(mode, ctx, canvas);
        } else if (mode === 'color') {
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

