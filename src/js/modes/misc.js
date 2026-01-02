// Miscellaneous modes

import * as state from '../core/state.js';
import { getCanvas } from '../core/canvas.js';
import { quotes, imgChrome, imgUbuntu } from '../utils/assets.js';
import { loadTemplate } from '../utils/template-loader.js';
import { renderTemplateToCanvas } from '../utils/template-renderer.js';

const templateCache = new Map();
const canvas = getCanvas();
let currentMiscMode = null;

export async function initMiscMode(mode, canvas) {
    // Clean up previous mode if switching
    if (currentMiscMode && currentMiscMode !== mode) {
        cleanupMiscMode();
    }
    
    currentMiscMode = mode;
    
    // Ensure canvas is visible
    if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
    if (mode === 'matrix') {
        const cols = Math.floor(canvas.width / 20);
        const matrixChars = Array(cols).fill(0).map(() => Math.random() * -100);
        state.setMatrixChars(matrixChars);
    } else if (mode === 'quotes') {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        state.setCurrentQuote(randomQuote);
    } else if (mode === 'dvd') {
        // Reset DVD position to center of canvas on resize
        const dvdPos = state.getDvdPos();
        dvdPos.x = Math.max(0, Math.min(canvas.width - 120, dvdPos.x || canvas.width / 2));
        dvdPos.y = Math.max(0, Math.min(canvas.height - 60, dvdPos.y || canvas.height / 2));
        // Ensure position is within bounds
        if (dvdPos.x + 120 > canvas.width) dvdPos.x = canvas.width - 120;
        if (dvdPos.y + 60 > canvas.height) dvdPos.y = canvas.height - 60;
        state.setDvdPos(dvdPos);
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
    // Ensure canvas is visible
    if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
    const frame = state.getFrame();
    
    switch(mode) {
        case 'ubuntu':
            // Render template (preloaded during init)
            const ubuntuTemplate = templateCache.get(mode);
            renderTemplateToCanvas(ubuntuTemplate, ctx, canvas, {});
            
            // Ubuntu logo - positioned well above text to avoid overlap
            if (imgUbuntu && imgUbuntu.complete && imgUbuntu.naturalWidth > 0 && !imgUbuntu._loadFailed) {
                ctx.textAlign = 'center';
                const logoSize = 120;
                const logoX = canvas.width / 2 - logoSize / 2;
                // Position logo at 35% from top to ensure no overlap with text at 50%
                const logoY = canvas.height * 0.35 - logoSize / 2;
                ctx.drawImage(imgUbuntu, logoX, logoY, logoSize, logoSize);
            }
            break;
        case 'chromeos':
            // Render template (preloaded during init)
            const chromeosTemplate = templateCache.get(mode);
            // Realistic progress calculation - simulates average PC update timing
            // At 60fps: 3600 frames = 60 seconds to reach 100% (realistic for average PC)
            // Progress is non-linear: faster at start, slower in middle, speeds up near end
            const cycleFrames = 3600; // 60 seconds at 60fps
            const rawProgress = (frame % cycleFrames) / cycleFrames;
            // Apply easing curve for more realistic progress (ease-in-out with slight variation)
            // Fast start (0-30%), slow middle (30-70%), faster end (70-100%)
            let slowProgress;
            if (rawProgress < 0.3) {
                // Fast initial progress
                slowProgress = rawProgress * 1.2;
            } else if (rawProgress < 0.7) {
                // Slower middle section
                slowProgress = 0.36 + (rawProgress - 0.3) * 0.85;
            } else {
                // Faster final section
                slowProgress = 0.7 + (rawProgress - 0.7) * 1.5;
            }
            // Ensure progress is within valid bounds
            slowProgress = Math.max(0, Math.min(1, slowProgress));
            const percentComplete = Math.max(0, Math.min(100, Math.floor(slowProgress * 100)));
            renderTemplateToCanvas(chromeosTemplate, ctx, canvas, { percentComplete });
            
            // Draw official Chrome logo - positioned above text
            ctx.textAlign = 'center';
            const logoSize = 80;
            const logoX = canvas.width / 2 - logoSize / 2;
            const logoY = canvas.height * 0.35 - 40 - logoSize / 2;
            
            // Draw official Chrome logo image
            if (imgChrome && imgChrome.complete && imgChrome.naturalWidth > 0 && !imgChrome._loadFailed) {
                ctx.drawImage(imgChrome, logoX, logoY, logoSize, logoSize);
            }
            
            // Draw progress bar below text
            const progressBarY = canvas.height * 0.35 + 250;
            const progressBarWidth = 400;
            const progressBarHeight = 6;
            const progressBarX = canvas.width / 2 - progressBarWidth / 2;
            const progressPercent = slowProgress;
            
            // Progress bar background (light gray)
            ctx.fillStyle = '#E8EAED';
            ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
            
            // Progress bar fill (Chrome blue)
            const fillWidth = progressPercent * progressBarWidth;
            ctx.fillStyle = '#4285F4';
            ctx.fillRect(progressBarX, progressBarY, fillWidth, progressBarHeight);
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

/**
 * Clean up Misc mode state when switching away from Misc modes
 */
export function cleanupMiscMode() {
    // Show main canvas
    if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
    currentMiscMode = null;
}

