/**
 * Single source of truth for all modes and categories.
 * Adding a new mode = add one entry here (+ template file if needed).
 * No edits to index.html, template-loader, animation, or home-overlay required.
 */

export const CATEGORIES = [
    { id: 'windows', label: 'Windows', icon: '🪟', order: 1 },
    { id: 'apple', label: 'Apple', icon: '🍎', order: 2 },
    { id: 'pranks', label: 'Pranks', icon: '😈', order: 3 },
    { id: 'misc', label: 'More', icon: '➕', order: 4 },
    { id: 'games', label: 'Games', icon: '🎮', order: 5 }
];

/**
 * Modes: id, label, categoryId, renderType ('canvas' | 'iframe'), noTemplate (optional).
 * Template path convention: src/templates/{categoryId}/{modeId}.html
 */
export const MODES = [
    // Windows
    { id: 'win_xp_upd', label: 'Windows XP Update', categoryId: 'windows', noTemplate: true },
    { id: 'win_10_bsod_enhanced', label: 'Windows 10 BSOD', categoryId: 'windows', renderType: 'canvas' },
    { id: 'win_xp_bsod', label: 'Windows XP BSOD', categoryId: 'windows', renderType: 'canvas' },
    { id: 'win_bios', label: 'BIOS Boot', categoryId: 'windows', renderType: 'canvas' },
    { id: 'win_11_loading', label: 'Windows 11 Loading', categoryId: 'windows', renderType: 'canvas' },
    { id: 'win_ransomware', label: 'Windows Security Alert', categoryId: 'windows', renderType: 'iframe' },
    // Apple
    { id: 'macos_drift', label: 'macOS Drift', categoryId: 'apple', noTemplate: true },
    { id: 'macos_hello', label: 'macOS Hello', categoryId: 'apple', renderType: 'canvas' },
    { id: 'macos_boot', label: 'macOS Boot', categoryId: 'apple', renderType: 'canvas' },
    { id: 'macos_panic', label: 'Kernel Panic', categoryId: 'apple', renderType: 'canvas' },
    { id: 'ios_update', label: 'iOS Update', categoryId: 'apple', renderType: 'canvas' },
    { id: 'ios_disabled', label: 'iPhone Disabled', categoryId: 'apple', renderType: 'canvas' },
    // Pranks
    { id: 'broken_screen', label: 'Broken Screen', categoryId: 'pranks', renderType: 'canvas' },
    { id: 'white_noise', label: 'White Noise', categoryId: 'pranks', renderType: 'canvas' },
    { id: 'radar', label: 'Radar Screen', categoryId: 'pranks', renderType: 'canvas' },
    { id: 'hacker', label: 'Hacker Typer', categoryId: 'pranks', renderType: 'canvas' },
    { id: 'no_signal', label: 'No Signal', categoryId: 'pranks', renderType: 'canvas' },
    // More (misc) - categoryId 'misc' matches templates folder name
    { id: 'ubuntu', label: 'Ubuntu 22.04', categoryId: 'misc', renderType: 'canvas' },
    { id: 'chromeos', label: 'Chrome OS', categoryId: 'misc', renderType: 'canvas' },
    { id: 'matrix', label: 'Matrix Rain', categoryId: 'misc', renderType: 'canvas' },
    { id: 'dvd', label: 'DVD Bouncing', categoryId: 'misc', renderType: 'canvas' },
    { id: 'flip_clock', label: 'Flip Clock', categoryId: 'misc', renderType: 'canvas' },
    { id: 'quotes', label: 'Quotes', categoryId: 'misc', renderType: 'canvas' },
    // Games (all iframe)
    { id: 'tetris', label: 'Tetris Horizon Engine', categoryId: 'games', renderType: 'iframe' },
    { id: 'snake', label: 'Snake Engine Simulation', categoryId: 'games', renderType: 'iframe' },
    { id: 'pacman', label: 'Pac-Man Engine - Turbo Edition', categoryId: 'games', renderType: 'iframe' },
    { id: 'mario', label: 'Super Mario Engine - Auto Simulation', categoryId: 'games', renderType: 'iframe' },
    { id: 'flap', label: 'Neon Flap - Full Width Engine', categoryId: 'games', renderType: 'iframe' },
    { id: 'neon_vector', label: 'Neon Vector - Space Engine', categoryId: 'games', renderType: 'iframe' },
    { id: 'neon_boids', label: 'Neon Boids - Morphological Evolution', categoryId: 'games', renderType: 'iframe' },
    { id: 'chess', label: 'Chess Pro - AI & Multiplayer Edition', categoryId: 'games', renderType: 'iframe' },
    { id: 'circular_maze', label: 'Infinite Circular Maze - Neural Engine', categoryId: 'games', renderType: 'iframe' },
    { id: 'maze', label: 'Infinite Maze - High Performance Engine', categoryId: 'games', renderType: 'iframe' },
    { id: 'neon_ecosystem', label: '3D Neon Ecosystem - Fixed', categoryId: 'games', renderType: 'iframe' },
    { id: 'koi_pond', label: 'Procedural Koi Pond', categoryId: 'games', renderType: 'iframe' }
];

const modeById = new Map(MODES.map(m => [m.id, m]));
const categoriesById = new Map(CATEGORIES.map(c => [c.id, c]));
const categoriesOrdered = [...CATEGORIES].sort((a, b) => a.order - b.order);

/**
 * @param {string} modeId
 * @returns {string|null} categoryId or null if not found (e.g. 'color')
 */
export function getCategoryForMode(modeId) {
    const mode = modeById.get(modeId);
    return mode ? mode.categoryId : null;
}

/**
 * @param {string} modeId
 * @returns {import('./mode-registry.js').ModeEntry|null}
 */
export function getMode(modeId) {
    return modeById.get(modeId) ?? null;
}

/**
 * @param {string} categoryId
 * @returns {Array<{ id: string, label: string }>}
 */
export function getModesForCategory(categoryId) {
    return MODES.filter(m => m.categoryId === categoryId).map(m => ({ id: m.id, label: m.label }));
}

/**
 * @returns {Array<{ id: string, label: string, icon: string, order: number }>}
 */
export function getCategories() {
    return categoriesOrdered;
}

/**
 * Template path for a mode. Returns null if noTemplate or unknown mode.
 * @param {string} modeId
 * @returns {string|null}
 */
export function getTemplatePath(modeId) {
    const mode = modeById.get(modeId);
    if (!mode || mode.noTemplate) return null;
    return `src/templates/${mode.categoryId}/${modeId}.html`;
}

/**
 * Whether the mode's template should be returned as raw HTML (iframe) or parsed.
 * @param {string} modeId
 * @returns {boolean}
 */
export function isRawHtmlMode(modeId) {
    const mode = modeById.get(modeId);
    return mode ? mode.renderType === 'iframe' : false;
}

/**
 * @typedef {{ id: string, label: string, categoryId: string, renderType?: 'canvas'|'iframe', noTemplate?: boolean }} ModeEntry
 */
