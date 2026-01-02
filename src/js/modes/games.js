// Games modes

import { getCanvas } from '../core/canvas.js';
import { loadTemplate } from '../utils/template-loader.js';

const canvas = getCanvas();
let gameContainer = null;
let gameIframe = null;
let currentGameMode = null;

/**
 * Initialize a games mode
 * @param {string} mode - The game mode name (e.g., 'tetris')
 * @param {HTMLCanvasElement} canvas - The main canvas element
 */
export async function initGamesMode(mode, canvas) {
    // Clean up previous game if switching modes
    if (currentGameMode && currentGameMode !== mode) {
        cleanupGame();
    }
    
    currentGameMode = mode;
    
    // Hide the main canvas
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    // Create game container if it doesn't exist
    if (!gameContainer) {
        gameContainer = document.createElement('div');
        gameContainer.id = 'games-container';
        gameContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1000;
            background: #000;
        `;
        document.body.appendChild(gameContainer);
    }
    
    // Load and inject the game template
    if (mode === 'tetris') {
        await loadAndInjectTetris();
    }
    
    // Show the game container
    gameContainer.style.display = 'block';
}

/**
 * Load and inject Tetris game
 */
async function loadAndInjectTetris() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Tetris game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'tetris-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('tetris');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/tetris.html';
        }
    } catch (error) {
        console.warn('Failed to load Tetris template, using direct path:', error);
        gameIframe.src = 'src/templates/games/tetris.html';
    }
    
    gameContainer.appendChild(gameIframe);
}

/**
 * Render games mode (games handle their own rendering)
 * @param {string} mode - The game mode name
 * @param {CanvasRenderingContext2D} ctx - The canvas context (not used for games)
 * @param {HTMLCanvasElement} canvas - The main canvas (not used for games)
 */
export function renderGamesMode(mode, ctx, canvas) {
    // Games handle their own rendering through iframes/containers
    // This function exists for consistency with other mode handlers
    // but doesn't need to do anything
}

/**
 * Clean up game state when switching away from games
 */
export function cleanupGame() {
    // Hide game container
    if (gameContainer) {
        gameContainer.style.display = 'none';
    }
    
    // Remove iframe
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Show main canvas again
    if (canvas) {
        canvas.style.display = 'block';
    }
    
    currentGameMode = null;
}

/**
 * Check if a mode is a games mode
 * @param {string} mode - The mode name
 * @returns {boolean} True if the mode is a games mode
 */
export function isGamesMode(mode) {
    return mode === 'tetris' || mode.startsWith('game_');
}

