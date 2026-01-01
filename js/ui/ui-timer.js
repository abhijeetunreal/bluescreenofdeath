// UI auto-hide timer logic

import { getCanvas, getBody } from '../core/canvas.js';

const canvas = getCanvas();
const body = getBody();
let uiTimeout;

export function resetUITimer() {
    body.classList.remove('hide-ui');
    canvas.style.cursor = 'default';
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(() => {
        body.classList.add('hide-ui');
        canvas.style.cursor = 'none';
    }, 3000);
}

