// UI timer – auto-hide disabled; bar stays visible (show/hide only on click if you add that later)

import { getCanvas, getBody } from '../core/canvas.js';

const canvas = getCanvas();
const body = getBody();

export function resetUITimer() {
    if (!body || !canvas) return;
    body.classList.remove('hide-ui');
    if (canvas.style) canvas.style.cursor = 'default';
}

