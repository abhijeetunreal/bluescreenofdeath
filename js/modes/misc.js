// Miscellaneous modes

import * as state from '../core/state.js';
import { quotes } from '../utils/assets.js';

export function initMiscMode(mode, canvas) {
    if (mode === 'matrix') {
        const cols = Math.floor(canvas.width / 20);
        const matrixChars = Array(cols).fill(0).map(() => Math.random() * -100);
        state.setMatrixChars(matrixChars);
    } else if (mode === 'quotes') {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        state.setCurrentQuote(randomQuote);
    }
}

export function renderMiscMode(mode, ctx, canvas) {
    const frame = state.getFrame();
    
    switch(mode) {
        case 'ubuntu':
            ctx.fillStyle = '#300a24';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText("ubuntu 22.04", canvas.width/2, canvas.height - 100);
            break;
        case 'chromeos':
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#4285F4';
            ctx.textAlign = 'center';
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText("chromeOS", canvas.width/2, canvas.height/2);
            break;
        case 'matrix':
            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = '18px monospace';
            const matrixChars = state.getMatrixChars();
            matrixChars.forEach((y, i) => {
                ctx.fillText(String.fromCharCode(Math.random() * 128), i * 20, y);
                if (y > canvas.height && Math.random() > 0.975) {
                    matrixChars[i] = 0;
                } else {
                    matrixChars[i] += 20;
                }
            });
            break;
        case 'dvd':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const dvdPos = state.getDvdPos();
            dvdPos.x += dvdPos.vx;
            dvdPos.y += dvdPos.vy;
            if (dvdPos.x <= 0 || dvdPos.x + 100 >= canvas.width) dvdPos.vx *= -1;
            if (dvdPos.y <= 0 || dvdPos.y + 50 >= canvas.height) dvdPos.vy *= -1;
            ctx.fillStyle = '#fff';
            ctx.fillRect(dvdPos.x, dvdPos.y, 100, 50);
            break;
        case 'flip_clock':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = 'bold 80px monospace';
            ctx.fillText(new Date().toLocaleTimeString(), canvas.width/2, canvas.height/2);
            break;
        case 'quotes':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = 'italic 24px serif';
            ctx.fillText('"' + state.getCurrentQuote() + '"', canvas.width/2, canvas.height/2);
            break;
    }
}

