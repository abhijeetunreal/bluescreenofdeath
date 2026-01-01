// Miscellaneous modes

import * as state from '../core/state.js';
import { quotes } from '../utils/assets.js';
import { loadTemplate } from '../utils/template-loader.js';
import { renderTemplateToCanvas } from '../utils/template-renderer.js';

const templateCache = new Map();

export async function initMiscMode(mode, canvas) {
    if (mode === 'matrix') {
        const cols = Math.floor(canvas.width / 20);
        const matrixChars = Array(cols).fill(0).map(() => Math.random() * -100);
        state.setMatrixChars(matrixChars);
    } else if (mode === 'quotes') {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        state.setCurrentQuote(randomQuote);
    }
    
    // Preload template for this mode (if it uses one)
    if (mode && !templateCache.has(mode)) {
        const template = await loadTemplate(mode);
        if (template) {
            templateCache.set(mode, template);
        }
    }
}

export function renderMiscMode(mode, ctx, canvas) {
    const frame = state.getFrame();
    
    switch(mode) {
        case 'ubuntu':
            // Render template (preloaded during init)
            const ubuntuTemplate = templateCache.get(mode);
            renderTemplateToCanvas(ubuntuTemplate, ctx, canvas, {});
            break;
        case 'chromeos':
            // Render template (preloaded during init)
            const chromeosTemplate = templateCache.get(mode);
            renderTemplateToCanvas(chromeosTemplate, ctx, canvas, {});
            
            // Add Chrome logo colors (simplified) - dynamic content
            ctx.textAlign = 'center';
            const logoSize = 60;
            const logoX = canvas.width/2 - logoSize/2;
            const logoY = canvas.height/2 - 100;
            const logoCenterX = logoX + logoSize/2;
            const logoCenterY = logoY + logoSize/2;
            
            // Draw simplified Chrome logo (red, green, blue segments)
            ctx.fillStyle = '#EA4335';
            ctx.beginPath();
            ctx.moveTo(logoCenterX, logoCenterY);
            ctx.arc(logoCenterX, logoCenterY, logoSize/2, 0, Math.PI * 2 / 3);
            ctx.lineTo(logoCenterX, logoCenterY);
            ctx.fill();
            
            ctx.fillStyle = '#34A853';
            ctx.beginPath();
            ctx.moveTo(logoCenterX, logoCenterY);
            ctx.arc(logoCenterX, logoCenterY, logoSize/2, Math.PI * 2 / 3, Math.PI * 4 / 3);
            ctx.lineTo(logoCenterX, logoCenterY);
            ctx.fill();
            
            ctx.fillStyle = '#4285F4';
            ctx.beginPath();
            ctx.moveTo(logoCenterX, logoCenterY);
            ctx.arc(logoCenterX, logoCenterY, logoSize/2, Math.PI * 4 / 3, Math.PI * 2);
            ctx.lineTo(logoCenterX, logoCenterY);
            ctx.fill();
            break;
        case 'matrix':
            // Matrix rain effect - darker fade
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = 'bold 16px "Courier New", monospace';
            const matrixChars = state.getMatrixChars();
            // Japanese katakana and other characters for more realistic matrix
            const matrixCharSet = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            matrixChars.forEach((y, i) => {
                const char = matrixCharSet[Math.floor(Math.random() * matrixCharSet.length)];
                // Varying brightness for leading character
                const brightness = y < 50 ? 1 : Math.max(0.2, 1 - (y / canvas.height));
                ctx.fillStyle = `rgba(0, 255, 0, ${brightness})`;
                ctx.fillText(char, i * 20, y);
                if (y > canvas.height && Math.random() > 0.98) {
                    matrixChars[i] = -Math.random() * 200;
                } else {
                    matrixChars[i] += 15;
                }
            });
            break;
        case 'dvd':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const dvdPos = state.getDvdPos();
            dvdPos.x += dvdPos.vx;
            dvdPos.y += dvdPos.vy;
            // Bounce off edges
            if (dvdPos.x <= 0 || dvdPos.x + 120 >= canvas.width) dvdPos.vx *= -1;
            if (dvdPos.y <= 0 || dvdPos.y + 60 >= canvas.height) dvdPos.vy *= -1;
            // DVD logo with text
            ctx.fillStyle = '#fff';
            ctx.fillRect(dvdPos.x, dvdPos.y, 120, 60);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('DVD', dvdPos.x + 60, dvdPos.y + 40);
            break;
        case 'flip_clock':
            // Render template (preloaded during init)
            const flipClockTemplate = templateCache.get(mode);
            renderTemplateToCanvas(flipClockTemplate, ctx, canvas, {});
            
            // Time display - dynamic content
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = 'bold 96px "Courier New", monospace';
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
            ctx.fillText(timeStr, canvas.width/2, canvas.height/2);
            break;
        case 'quotes':
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = 'italic 28px "Georgia", serif';
            const quote = state.getCurrentQuote();
            // Word wrap for long quotes
            const maxWidth = canvas.width - 80;
            const words = quote.split(' ');
            let line = '';
            let yPos = canvas.height / 2 - 40;
            words.forEach(word => {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && line.length > 0) {
                    ctx.fillText('"' + line, canvas.width/2, yPos);
                    yPos += 35;
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            });
            if (line.length > 0) {
                ctx.fillText('"' + line + '"', canvas.width/2, yPos);
            }
            break;
    }
}

