// Template renderer utility - renders parsed templates to canvas

/**
 * Renders a parsed template to canvas
 * @param {Object} template - Parsed template object from template-loader
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} data - Data object for template variable substitution (e.g., {progress, frame, percentComplete})
 */
export function renderTemplateToCanvas(template, ctx, canvas, data = {}) {
    if (!template || !ctx || !canvas) {
        return; // No template to render or invalid context/canvas
    }

    // Render background
    if (template.background && template.background.color) {
        try {
            ctx.fillStyle = template.background.color || '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } catch (error) {
            console.warn('Failed to render template background:', error);
        }
    }

    // Render elements
    if (Array.isArray(template.elements)) {
        template.elements.forEach(element => {
            if (!element || !element.type) return;
            
            try {
                if (element.type === 'text') {
                    renderTextElement(element, ctx, canvas, data);
                } else if (element.type === 'rect') {
                    renderRectElement(element, ctx, canvas, data);
                }
            } catch (error) {
                console.warn('Failed to render template element:', error, element);
            }
        });
    }
}

/**
 * Renders a text element to canvas
 */
function renderTextElement(element, ctx, canvas, data) {
    if (!element || !ctx || !canvas) return;
    
    // Calculate position (supports percentage and calc expressions)
    const x = validateNumber(calculatePosition(element.x, canvas.width, canvas.width), 0);
    const y = validateNumber(calculatePosition(element.y, canvas.height, canvas.height), 0);

    // Set font with fallback
    ctx.font = element.font || '16px sans-serif';

    // Set color with fallback
    ctx.fillStyle = element.color || '#ffffff';

    // Set alignment
    ctx.textAlign = element.align || 'left';

    // Substitute template variables in content
    let content = substituteVariables(element.content || '', data);
    
    if (!content) return; // Don't render empty content

    // Render text
    try {
        ctx.fillText(content, x, y);
    } catch (error) {
        console.warn('Failed to render text element:', error);
    }
}

/**
 * Renders a rectangle element to canvas
 */
function renderRectElement(element, ctx, canvas, data) {
    if (!element || !ctx || !canvas) return;
    
    const x = validateNumber(calculatePosition(element.x, canvas.width, canvas.width), 0);
    const y = validateNumber(calculatePosition(element.y, canvas.height, canvas.height), 0);
    const width = validateNumber(calculatePosition(element.width, canvas.width, canvas.width), 0);
    const height = validateNumber(calculatePosition(element.height, canvas.height, canvas.height), 0);

    // Skip rendering if dimensions are invalid
    if (width <= 0 || height <= 0) return;

    ctx.fillStyle = element.color || '#ffffff';
    
    try {
        ctx.fillRect(x, y, width, height);
    } catch (error) {
        console.warn('Failed to render rect element:', error);
    }
}

/**
 * Validates that a number is finite and not NaN, returns fallback if invalid
 */
function validateNumber(value, fallback = 0) {
    if (typeof value !== 'number' || !isFinite(value) || isNaN(value)) {
        return fallback;
    }
    return value;
}

/**
 * Calculates position from string (supports percentage, calc expressions, and pixel values)
 * @param {string} value - Position value (e.g., "50%", "100px", "calc(40% + 40px)")
 * @param {number} dimension - Canvas dimension (width or height)
 * @param {number} reference - Reference dimension for percentage
 * @returns {number} Calculated pixel position
 */
function calculatePosition(value, dimension, reference) {
    if (!value || typeof value !== 'string') return 0;
    
    // Ensure dimension and reference are valid numbers
    dimension = validateNumber(dimension, 0);
    reference = validateNumber(reference, dimension);

    // Handle calc() expressions (simplified - supports basic addition/subtraction)
    if (value.includes('calc(')) {
        const calcMatch = value.match(/calc\((.+)\)/);
        if (calcMatch) {
            const expr = calcMatch[1];
            // Simple calc parser - supports "percentage +/- pixels"
            const parts = expr.split(/([+-])/);
            let result = 0;
            let operator = '+';
            
            for (let part of parts) {
                part = part.trim();
                if (part === '+' || part === '-') {
                    operator = part;
                } else if (part.endsWith('%')) {
                    const percent = validateNumber(parseFloat(part), 0) / 100;
                    const calcValue = percent * reference;
                    result = operator === '+' ? result + calcValue : result - calcValue;
                } else if (part.endsWith('px')) {
                    const pixels = validateNumber(parseFloat(part), 0);
                    result = operator === '+' ? result + pixels : result - pixels;
                } else {
                    // Assume it's a number
                    const num = validateNumber(parseFloat(part), 0);
                    result = operator === '+' ? result + num : result - num;
                }
            }
            return validateNumber(result, 0);
        }
    }

    // Handle percentage
    if (value.endsWith('%')) {
        const percent = validateNumber(parseFloat(value), 0) / 100;
        return validateNumber(percent * reference, 0);
    }

    // Handle pixels
    if (value.endsWith('px')) {
        return validateNumber(parseFloat(value), 0);
    }

    // Assume it's a number (pixels)
    return validateNumber(parseFloat(value), 0);
}

/**
 * Substitutes template variables in content string
 * @param {string} content - Content string with variables (e.g., "{{percentComplete}}% complete")
 * @param {Object} data - Data object with variable values
 * @returns {string} Content with variables substituted
 */
function substituteVariables(content, data) {
    if (!content) return '';

    return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        if (data.hasOwnProperty(key)) {
            return data[key];
        }
        return match; // Keep original if variable not found
    });
}

