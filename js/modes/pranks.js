// Prank modes

import * as state from '../core/state.js';
import { drawBrokenScreen } from '../utils/drawing.js';

export function initPrankMode(mode, canvas) {
    if (mode === 'broken_screen') {
        const crackLines = Array.from({length: 12}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            angle: Math.random() * Math.PI * 2,
            length: 100 + Math.random() * 400
        }));
        state.setCrackLines(crackLines);
    } else if (mode === 'hacker') {
        state.setHackerLines([]);
    }
}

export function renderPrankMode(mode, ctx, canvas) {
    const frame = state.getFrame();
    
    switch(mode) {
        case 'broken_screen':
            drawBrokenScreen(ctx, canvas, state.getCrackLines());
            break;
        case 'white_noise':
            const id = ctx.createImageData(canvas.width, canvas.height);
            for (let i = 0; i < id.data.length; i += 4) {
                const v = Math.random() * 255;
                id.data[i] = id.data[i+1] = id.data[i+2] = v;
                id.data[i+3] = 255;
            }
            ctx.putImageData(id, 0, 0);
            break;
        case 'radar':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width/2;
            const cy = canvas.height/2;
            const r = Math.min(cx, cy) * 0.8;
            const angle = (frame / 50) % (Math.PI * 2);
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
            ctx.stroke();
            break;
        case 'hacker':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = '14px monospace';
            if (frame % 5 === 0) {
                state.addHackerLine("0x" + Math.random().toString(16).slice(2, 10).toUpperCase() + " PROCESSING...");
            }
            state.getHackerLines().forEach((l, i) => ctx.fillText(l, 20, 30 + i*20));
            break;
        case 'no_signal':
            const cols = ['#fff', '#ff0', '#0ff', '#0f0', '#f0f', '#f00', '#00f'];
            cols.forEach((c, i) => {
                ctx.fillStyle = c;
                ctx.fillRect(i * (canvas.width/7), 0, canvas.width/7, canvas.height);
            });
            break;
    }
}

