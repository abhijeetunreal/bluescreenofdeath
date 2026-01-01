// Apple modes

import * as state from '../core/state.js';
import { drawWhiteLogo } from '../utils/drawing.js';
import { imgApple } from '../utils/assets.js';

export function initAppleMode(mode, canvas) {
    if (mode === 'macos_drift') {
        const particles = Array.from({length: 80}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            hue: Math.random() * 360
        }));
        state.setParticles(particles);
    }
}

export function renderAppleMode(mode, ctx, canvas) {
    const frame = state.getFrame();
    const progress = state.getProgress();
    
    switch(mode) {
        case 'macos_drift':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const particles = state.getParticles();
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue + (frame % 360)}, 70%, 70%, 0.8)`;
                ctx.fill();
            });
            break;
        case 'macos_hello':
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.font = 'italic bold 100px serif';
            ctx.fillText('hello', canvas.width/2, canvas.height/2);
            break;
        case 'macos_panic':
            ctx.fillStyle = 'rgba(0,0,0,0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText("You need to restart your computer...", canvas.width/2, canvas.height/2);
            break;
        case 'ios_update':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawWhiteLogo(ctx, imgApple, canvas, 80, -60);
            ctx.fillStyle = '#333';
            ctx.fillRect(canvas.width/2 - 75, canvas.height/2 + 50, 150, 3);
            ctx.fillStyle = '#fff';
            ctx.fillRect(canvas.width/2 - 75, canvas.height/2 + 50, (progress % 100 / 100) * 150, 3);
            break;
        case 'ios_disabled':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = '30px sans-serif';
            ctx.fillText("iPhone is disabled", canvas.width/2, canvas.height/2);
            break;
    }
}

