// Random Screensaver - Cycles through all modes at user-defined intervals

import { MODES } from '../config/mode-registry.js';
import { stopGameScreensaver } from './game-screensaver.js';

// Cycleable modes: all modes that have a template (exclude noTemplate)
const CYCLEABLE_MODE_IDS = MODES.filter(m => !m.noTemplate).map(m => m.id);

let screensaverInterval = null;
let isRandomScreensaverActive = false;
let lastModeId = null;

/**
 * Get a random mode id, avoiding immediate repeats
 */
function getRandomModeId() {
    if (CYCLEABLE_MODE_IDS.length === 0) return null;
    let available = [...CYCLEABLE_MODE_IDS];
    if (lastModeId && available.length > 1) {
        available = available.filter(id => id !== lastModeId);
    }
    const index = Math.floor(Math.random() * available.length);
    return available[index];
}

/**
 * Start the random screensaver (all modes).
 * Stops game screensaver if active so only one screensaver runs.
 * @param {number} intervalSeconds - Interval in seconds between mode switches
 */
export function startRandomScreensaver(intervalSeconds) {
    if (isRandomScreensaverActive) {
        stopRandomScreensaver();
    }
    stopGameScreensaver();

    isRandomScreensaverActive = true;
    const intervalMs = intervalSeconds * 1000;

    const firstModeId = getRandomModeId();
    if (firstModeId) {
        lastModeId = firstModeId;
        window.setMode?.(firstModeId, null, null);
    }

    screensaverInterval = setInterval(() => {
        if (!isRandomScreensaverActive) return;
        const nextModeId = getRandomModeId();
        if (nextModeId) {
            lastModeId = nextModeId;
            window.setMode?.(nextModeId, null, null);
        }
    }, intervalMs);

    updateRandomScreensaverButtonState();
}

/**
 * Stop the random screensaver
 */
export function stopRandomScreensaver() {
    if (screensaverInterval) {
        clearInterval(screensaverInterval);
        screensaverInterval = null;
    }
    isRandomScreensaverActive = false;
    lastModeId = null;
    updateRandomScreensaverButtonState();
}

/**
 * Whether the random screensaver is active
 */
export function isRandomScreensaverRunning() {
    return isRandomScreensaverActive;
}

/**
 * When user manually changes mode, stop the random screensaver.
 * Called from setMode; we stop only when the new mode is not the one the screensaver just set (lastModeId).
 */
export function handleRandomScreensaverModeChange(newMode) {
    if (isRandomScreensaverActive && newMode !== lastModeId) {
        stopRandomScreensaver();
    }
}

/**
 * Update menu button(s) for random screensaver (Stop when active)
 */
function updateRandomScreensaverButtonState() {
    const desktopBtn = document.getElementById('randomScreensaverBtn');
    const mobileBtn = document.getElementById('randomScreensaverBtnMobile');
    if (desktopBtn) {
        desktopBtn.textContent = isRandomScreensaverActive ? '⏸️ Stop random screensaver' : 'Random screensaver';
        desktopBtn.style.color = isRandomScreensaverActive ? '#ef4444' : '';
    }
    if (mobileBtn) {
        mobileBtn.textContent = isRandomScreensaverActive ? '⏸️ Stop random screensaver' : 'Random screensaver';
        mobileBtn.style.color = isRandomScreensaverActive ? '#ef4444' : '';
        mobileBtn.style.background = isRandomScreensaverActive ? 'rgba(239, 68, 68, 0.2)' : '';
        mobileBtn.style.borderColor = isRandomScreensaverActive ? 'rgba(239, 68, 68, 0.3)' : '';
    }
}

export { updateRandomScreensaverButtonState };

/**
 * Initialize: cleanup on unload
 */
export function initRandomScreensaver() {
    window.addEventListener('beforeunload', () => {
        stopRandomScreensaver();
    });
}
