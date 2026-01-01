// Color mode

import * as state from '../core/state.js';

export function initColorMode() {
    // Color mode doesn't need initialization
}

export function renderColorMode(ctx, canvas) {
    ctx.fillStyle = state.getCurrentColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

