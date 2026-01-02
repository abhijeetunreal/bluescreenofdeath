// UI auto-hide timer logic

import { getCanvas, getBody } from '../core/canvas.js';

const canvas = getCanvas();
const body = getBody();
let uiTimeout;

export function resetUITimer() {
    if (!body || !canvas) {
        return;
    }
    
    body.classList.remove('hide-ui');
    if (canvas.style) {
        canvas.style.cursor = 'default';
    }
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(() => {
        if (body && canvas) {
            body.classList.add('hide-ui');
            if (canvas.style) {
                canvas.style.cursor = 'none';
            }
        }
    }, 3000);
}

