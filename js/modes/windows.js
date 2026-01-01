// Windows modes

import * as state from '../core/state.js';
import { drawWhiteLogo, drawWinSpinner, drawWinXPUpdate } from '../utils/drawing.js';
import { imgWin } from '../utils/assets.js';

export function initWindowsMode(mode, canvas) {
    // Windows modes don't need special initialization
}

export function renderWindowsMode(mode, ctx, canvas) {
    const frame = state.getFrame();
    const progress = state.getProgress();
    
    switch(mode) {
        case 'win_10_upd':
            ctx.fillStyle = '#0067b8';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawWhiteLogo(ctx, imgWin, canvas, 100, -100);
            drawWinSpinner(ctx, canvas.width/2, canvas.height/2 + 10, 35, frame);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = '22px Segoe UI';
            ctx.fillText(`Working on updates ${Math.min(100, Math.floor(progress*10)) % 101}%`, canvas.width/2, canvas.height/2 + 80);
            break;
        case 'win_xp_upd':
            drawWinXPUpdate(ctx, canvas, progress);
            break;
        case 'win_10_bsod':
            ctx.fillStyle = '#0078d7';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '100px Segoe UI';
            ctx.fillText(':(', 100, 200);
            ctx.font = '24px Segoe UI';
            ctx.fillText('Your PC ran into a problem...', 100, 300);
            break;
        case 'win_xp_bsod':
            ctx.fillStyle = '#0000aa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '16px monospace';
            ["A problem has been detected...", "STOP: 0x000000D1", "Check hardware..."].forEach((l, i) => ctx.fillText(l, 40, 60 + i*22));
            break;
        case 'win_bios':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ccc';
            ctx.font = '14px monospace';
            ["BIOS Ver 1.0.4", "Memory Check: 16384MB OK", "Booting..."].forEach((l, i) => {
                if (frame > i*20) ctx.fillText(l, 40, 40 + i*20);
            });
            break;
    }
}

