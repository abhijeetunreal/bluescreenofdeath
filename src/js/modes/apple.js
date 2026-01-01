// Apple modes

import * as state from '../core/state.js';
import { drawWhiteLogo, drawiOSProgressBar, drawMacOSProgressBar } from '../utils/drawing.js';
import { imgApple } from '../utils/assets.js';
import { loadTemplate } from '../utils/template-loader.js';
import { renderTemplateToCanvas } from '../utils/template-renderer.js';

const templateCache = new Map();

export async function initAppleMode(mode, canvas) {
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
    
    // Preload template for this mode
    if (mode && !templateCache.has(mode)) {
        const template = await loadTemplate(mode);
        if (template) {
            templateCache.set(mode, template);
        }
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
                // More realistic drift movement
                p.x += p.vx * 0.5;
                p.y += p.vy * 0.5;
                // Wrap around edges instead of bouncing
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                // Smooth color cycling
                const hue = (p.hue + (frame * 0.5)) % 360;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.9)`;
                ctx.fill();
            });
            break;
        case 'macos_hello': {
            // Render template (preloaded during init)
            const template = templateCache.get(mode);
            renderTemplateToCanvas(template, ctx, canvas, {});
            
            // Apple logo - larger and better positioned
            drawWhiteLogo(ctx, imgApple, canvas, 120, -100);
            
            // Progress bar - wider and more visible
            const barWidth = 250;
            const barHeight = 4;
            const barX = canvas.width / 2 - barWidth / 2;
            const barY = canvas.height / 2 + 50;
            const progressPercent = (progress % 100) / 100;
            drawMacOSProgressBar(ctx, barX, barY, barWidth, barHeight, progressPercent);
            break;
        }
        case 'macos_panic': {
            // Render template (preloaded during init)
            const template = templateCache.get(mode);
            renderTemplateToCanvas(template, ctx, canvas, {});
            
            // Multi-language restart messages - dynamic content (word-wrapped)
            ctx.fillStyle = '#fff';
            ctx.font = '12px "Monaco", "Menlo", "Courier New", monospace';
            ctx.textAlign = 'left';
            
            const margin = 40;
            let yPos = 340; // Start after template content
            const lineHeight = 20;
            
            const messages = [
                'English: You need to restart your computer. Hold down the Power button for several seconds or press the Restart button.',
                'Français: Vous devez redémarrer votre ordinateur. Maintenez le bouton d\'alimentation enfoncé pendant plusieurs secondes ou appuyez sur le bouton de redémarrage.',
                'Deutsch: Sie müssen Ihren Computer neu starten. Halten Sie die Ein-/Aus-Taste einige Sekunden lang gedrückt oder drücken Sie die Neustart-Taste.',
                'Español: Necesitas reiniciar tu ordenador. Mantén pulsado el botón de encendido durante varios segundos o pulsa el botón de reinicio.',
                '日本語: コンピュータを再起動する必要があります。電源ボタンを数秒間長押しするか、再起動ボタンを押してください。',
                '中文: 您需要重新启动电脑。按住电源按钮几秒钟，或按重新启动按钮。',
                '한국어: 컴퓨터를 다시 시작해야 합니다. 전원 버튼을 몇 초 동안 길게 누르거나 재시작 버튼을 누르세요.'
            ];
            
            messages.forEach(msg => {
                // Word wrap for long lines
                const maxWidth = canvas.width - margin * 2;
                const words = msg.split(' ');
                let line = '';
                words.forEach(word => {
                    const testLine = line + word + ' ';
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && line.length > 0) {
                        ctx.fillText(line, margin, yPos);
                        yPos += lineHeight;
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                });
                if (line.length > 0) {
                    ctx.fillText(line, margin, yPos);
                    yPos += lineHeight;
                }
                yPos += 10; // Spacing between languages
            });
            break;
        }
        case 'ios_update': {
            // Render template (preloaded during init)
            const template = templateCache.get(mode);
            renderTemplateToCanvas(template, ctx, canvas, {});
            
            // Apple logo - larger
            drawWhiteLogo(ctx, imgApple, canvas, 120, -80);
            
            // Progress bar with rounded corners - wider
            const barWidth = 250;
            const barHeight = 4;
            const barX = canvas.width / 2 - barWidth / 2;
            const barY = canvas.height / 2 + 60;
            const progressPercent = (progress % 100) / 100;
            drawiOSProgressBar(ctx, barX, barY, barWidth, barHeight, progressPercent);
            
            // Status messages that cycle - more realistic
            const updateMessages = [
                'Preparing update...',
                'Verifying update...',
                'Installing update...',
                'Almost done...'
            ];
            const messageIndex = Math.floor((frame / 100) % updateMessages.length);
            const currentMessage = updateMessages[messageIndex];
            
            // Status text - better positioning
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.font = '20px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
            ctx.fillText(currentMessage, canvas.width / 2, barY + 40);
            break;
        }
        case 'ios_disabled': {
            // Render template (preloaded during init)
            const template = templateCache.get(mode);
            renderTemplateToCanvas(template, ctx, canvas, {});
            
            // Countdown timer (simulate minutes passing) - dynamic content
            // Use frame counter to simulate time - 60 frames = 1 second, 3600 frames = 1 minute
            const framesPerMinute = 3600;
            const totalMinutes = 5;
            const elapsedMinutes = Math.floor((frame / framesPerMinute) % (totalMinutes + 1));
            const remainingMinutes = totalMinutes - elapsedMinutes;
            
            ctx.font = '22px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            
            if (remainingMinutes > 0) {
                const minuteText = remainingMinutes === 1 ? 'minute' : 'minutes';
                ctx.fillText(`Try again in ${remainingMinutes} ${minuteText}`, canvas.width / 2, canvas.height / 2 + 30);
            } else {
                ctx.fillText('iPhone is disabled. Connect to iTunes', canvas.width / 2, canvas.height / 2 + 30);
            }
            break;
        }
    }
}

