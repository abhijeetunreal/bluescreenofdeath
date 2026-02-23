// Games modes

import { getCanvas } from '../core/canvas.js';
import { getCategoryForMode } from '../config/mode-registry.js';
import { loadTemplate } from '../utils/template-loader.js';

const canvas = getCanvas();
let gameContainer = null;
let gameIframe = null;
let currentGameMode = null;

/**
 * Automatically start a game by clicking the start button after iframe loads
 * @param {HTMLIFrameElement} iframe - The game iframe element
 * @param {string} gameMode - The game mode name (e.g., 'tetris', 'chess')
 */
function autoStartGame(iframe, gameMode) {
    const MAX_ATTEMPTS = 50; // Maximum polling attempts
    const POLL_INTERVAL = 100; // Milliseconds between attempts
    let attempts = 0;
    
    const tryClickButton = () => {
        attempts++;
        
        try {
            // Try to access iframe content
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            
            if (!iframeDoc) {
                // Iframe not ready yet, try again
                if (attempts < MAX_ATTEMPTS) {
                    setTimeout(tryClickButton, POLL_INTERVAL);
                }
                return;
            }
            
            // For chess, click the CPU vs CPU mode button
            if (gameMode === 'chess') {
                const modeButton = iframeDoc.getElementById('mode-cvc');
                if (modeButton) {
                    modeButton.click();
                    return;
                }
            } else {
                // For all other games, click the start button
                const startButton = iframeDoc.getElementById('start-btn');
                if (startButton) {
                    startButton.click();
                    return;
                }
            }
            
            // Button not found yet, try again
            if (attempts < MAX_ATTEMPTS) {
                setTimeout(tryClickButton, POLL_INTERVAL);
            }
        } catch (error) {
            // Cross-origin or other error, try again if we have attempts left
            if (attempts < MAX_ATTEMPTS) {
                setTimeout(tryClickButton, POLL_INTERVAL);
            } else {
                console.warn(`Failed to auto-start ${gameMode}:`, error);
            }
        }
    };
    
    // Wait for iframe to load, then start polling
    if (iframe.contentDocument || iframe.contentWindow?.document) {
        // Already loaded
        tryClickButton();
    } else {
        // Wait for load event
        iframe.addEventListener('load', () => {
            setTimeout(tryClickButton, POLL_INTERVAL);
        }, { once: true });
    }
}

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
    } else if (mode === 'snake') {
        await loadAndInjectSnake();
    } else if (mode === 'pacman') {
        await loadAndInjectPacman();
    } else if (mode === 'mario') {
        await loadAndInjectMario();
    } else if (mode === 'flap') {
        await loadAndInjectFlap();
    } else if (mode === 'neon_vector') {
        await loadAndInjectNeonVector();
    } else if (mode === 'chess') {
        await loadAndInjectChess();
    } else if (mode === 'circular_maze') {
        await loadAndInjectCircularMaze();
    } else if (mode === 'maze') {
        await loadAndInjectMaze();
    } else if (mode === 'neon_boids') {
        await loadAndInjectNeonBoids();
    } else if (mode === 'neon_ecosystem') {
        await loadAndInjectNeonEcosystem();
    } else if (mode === 'koi_pond') {
        await loadAndInjectKoiPond();
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
    autoStartGame(gameIframe, 'tetris');
}

/**
 * Load and inject Snake game
 */
async function loadAndInjectSnake() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Snake game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'snake-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('snake');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/snake.html';
        }
    } catch (error) {
        console.warn('Failed to load Snake template, using direct path:', error);
        gameIframe.src = 'src/templates/games/snake.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'snake');
}

/**
 * Load and inject Pac-Man game
 */
async function loadAndInjectPacman() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Pac-Man game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'pacman-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('pacman');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/pacman.html';
        }
    } catch (error) {
        console.warn('Failed to load Pac-Man template, using direct path:', error);
        gameIframe.src = 'src/templates/games/pacman.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'pacman');
}

/**
 * Load and inject Mario game
 */
async function loadAndInjectMario() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Mario game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'mario-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('mario');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/mario.html';
        }
    } catch (error) {
        console.warn('Failed to load Mario template, using direct path:', error);
        gameIframe.src = 'src/templates/games/mario.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'mario');
}

/**
 * Load and inject Flap game
 */
async function loadAndInjectFlap() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Flap game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'flap-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('flap');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/flap.html';
        }
    } catch (error) {
        console.warn('Failed to load Flap template, using direct path:', error);
        gameIframe.src = 'src/templates/games/flap.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'flap');
}

/**
 * Load and inject Neon Vector game
 */
async function loadAndInjectNeonVector() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Neon Vector game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'neon-vector-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('neon_vector');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/neon_vector.html';
        }
    } catch (error) {
        console.warn('Failed to load Neon Vector template, using direct path:', error);
        gameIframe.src = 'src/templates/games/neon_vector.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'neon_vector');
}

/**
 * Load and inject Neon Boids game
 */
async function loadAndInjectNeonBoids() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Neon Boids game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'neon-boids-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('neon_boids');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/neon_boids.html';
        }
    } catch (error) {
        console.warn('Failed to load Neon Boids template, using direct path:', error);
        gameIframe.src = 'src/templates/games/neon_boids.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'neon_boids');
}

/**
 * Load and inject Chess game
 */
async function loadAndInjectChess() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Chess game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'chess-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('chess');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/chess.html';
        }
    } catch (error) {
        console.warn('Failed to load Chess template, using direct path:', error);
        gameIframe.src = 'src/templates/games/chess.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'chess');
}

/**
 * Load and inject Circular Maze game
 */
async function loadAndInjectCircularMaze() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Circular Maze game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'circular-maze-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('circular_maze');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/circular_maze.html';
        }
    } catch (error) {
        console.warn('Failed to load Circular Maze template, using direct path:', error);
        gameIframe.src = 'src/templates/games/circular_maze.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'circular_maze');
}

/**
 * Load and inject Maze game
 */
async function loadAndInjectMaze() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Maze game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'maze-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('maze');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/maze.html';
        }
    } catch (error) {
        console.warn('Failed to load Maze template, using direct path:', error);
        gameIframe.src = 'src/templates/games/maze.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'maze');
}

/**
 * Load and inject Neon Ecosystem game
 */
async function loadAndInjectNeonEcosystem() {
    // Remove existing iframe if present
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }
    
    // Create iframe for the Neon Ecosystem game
    gameIframe = document.createElement('iframe');
    gameIframe.id = 'neon-ecosystem-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('neon_ecosystem');
        if (template && template.html) {
            // If template has HTML content, use it
            gameIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            gameIframe.src = 'src/templates/games/neon_ecosystem.html';
        }
    } catch (error) {
        console.warn('Failed to load Neon Ecosystem template, using direct path:', error);
        gameIframe.src = 'src/templates/games/neon_ecosystem.html';
    }
    
    gameContainer.appendChild(gameIframe);
    autoStartGame(gameIframe, 'neon_ecosystem');
}

/**
 * Load and inject Koi Pond (no start button; runs on load)
 */
async function loadAndInjectKoiPond() {
    if (gameIframe) {
        gameIframe.remove();
        gameIframe = null;
    }

    gameIframe = document.createElement('iframe');
    gameIframe.id = 'koi-pond-iframe';
    gameIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #00151f;
    `;
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';

    try {
        const template = await loadTemplate('koi_pond');
        if (template && template.html) {
            gameIframe.srcdoc = template.html;
        } else {
            gameIframe.src = 'src/templates/games/koi_pond.html';
        }
    } catch (error) {
        console.warn('Failed to load Koi Pond template, using direct path:', error);
        gameIframe.src = 'src/templates/games/koi_pond.html';
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
 * Check if a mode is a games mode (registry-based)
 * @param {string} mode - The mode name
 * @returns {boolean} True if the mode is a games mode
 */
export function isGamesMode(mode) {
    return getCategoryForMode(mode) === 'games';
}

