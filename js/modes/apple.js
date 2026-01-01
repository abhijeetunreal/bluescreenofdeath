// Apple modes

import * as state from '../core/state.js';
import { drawWhiteLogo, drawiOSProgressBar, drawMacOSProgressBar } from '../utils/drawing.js';
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
        case 'macos_hello': {
            // macOS boot screen
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Apple logo
            drawWhiteLogo(ctx, imgApple, canvas, 100, -80);
            
            // Progress bar
            const barWidth = 200;
            const barHeight = 4;
            const barX = canvas.width / 2 - barWidth / 2;
            const barY = canvas.height / 2 + 40;
            const progressPercent = (progress % 100) / 100;
            drawMacOSProgressBar(ctx, barX, barY, barWidth, barHeight, progressPercent);
            break;
        }
        case 'macos_panic': {
            // macOS Kernel Panic screen
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#fff';
            ctx.font = '14px "Monaco", "Menlo", "Courier New", monospace';
            ctx.textAlign = 'left';
            
            const margin = 40;
            let yPos = 60;
            const lineHeight = 20;
            const sectionSpacing = 30;
            
            // Panic message header
            ctx.font = 'bold 14px "Monaco", "Menlo", "Courier New", monospace';
            ctx.fillText('panic(cpu 0 caller 0xffffff80002d3a5a): Kernel trap at 0x0000000000000000, type 14=page fault', margin, yPos);
            yPos += lineHeight * 2;
            
            // Backtrace
            ctx.font = '14px "Monaco", "Menlo", "Courier New", monospace';
            ctx.fillText('Backtrace (CPU 0), Frame : Return Address', margin, yPos);
            yPos += lineHeight;
            ctx.fillText('0xffffff8012345678 : 0xffffff80002d3a5a', margin + 20, yPos);
            yPos += lineHeight;
            ctx.fillText('0xffffff8012345680 : 0xffffff80002d3a5a', margin + 20, yPos);
            yPos += lineHeight;
            ctx.fillText('0xffffff8012345688 : 0xffffff80002d3a5a', margin + 20, yPos);
            yPos += sectionSpacing;
            
            // System information
            ctx.fillText('BSD process name corresponding to current thread: kernel_task', margin, yPos);
            yPos += lineHeight;
            ctx.fillText('Mac OS version:', margin, yPos);
            yPos += lineHeight;
            ctx.fillText('Not yet set', margin + 20, yPos);
            yPos += lineHeight;
            ctx.fillText('Kernel version:', margin, yPos);
            yPos += lineHeight;
            ctx.fillText('Darwin Kernel Version 22.1.0: Mon Oct 24 20:28:05 PDT 2022; root:xnu-8792.41.9~2/RELEASE_ARM64_T6000', margin + 20, yPos);
            yPos += sectionSpacing * 2;
            
            // Multi-language restart messages
            const messages = [
                'English: You need to restart your computer. Hold down the Power button for several seconds or press the Restart button.',
                'Français: Vous devez redémarrer votre ordinateur. Maintenez le bouton d\'alimentation enfoncé pendant plusieurs secondes ou appuyez sur le bouton de redémarrage.',
                'Deutsch: Sie müssen Ihren Computer neu starten. Halten Sie die Ein-/Aus-Taste einige Sekunden lang gedrückt oder drücken Sie die Neustart-Taste.',
                'Español: Necesitas reiniciar tu ordenador. Mantén pulsado el botón de encendido durante varios segundos o pulsa el botón de reinicio.',
                '日本語: コンピュータを再起動する必要があります。電源ボタンを数秒間長押しするか、再起動ボタンを押してください。',
                '中文: 您需要重新启动电脑。按住电源按钮几秒钟，或按重新启动按钮。',
                '한국어: 컴퓨터를 다시 시작해야 합니다. 전원 버튼을 몇 초 동안 길게 누르거나 재시작 버튼을 누르세요.'
            ];
            
            ctx.font = '12px "Monaco", "Menlo", "Courier New", monospace';
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
                yPos += 8; // Small spacing between languages
            });
            break;
        }
        case 'ios_update': {
            // iOS Update screen
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Apple logo
            drawWhiteLogo(ctx, imgApple, canvas, 100, -60);
            
            // Progress bar with rounded corners
            const barWidth = 200;
            const barHeight = 4;
            const barX = canvas.width / 2 - barWidth / 2;
            const barY = canvas.height / 2 + 50;
            const progressPercent = (progress % 100) / 100;
            drawiOSProgressBar(ctx, barX, barY, barWidth, barHeight, progressPercent);
            
            // Status messages that cycle
            const updateMessages = [
                'Preparing update...',
                'Verifying update...',
                'Installing update...',
                'Almost done...'
            ];
            const messageIndex = Math.floor((frame / 120) % updateMessages.length);
            const currentMessage = updateMessages[messageIndex];
            
            // Status text
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.font = '18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
            ctx.fillText(currentMessage, canvas.width / 2, barY + 35);
            break;
        }
        case 'ios_disabled': {
            // iPhone Disabled screen
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = '32px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
            
            // Main message
            ctx.fillText('iPhone is disabled', canvas.width / 2, canvas.height / 2 - 30);
            
            // Countdown timer (simulate minutes passing)
            // Use frame counter to simulate time - 60 frames = 1 second, 3600 frames = 1 minute
            const framesPerMinute = 3600;
            const totalMinutes = 5;
            const elapsedMinutes = Math.floor((frame / framesPerMinute) % (totalMinutes + 1));
            const remainingMinutes = totalMinutes - elapsedMinutes;
            
            ctx.font = '20px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
            ctx.fillStyle = '#999';
            
            if (remainingMinutes > 0) {
                const minuteText = remainingMinutes === 1 ? 'minute' : 'minutes';
                ctx.fillText(`Try again in ${remainingMinutes} ${minuteText}`, canvas.width / 2, canvas.height / 2 + 20);
            } else {
                ctx.fillText('iPhone is disabled. Connect to iTunes', canvas.width / 2, canvas.height / 2 + 20);
            }
            break;
        }
    }
}

