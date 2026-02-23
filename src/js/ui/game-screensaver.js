// Game Screensaver - Cycles through random games at user-defined intervals

import { setMode } from '../core/animation.js';
import { getCurrentMode } from '../core/state.js';
import { isGamesMode } from '../modes/games.js';

// All available game modes
const GAME_MODES = [
    'tetris',
    'snake',
    'pacman',
    'mario',
    'flap',
    'neon_vector',
    'neon_boids',
    'neon_ecosystem',
    'chess',
    'circular_maze',
    'maze'
];

// Screensaver state
let screensaverInterval = null;
let isScreensaverActive = false;
let lastGameMode = null;
let modalElement = null;
let inputElement = null;

/**
 * Create and initialize the modal dialog
 */
function createModal() {
    if (modalElement) {
        return; // Modal already exists
    }

    // Create modal overlay
    modalElement = document.createElement('div');
    modalElement.id = 'game-screensaver-modal';
    modalElement.className = 'game-screensaver-modal fixed inset-0 z-[3001] bg-black/80 backdrop-blur-md opacity-0 invisible transition-all duration-300 ease-in-out flex items-center justify-center';
    modalElement.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 3001;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(12px);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content bg-bgUi backdrop-blur-[25px] border border-borderUi rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 transform scale-95 transition-transform duration-300';
    modalContent.style.cssText = `
        background: rgba(15, 15, 15, 0.95);
        backdrop-filter: blur(25px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        padding: 2rem;
        max-width: 28rem;
        width: 100%;
        margin: 0 1rem;
        transform: scale(0.95);
        transition: transform 0.3s ease-in-out;
    `;

    // Create title
    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold text-white mb-4';
    title.textContent = '🎮 Game Screensaver';
    title.style.cssText = 'font-size: 1.5rem; font-weight: 700; color: #ffffff; margin-bottom: 1rem;';

    // Create description
    const description = document.createElement('p');
    description.className = 'text-text/80 text-sm mb-6';
    description.textContent = 'Enter the time interval (in seconds) to automatically cycle through random games.';
    description.style.cssText = 'color: rgba(255, 255, 255, 0.7); font-size: 0.875rem; margin-bottom: 1.5rem;';

    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'mb-6';
    inputContainer.style.cssText = 'margin-bottom: 1.5rem;';

    // Create label
    const label = document.createElement('label');
    label.className = 'block text-text/60 text-sm font-medium mb-2';
    label.textContent = 'Interval (seconds)';
    label.style.cssText = 'display: block; color: rgba(255, 255, 255, 0.6); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;';
    label.setAttribute('for', 'screensaver-interval-input');

    // Create input
    inputElement = document.createElement('input');
    inputElement.id = 'screensaver-interval-input';
    inputElement.type = 'number';
    inputElement.min = '1';
    inputElement.value = '10';
    inputElement.className = 'w-full px-4 py-3 bg-white/8 border border-white/10 rounded-xl text-white placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all';
    inputElement.style.cssText = `
        width: 100%;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: #ffffff;
        font-size: 1rem;
        outline: none;
        transition: all 0.2s ease-in-out;
    `;
    inputElement.placeholder = 'Enter seconds (minimum 1)';

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex gap-3';
    buttonContainer.style.cssText = 'display: flex; gap: 0.75rem;';

    // Create Start button
    const startButton = document.createElement('button');
    startButton.id = 'screensaver-start-btn';
    startButton.className = 'flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer';
    startButton.textContent = 'Start';
    startButton.style.cssText = `
        flex: 1;
        background: #22c55e;
        color: #ffffff;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    `;
    startButton.addEventListener('click', handleStart);

    // Create Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.id = 'screensaver-cancel-btn';
    cancelButton.className = 'flex-1 bg-white/10 hover:bg-white/20 text-text border border-white/10 font-semibold py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer';
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        flex: 1;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    `;
    cancelButton.addEventListener('click', hideScreensaverModal);

    // Assemble modal
    inputContainer.appendChild(label);
    inputContainer.appendChild(inputElement);
    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(cancelButton);
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(inputContainer);
    modalContent.appendChild(buttonContainer);
    modalElement.appendChild(modalContent);

    // Add click outside to close
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            hideScreensaverModal();
        }
    });

    // Add Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalElement && modalElement.style.visibility === 'visible') {
            hideScreensaverModal();
        }
    });

    // Add Enter key to submit
    inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleStart();
        }
    });

    document.body.appendChild(modalElement);
}

/**
 * Show the screensaver modal
 */
export function showScreensaverModal() {
    if (!modalElement) {
        createModal();
    }

    if (inputElement) {
        inputElement.value = '10';
        inputElement.focus();
    }

    // Show modal with animation
    requestAnimationFrame(() => {
        modalElement.style.opacity = '1';
        modalElement.style.visibility = 'visible';
        const content = modalElement.querySelector('.modal-content');
        if (content) {
            content.style.transform = 'scale(1)';
        }
    });
}

/**
 * Hide the screensaver modal
 */
export function hideScreensaverModal() {
    if (!modalElement) return;

    modalElement.style.opacity = '0';
    modalElement.style.visibility = 'hidden';
    const content = modalElement.querySelector('.modal-content');
    if (content) {
        content.style.transform = 'scale(0.95)';
    }
}

/**
 * Handle Start button click
 */
function handleStart() {
    if (!inputElement) return;

    const intervalValue = parseInt(inputElement.value, 10);

    // Validate input
    if (isNaN(intervalValue) || intervalValue < 1) {
        inputElement.style.borderColor = '#ef4444';
        inputElement.focus();
        setTimeout(() => {
            if (inputElement) {
                inputElement.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        }, 2000);
        return;
    }

    hideScreensaverModal();
    startGameScreensaver(intervalValue);
}

/**
 * Get a random game mode, avoiding immediate repeats
 */
function getRandomGameMode() {
    let availableModes = [...GAME_MODES];
    
    // Remove the last game mode to avoid immediate repeats
    if (lastGameMode && availableModes.length > 1) {
        availableModes = availableModes.filter(mode => mode !== lastGameMode);
    }
    
    const randomIndex = Math.floor(Math.random() * availableModes.length);
    return availableModes[randomIndex];
}

/**
 * Start the game screensaver
 * @param {number} intervalSeconds - Interval in seconds between game switches
 */
export function startGameScreensaver(intervalSeconds) {
    // Prevent multiple instances
    if (isScreensaverActive) {
        stopGameScreensaver();
    }
    // Only one screensaver at a time: stop random screensaver if running
    if (typeof window.stopRandomScreensaver === 'function') {
        window.stopRandomScreensaver();
    }

    isScreensaverActive = true;
    const intervalMs = intervalSeconds * 1000;

    // Switch to first random game immediately
    const firstGame = getRandomGameMode();
    lastGameMode = firstGame;
    setMode(firstGame, null, null);

    // Set up interval to switch games
    screensaverInterval = setInterval(() => {
        if (!isScreensaverActive) {
            return;
        }

        // Check if current mode is still a game mode (user might have switched)
        const currentMode = getCurrentMode();
        if (!isGamesMode(currentMode)) {
            // User switched to non-game mode, stop screensaver
            stopGameScreensaver();
            return;
        }

        // Switch to next random game
        const nextGame = getRandomGameMode();
        lastGameMode = nextGame;
        setMode(nextGame, null, null);
    }, intervalMs);

    updateButtonState();
}

/**
 * Stop the game screensaver
 */
export function stopGameScreensaver() {
    if (screensaverInterval) {
        clearInterval(screensaverInterval);
        screensaverInterval = null;
    }

    isScreensaverActive = false;
    lastGameMode = null;
    updateButtonState();
}

/**
 * Check if screensaver is active
 */
export function getScreensaverActive() {
    return isScreensaverActive;
}

/**
 * Toggle screensaver (show modal if inactive, stop if active)
 */
export function toggleGameScreensaver() {
    if (isScreensaverActive) {
        stopGameScreensaver();
    } else {
        showScreensaverModal();
    }
}

/**
 * Update button appearance based on screensaver state
 */
function updateButtonState() {
    const desktopBtn = document.getElementById('gameScreensaverBtn');
    const mobileBtn = document.getElementById('gameScreensaverBtnMobile');

    if (isScreensaverActive) {
        // Active state - show stop indication
        if (desktopBtn) {
            desktopBtn.textContent = '⏸️ Stop Screensaver';
            desktopBtn.style.color = '#ef4444';
        }
        if (mobileBtn) {
            mobileBtn.textContent = '⏸️ Stop Screensaver';
            mobileBtn.style.background = 'rgba(239, 68, 68, 0.2)';
            mobileBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            mobileBtn.style.color = '#fca5a5';
        }
    } else {
        // Inactive state - show start indication
        if (desktopBtn) {
            desktopBtn.textContent = '🎮 Game Screensaver';
            desktopBtn.style.color = '#4ade80';
        }
        if (mobileBtn) {
            mobileBtn.textContent = '🎮 Game Screensaver';
            mobileBtn.style.background = 'rgba(34, 197, 94, 0.2)';
            mobileBtn.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            mobileBtn.style.color = '#4ade80';
        }
    }
}

/**
 * Handle mode change - stop screensaver if switching to non-game mode
 * This should be called from the animation module when mode changes
 */
export function handleModeChange(newMode) {
    if (isScreensaverActive && !isGamesMode(newMode)) {
        stopGameScreensaver();
    }
}

/**
 * Initialize screensaver module
 * Sets up cleanup on page unload
 */
export function initGameScreensaver() {
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        stopGameScreensaver();
    });
}

