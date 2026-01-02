// Apple modes

import * as state from '../core/state.js';
import { getCanvas } from '../core/canvas.js';
import { drawWhiteLogo, drawiOSProgressBar, drawMacOSProgressBar, drawMacOSBootProgressBar } from '../utils/drawing.js';
import { imgApple, imgAppleWhite } from '../utils/assets.js';
import { loadTemplate } from '../utils/template-loader.js';
import { renderTemplateToCanvas } from '../utils/template-renderer.js';

const templateCache = new Map();
const canvas = getCanvas();
let currentAppleMode = null;

export async function initAppleMode(mode, canvas) {
    // Clean up previous mode if switching
    if (currentAppleMode && currentAppleMode !== mode) {
        cleanupAppleMode();
    }
    
    currentAppleMode = mode;
    
    // Ensure canvas is visible
    if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
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
    
    if (mode === 'macos_boot') {
        // Initialize boot state
        state.resetBootState();
        state.setBootStartFrame(state.getFrame());
        state.setLastProgressUpdate(state.getFrame());
        // Initial delay: 2.5 seconds = 150 frames at 60fps
        state.setNextProgressDelay(150);
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
    // Ensure canvas is visible
    if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
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
            
            // Apple logo - try white version first, fallback to filtered black version
            if (imgAppleWhite && imgAppleWhite.complete && imgAppleWhite.naturalWidth > 0 && !imgAppleWhite._loadFailed) {
                const logoSize = 120;
                const logoX = canvas.width / 2 - logoSize / 2;
                const logoY = canvas.height / 2 - logoSize / 2 - 100;
                ctx.drawImage(imgAppleWhite, logoX, logoY, logoSize, logoSize);
            } else if (imgApple && imgApple.complete && imgApple.naturalWidth > 0 && !imgApple._loadFailed) {
                drawWhiteLogo(ctx, imgApple, canvas, 120, -100);
            }
            
            // Progress bar - wider and more visible
            const barWidth = 250;
            const barHeight = 4;
            const barX = canvas.width / 2 - barWidth / 2;
            const barY = canvas.height / 2 + 50;
            // Clamp progress to 0-1 range
            const progressPercent = Math.max(0, Math.min(1, (progress % 100) / 100));
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
            
            // Apple logo - try white version first, fallback to filtered black version
            if (imgAppleWhite && imgAppleWhite.complete && imgAppleWhite.naturalWidth > 0 && !imgAppleWhite._loadFailed) {
                const logoSize = 120;
                const logoX = canvas.width / 2 - logoSize / 2;
                const logoY = canvas.height / 2 - logoSize / 2 - 80;
                ctx.drawImage(imgAppleWhite, logoX, logoY, logoSize, logoSize);
            } else if (imgApple && imgApple.complete && imgApple.naturalWidth > 0 && !imgApple._loadFailed) {
                drawWhiteLogo(ctx, imgApple, canvas, 120, -80);
            }
            
            // Progress bar with rounded corners - wider
            const barWidth = 250;
            const barHeight = 4;
            const barX = canvas.width / 2 - barWidth / 2;
            const barY = canvas.height / 2 + 60;
            // Clamp progress to 0-1 range
            const progressPercent = Math.max(0, Math.min(1, (progress % 100) / 100));
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
        case 'macos_boot': {
            const bootPhase = state.getBootPhase();
            const bootProgress = state.getBootProgress();
            const bootStartFrame = state.getBootStartFrame();
            const lastProgressUpdate = state.getLastProgressUpdate();
            const nextProgressDelay = state.getNextProgressDelay();
            
            // Update progress with realistic timing
            if (bootPhase === 'booting') {
                const framesSinceStart = frame - bootStartFrame;
                const framesSinceLastUpdate = frame - lastProgressUpdate;
                
                // Check if initial delay has passed (2.5 seconds = 150 frames)
                if (framesSinceStart >= 150 && framesSinceLastUpdate >= nextProgressDelay) {
                    let increment = 0;
                    
                    // Realistic progress behavior matching the HTML example
                    if (bootProgress < 35) {
                        // Slow start: 0.1-0.4% increments
                        increment = Math.random() * 0.3 + 0.1;
                    } else if (bootProgress >= 35 && bootProgress < 70) {
                        // "The Leap": 0.5-6.5% increments
                        increment = Math.random() * 6 + 0.5;
                    } else if (bootProgress >= 70 && bootProgress < 98) {
                        // "The Slog": 0.05% increments
                        increment = 0.05;
                    } else {
                        // Final stretch: 0.01% increments
                        increment = 0.01;
                    }
                    
                    state.setBootProgress(bootProgress + increment);
                    state.setLastProgressUpdate(frame);
                    
                    // Calculate next delay
                    if (bootProgress < 80) {
                        // Early: 50-200ms delay (3-12 frames at 60fps)
                        state.setNextProgressDelay(Math.floor(Math.random() * 9) + 3);
                    } else {
                        // Late: 300-1000ms delay (18-60 frames at 60fps)
                        state.setNextProgressDelay(Math.floor(Math.random() * 42) + 18);
                    }
                }
                
                // Check if progress reached 100%
                if (state.getBootProgress() >= 100) {
                    state.setBootProgress(100);
                    state.setBootPhase('transitioning');
                    state.setLastProgressUpdate(frame);
                }
            }
            
            // Handle transition phase
            if (bootPhase === 'transitioning') {
                const framesSinceTransition = frame - state.getLastProgressUpdate();
                // Transition duration: 1.2 seconds = 72 frames at 60fps
                if (framesSinceTransition < 72) {
                    // Fade out boot screen (opacity goes from 1 to 0)
                    state.setTransitionOpacity(1 - (framesSinceTransition / 72));
                } else {
                    // Switch to login screen
                    state.setBootPhase('login');
                    state.setTransitionOpacity(0);
                    state.setLastProgressUpdate(frame);
                }
            }
            
            // Handle login screen fade in
            if (bootPhase === 'login') {
                const framesSinceLogin = frame - state.getLastProgressUpdate();
                // Fade in duration: 2 seconds = 120 frames at 60fps
                if (framesSinceLogin < 120) {
                    state.setTransitionOpacity(framesSinceLogin / 120);
                } else {
                    state.setTransitionOpacity(1);
                }
            }
            
            // Render based on phase
            if (bootPhase === 'booting' || bootPhase === 'transitioning') {
                // Render boot screen with fade out during transition
                const opacity = bootPhase === 'booting' ? 1 : state.getTransitionOpacity();
                
                // Render template (black background)
                const template = templateCache.get(mode);
                if (template) {
                    renderTemplateToCanvas(template, ctx, canvas, {});
                } else {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                ctx.save();
                ctx.globalAlpha = opacity;
                
                // Apple logo - precise dimensions: 90px width, 110px height
                const logoWidth = 90;
                const logoHeight = 110;
                const logoX = canvas.width / 2 - logoWidth / 2;
                const logoY = canvas.height / 2 - logoHeight / 2 - 80; // 80px above center
                
                if (imgAppleWhite && imgAppleWhite.complete && imgAppleWhite.naturalWidth > 0 && !imgAppleWhite._loadFailed) {
                    ctx.drawImage(imgAppleWhite, logoX, logoY, logoWidth, logoHeight);
                } else if (imgApple && imgApple.complete && imgApple.naturalWidth > 0 && !imgApple._loadFailed) {
                    drawWhiteLogo(ctx, imgApple, canvas, logoWidth, -80);
                }
                
                // Progress bar - 250px width, 6px height
                const barWidth = 250;
                const barHeight = 6;
                const barX = canvas.width / 2 - barWidth / 2;
                const barY = canvas.height / 2 + 50; // 50px below center
                const progressPercent = state.getBootProgress() / 100;
                drawMacOSBootProgressBar(ctx, barX, barY, barWidth, barHeight, progressPercent);
                
                ctx.restore();
            } else if (bootPhase === 'login') {
                // Render login screen with fade in
                const opacity = state.getTransitionOpacity();
                
                ctx.save();
                ctx.globalAlpha = opacity;
                
                // Gradient background (blue to dark blue)
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#4b6cb7');
                gradient.addColorStop(1, '#182848');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // User avatar (circle with emoji)
                const avatarSize = 100;
                const avatarX = canvas.width / 2 - avatarSize / 2;
                const avatarY = canvas.height / 2 - avatarSize / 2 - 20;
                
                // Avatar background (semi-transparent white with blur effect)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.beginPath();
                ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Avatar border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // User emoji/icon (draw a simple user icon)
                ctx.fillStyle = '#ffffff';
                ctx.font = '40px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('👤', canvas.width / 2, avatarY + avatarSize / 2);
                
                // User label
                ctx.font = '20px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('User', canvas.width / 2, avatarY + avatarSize + 20);
                
                ctx.restore();
            }
            break;
        }
    }
}

/**
 * Clean up Apple mode state when switching away from Apple modes
 */
export function cleanupAppleMode() {
    // Show main canvas
    if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
    currentAppleMode = null;
}

