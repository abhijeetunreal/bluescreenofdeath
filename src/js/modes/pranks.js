// Prank modes

import * as state from '../core/state.js';
import { drawBrokenScreen } from '../utils/drawing.js';
import { loadTemplate } from '../utils/template-loader.js';
import { renderTemplateToCanvas } from '../utils/template-renderer.js';

const templateCache = new Map();

export async function initPrankMode(mode, canvas) {
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
    
    // Preload template for this mode (if it uses one)
    if (mode && !templateCache.has(mode)) {
        const template = await loadTemplate(mode);
        if (template) {
            templateCache.set(mode, template);
        }
    }
}

export function renderPrankMode(mode, ctx, canvas) {
    const frame = state.getFrame();
    
    switch(mode) {
        case 'broken_screen':
            drawBrokenScreen(ctx, canvas, state.getCrackLines());
            break;
        case 'white_noise':
            // More realistic TV static
            const id = ctx.createImageData(canvas.width, canvas.height);
            for (let i = 0; i < id.data.length; i += 4) {
                // More varied noise with slight color variation
                const base = Math.random() * 255;
                const variation = (Math.random() - 0.5) * 30;
                const r = Math.max(0, Math.min(255, base + variation));
                const g = Math.max(0, Math.min(255, base + variation));
                const b = Math.max(0, Math.min(255, base + variation));
                id.data[i] = r;
                id.data[i+1] = g;
                id.data[i+2] = b;
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
            const angle = (frame / 45) % (Math.PI * 2);
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            
            // Draw concentric circles
            for (let i = 1; i <= 4; i++) {
                ctx.beginPath();
                ctx.arc(cx, cy, (r / 4) * i, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Draw sweep line with fade
            ctx.save();
            ctx.globalAlpha = 0.3;
            for (let i = 0; i < 30; i++) {
                const sweepAngle = angle - (i * 0.05);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(sweepAngle) * r, cy + Math.sin(sweepAngle) * r);
                ctx.stroke();
            }
            ctx.restore();
            
            // Main sweep line
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
            ctx.stroke();
            
            // Add some random blips
            if (frame % 30 === 0) {
                for (let i = 0; i < 3; i++) {
                    const blipAngle = Math.random() * Math.PI * 2;
                    const blipDist = Math.random() * r * 0.7;
                    ctx.fillStyle = '#00ff00';
                    ctx.beginPath();
                    ctx.arc(cx + Math.cos(blipAngle) * blipDist, cy + Math.sin(blipAngle) * blipDist, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;
        case 'hacker':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = 'bold 14px "Courier New", "Lucida Console", monospace';
            
            // Add new lines periodically
            if (frame % 4 === 0) {
                const prefixes = ['0x', 'MEM:', 'CPU:', 'NET:', 'SYS:'];
                const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                const hex = Math.random().toString(16).slice(2, 10).toUpperCase();
                const actions = ['PROCESSING...', 'ACCESSING...', 'ENCRYPTING...', 'DECRYPTING...', 'SCANNING...', 'LOADING...'];
                const action = actions[Math.floor(Math.random() * actions.length)];
                state.addHackerLine(`${prefix}${hex} ${action}`);
            }
            
            // Display lines with fade effect
            const lines = state.getHackerLines();
            const maxLines = Math.floor(canvas.height / 20) - 1;
            const displayLines = lines.slice(-maxLines);
            displayLines.forEach((l, i) => {
                const opacity = 1 - (i / maxLines) * 0.5;
                ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
                ctx.fillText(l, 20, 30 + i * 20);
            });
            break;
        case 'no_signal':
            // Render template (preloaded during init)
            const template = templateCache.get(mode);
            renderTemplateToCanvas(template, ctx, canvas, {});
            break;
    }
}

