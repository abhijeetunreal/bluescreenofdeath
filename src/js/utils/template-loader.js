// Template loader utility - loads and parses HTML templates

const templateCache = new Map();
const MAX_CACHE_SIZE = 50; // Maximum number of templates to cache
const accessOrder = []; // Track access order for LRU eviction

/**
 * Loads and parses an HTML template for a given mode
 * @param {string} modeName - The mode name (e.g., 'win_10_upd', 'macos_hello')
 * @returns {Promise<Object>} Parsed template object
 */
export async function loadTemplate(modeName) {
    if (!modeName) return null;
    
    // Check cache first
    if (templateCache.has(modeName)) {
        // Update access order (move to end)
        const index = accessOrder.indexOf(modeName);
        if (index > -1) {
            accessOrder.splice(index, 1);
        }
        accessOrder.push(modeName);
        return templateCache.get(modeName);
    }

    // Determine template path based on mode name
    let templatePath;
    if (modeName.startsWith('win_')) {
        templatePath = `src/templates/windows/${modeName}.html`;
    } else if (modeName.startsWith('macos_') || modeName.startsWith('ios_')) {
        templatePath = `src/templates/apple/${modeName}.html`;
    } else if (['broken_screen', 'white_noise', 'radar', 'hacker', 'no_signal'].includes(modeName)) {
        templatePath = `src/templates/pranks/${modeName}.html`;
    } else if (modeName === 'tetris' || modeName.startsWith('game_')) {
        templatePath = `src/templates/games/${modeName}.html`;
    } else {
        templatePath = `src/templates/misc/${modeName}.html`;
    }

    try {
        const response = await fetch(templatePath);
        if (!response.ok) {
            // Template doesn't exist - return null (mode will use pure Canvas rendering)
            // Don't log 404 errors as they're expected for modes without templates
            if (response.status !== 404) {
                console.warn(`Failed to load template for ${modeName}: HTTP ${response.status}`);
            }
            return null;
        }
        const htmlString = await response.text();
        
        // Games templates are full HTML pages, return raw HTML
        if (modeName === 'tetris' || modeName.startsWith('game_')) {
            const gameTemplate = { html: htmlString, type: 'game' };
            
            // Enforce cache size limit (LRU eviction)
            if (templateCache.size >= MAX_CACHE_SIZE) {
                // Remove least recently used entry
                const lruKey = accessOrder.shift();
                if (lruKey) {
                    templateCache.delete(lruKey);
                }
            }
            
            templateCache.set(modeName, gameTemplate);
            accessOrder.push(modeName);
            return gameTemplate;
        }
        
        // Other templates are parsed
        const parsed = parseTemplate(htmlString);
        
        // Enforce cache size limit (LRU eviction)
        if (templateCache.size >= MAX_CACHE_SIZE) {
            // Remove least recently used entry
            const lruKey = accessOrder.shift();
            if (lruKey) {
                templateCache.delete(lruKey);
            }
        }
        
        templateCache.set(modeName, parsed);
        accessOrder.push(modeName);
        return parsed;
    } catch (error) {
        // Only log non-network errors (404s are expected and handled above)
        if (error.name !== 'TypeError' || !error.message.includes('fetch')) {
            console.warn(`Failed to load template for ${modeName}:`, error);
        }
        return null;
    }
}

/**
 * Parses HTML template string into a structured object
 * @param {string} htmlString - The HTML template string
 * @returns {Object} Parsed template with background and elements
 */
export function parseTemplate(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const template = doc.querySelector('canvas-template');
    
    if (!template) {
        throw new Error('Template must have a <canvas-template> root element');
    }

    const result = {
        background: null,
        elements: []
    };

    // Parse background
    const background = template.querySelector('background');
    if (background) {
        result.background = {
            color: background.getAttribute('color') || '#000000'
        };
    }

    // Parse text elements
    const textElements = template.querySelectorAll('text');
    textElements.forEach(textEl => {
        const element = {
            type: 'text',
            x: textEl.getAttribute('x') || '0',
            y: textEl.getAttribute('y') || '0',
            font: textEl.getAttribute('font') || '16px sans-serif',
            color: textEl.getAttribute('color') || '#ffffff',
            align: textEl.getAttribute('align') || 'left',
            content: textEl.textContent || textEl.getAttribute('content') || ''
        };
        result.elements.push(element);
    });

    // Parse rectangle elements (for static shapes)
    const rectElements = template.querySelectorAll('rect');
    rectElements.forEach(rectEl => {
        const element = {
            type: 'rect',
            x: rectEl.getAttribute('x') || '0',
            y: rectEl.getAttribute('y') || '0',
            width: rectEl.getAttribute('width') || '0',
            height: rectEl.getAttribute('height') || '0',
            color: rectEl.getAttribute('color') || '#ffffff'
        };
        result.elements.push(element);
    });

    return result;
}

/**
 * Clears the template cache (useful for development)
 */
export function clearTemplateCache() {
    templateCache.clear();
    accessOrder.length = 0;
}

/**
 * Gets the current cache size
 */
export function getCacheSize() {
    return templateCache.size;
}

