// Template renderer utility - renders parsed templates to canvas

/**
 * Renders a parsed template to canvas
 * @param {Object} template - Parsed template object from template-loader
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} data - Data object for template variable substitution (e.g., {progress, frame, percentComplete})
 */
export function renderTemplateToCanvas(template, ctx, canvas, data = {}) {
    if (!template) {
        return; // No template to render
    }

    // Render background
    if (template.background) {
        ctx.fillStyle = template.background.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Render elements
    template.elements.forEach(element => {
        if (element.type === 'text') {
            renderTextElement(element, ctx, canvas, data);
        } else if (element.type === 'rect') {
            renderRectElement(element, ctx, canvas, data);
        }
    });
}

/**
 * Renders a text element to canvas
 */
function renderTextElement(element, ctx, canvas, data) {
    // Calculate position (supports percentage and calc expressions)
    const x = calculatePosition(element.x, canvas.width, canvas.width);
    const y = calculatePosition(element.y, canvas.height, canvas.height);

    // Set font
    ctx.font = element.font;

    // Set color
    ctx.fillStyle = element.color;

    // Set alignment
    ctx.textAlign = element.align || 'left';

    // Substitute template variables in content
    let content = substituteVariables(element.content, data);

    // Render text
    ctx.fillText(content, x, y);
}

/**
 * Renders a rectangle element to canvas
 */
function renderRectElement(element, ctx, canvas, data) {
    const x = calculatePosition(element.x, canvas.width, canvas.width);
    const y = calculatePosition(element.y, canvas.height, canvas.height);
    const width = calculatePosition(element.width, canvas.width, canvas.width);
    const height = calculatePosition(element.height, canvas.height, canvas.height);

    ctx.fillStyle = element.color;
    ctx.fillRect(x, y, width, height);
}

/**
 * Calculates position from string (supports percentage, calc expressions, and pixel values)
 * @param {string} value - Position value (e.g., "50%", "100px", "calc(40% + 40px)")
 * @param {number} dimension - Canvas dimension (width or height)
 * @param {number} reference - Reference dimension for percentage
 * @returns {number} Calculated pixel position
 */
function calculatePosition(value, dimension, reference) {
    if (!value) return 0;

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
                    const percent = parseFloat(part) / 100;
                    const value = percent * reference;
                    result = operator === '+' ? result + value : result - value;
                } else if (part.endsWith('px')) {
                    const pixels = parseFloat(part);
                    result = operator === '+' ? result + pixels : result - pixels;
                } else {
                    // Assume it's a number
                    const num = parseFloat(part);
                    result = operator === '+' ? result + num : result - num;
                }
            }
            return result;
        }
    }

    // Handle percentage
    if (value.endsWith('%')) {
        const percent = parseFloat(value) / 100;
        return percent * reference;
    }

    // Handle pixels
    if (value.endsWith('px')) {
        return parseFloat(value);
    }

    // Assume it's a number (pixels)
    return parseFloat(value) || 0;
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

