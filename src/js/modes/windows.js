// Windows modes

import * as state from '../core/state.js';
import { drawWhiteLogo, drawWinSpinner, drawWinXPUpdate, drawWin10Spinner } from '../utils/drawing.js';
import { imgWin } from '../utils/assets.js';
import { drawQRCode } from '../utils/qrcode.js';
import { loadTemplate } from '../utils/template-loader.js';
import { renderTemplateToCanvas } from '../utils/template-renderer.js';

const templateCache = new Map();

// Mode-specific state for enhanced BSOD
let enhancedBsodState = {
    progress: 0,
    lastUpdateFrame: 0,
    nextUpdateDelay: 0, // frames to wait before next update
    blackScreenActive: false,
    blackScreenStartFrame: 0,
    reached100Frame: 0
};

export async function initWindowsMode(mode, canvas) {
    // Preload template for this mode
    if (mode && !templateCache.has(mode)) {
        const template = await loadTemplate(mode);
        if (template) {
            templateCache.set(mode, template);
        }
    }
    
    // Reset enhanced BSOD state when initializing that mode
    if (mode === 'win_10_bsod_enhanced') {
        enhancedBsodState = {
            progress: 0,
            lastUpdateFrame: 0,
            nextUpdateDelay: 60, // Start after ~1 second (assuming 60fps)
            blackScreenActive: false,
            blackScreenStartFrame: 0,
            reached100Frame: 0
        };
    }
}

export function renderWindowsMode(mode, ctx, canvas) {
    const frame = state.getFrame();
    const progress = state.getProgress();
    
    switch(mode) {
        case 'win_10_upd': {
            // Render template (preloaded during init)
            const template = templateCache.get(mode);
            const percentComplete = Math.min(100, Math.floor(progress * 100));
            renderTemplateToCanvas(template, ctx, canvas, { percentComplete });
            
            // Main section positioned at 40% from top (matching reference)
            const mainSectionY = canvas.height * 0.4;
            
            // Windows logo - positioned above spinner
            if (imgWin.complete && imgWin.naturalWidth > 0) {
                const logoSize = 80;
                const logoX = canvas.width / 2 - logoSize / 2;
                const logoY = mainSectionY - 120;
                ctx.drawImage(imgWin, logoX, logoY, logoSize, logoSize);
            }
            
            // Improved spinner with 6 dots - positioned above text
            const loaderSize = 40;
            drawWin10Spinner(ctx, canvas.width/2, mainSectionY - loaderSize/2 - 20, loaderSize/2, frame);
            break;
        }
        case 'win_xp_upd':
            drawWinXPUpdate(ctx, canvas, progress);
            break;
        case 'win_10_bsod_enhanced': {
            // Handle black screen overlay
            if (enhancedBsodState.blackScreenActive) {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // After 3 seconds of black screen, reset (simulate restart)
                const blackScreenDuration = frame - enhancedBsodState.blackScreenStartFrame;
                if (blackScreenDuration > 180) { // ~3 seconds at 60fps
                    // Reset state for next cycle
                    enhancedBsodState.progress = 0;
                    enhancedBsodState.lastUpdateFrame = frame;
                    enhancedBsodState.nextUpdateDelay = 60;
                    enhancedBsodState.blackScreenActive = false;
                    enhancedBsodState.reached100Frame = 0;
                }
                break;
            }
            
            // Update progress with realistic stuttering animation
            if (enhancedBsodState.progress < 100) {
                const framesSinceLastUpdate = frame - enhancedBsodState.lastUpdateFrame;
                
                if (framesSinceLastUpdate >= enhancedBsodState.nextUpdateDelay) {
                    // Random increment between 1-5%
                    const increment = Math.floor(Math.random() * 5) + 1;
                    enhancedBsodState.progress = Math.min(100, enhancedBsodState.progress + increment);
                    enhancedBsodState.lastUpdateFrame = frame;
                    
                    // Random delay between 1-4 seconds (60-240 frames at 60fps)
                    enhancedBsodState.nextUpdateDelay = Math.floor(Math.random() * 180) + 60;
                }
            } else if (enhancedBsodState.progress >= 100 && enhancedBsodState.reached100Frame === 0) {
                // Just reached 100%, record the frame
                enhancedBsodState.reached100Frame = frame;
            } else if (enhancedBsodState.reached100Frame > 0) {
                // Wait 2 seconds at 100% before showing black screen
                const framesAt100 = frame - enhancedBsodState.reached100Frame;
                if (framesAt100 > 120) { // ~2 seconds at 60fps
                    enhancedBsodState.blackScreenActive = true;
                    enhancedBsodState.blackScreenStartFrame = frame;
                }
            }
            
            // Render background from template
            const template = templateCache.get(mode);
            if (template && template.background) {
                ctx.fillStyle = template.background.color;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                // Fallback background color
                ctx.fillStyle = '#0078D7';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Calculate centered layout (matching HTML design - 85% width, max 1000px)
            const containerWidth = Math.min(1000, canvas.width * 0.85);
            const containerX = (canvas.width - containerWidth) / 2;
            const containerY = canvas.height * 0.5 - 200; // Start from center, offset up
            
            // Draw large sad face emoji (120px font size, matching HTML)
            ctx.fillStyle = '#fff';
            ctx.font = '120px "Segoe UI", sans-serif';
            ctx.textAlign = 'left';
            const sadFaceY = containerY;
            ctx.fillText(':(', containerX, sadFaceY);
            
            // Main message text (24px, light weight)
            const messageY = containerY + 140;
            ctx.font = '300 24px "Segoe UI", "Segoe UI Light", "Segoe UI Semilight", sans-serif';
            ctx.fillText('Your PC ran into a problem and needs to restart. We\'re just collecting some error info, and then we\'ll restart for you.', containerX, messageY);
            
            // Progress percentage (24px, light weight)
            const progressY = messageY + 60;
            const percentComplete = Math.floor(enhancedBsodState.progress);
            ctx.fillText(`${percentComplete}% complete`, containerX, progressY);
            
            // Draw QR code and details section
            const qrSize = 120;
            const qrX = containerX;
            const qrY = progressY + 60; // Below progress with spacing
            
            // QR code with white background padding
            ctx.fillStyle = '#fff';
            ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
            drawQRCode(ctx, qrX, qrY, qrSize);
            
            // Details text positioned to the right of QR code
            const detailsX = qrX + qrSize + 30;
            const detailsY = qrY;
            
            ctx.fillStyle = '#fff';
            ctx.font = '300 14px "Segoe UI", "Segoe UI Light", "Segoe UI Semilight", sans-serif';
            ctx.textAlign = 'left';
            
            // Draw details text
            let detailY = detailsY;
            ctx.fillText('For more information about this issue and possible fixes, visit https://www.windows.com/stopcode', detailsX, detailY);
            detailY += 20;
            ctx.fillText('If you call a support person, give them this info:', detailsX, detailY);
            detailY += 20;
            ctx.font = '14px "Segoe UI", sans-serif';
            ctx.fillText('Stop code: ', detailsX, detailY);
            const stopCodeX = detailsX + ctx.measureText('Stop code: ').width;
            ctx.font = 'bold 14px "Segoe UI", sans-serif';
            ctx.fillText('CRITICAL_PROCESS_DIED', stopCodeX, detailY);
            
            ctx.textAlign = 'left';
            break;
        }
        case 'win_xp_bsod': {
            // Render template (preloaded during init)
            const template = templateCache.get(mode);
            renderTemplateToCanvas(template, ctx, canvas, {});
            
            // Memory dump info - progressive display based on progress (dynamic content)
            const xpMargin = 30;
            let yPos = 408 + 54; // Start after template content
            const lineHeight = 18;
            const dumpProgress = Math.min(1, progress * 2);
            
            ctx.fillStyle = '#fff';
            ctx.font = '16px "Courier New", "Lucida Console", monospace';
            
            if (dumpProgress > 0.3) {
                ctx.fillText('Technical information:', xpMargin, yPos);
                yPos += lineHeight * 2;
            }
            if (dumpProgress > 0.4) {
                ctx.fillText('*** STOP: 0x000000D1 (0x00000000, 0x00000002, 0x00000000, 0xF8A0B2C4)', xpMargin, yPos);
                yPos += lineHeight;
            }
            if (dumpProgress > 0.5) {
                ctx.fillText('*** ntoskrnl.exe - Address F8A0B2C4 base at F8A00000, DateStamp 3b7d855c', xpMargin, yPos);
                yPos += lineHeight * 2;
            }
            if (dumpProgress > 0.6) {
                ctx.fillText('Beginning dump of physical memory', xpMargin, yPos);
                yPos += lineHeight;
            }
            if (dumpProgress > 0.8) {
                ctx.fillText('Physical memory dump complete.', xpMargin, yPos);
                yPos += lineHeight;
            }
            if (dumpProgress > 0.9) {
                ctx.fillText('Contact your system administrator or technical support group for further', xpMargin, yPos);
                yPos += lineHeight;
                ctx.fillText('assistance.', xpMargin, yPos);
            }
            break;
        }
        case 'win_bios': {
            // Render template (preloaded during init)
            const template = templateCache.get(mode);
            renderTemplateToCanvas(template, ctx, canvas, {});
            
            // BIOS text is all dynamic (appears progressively), so render it here
            const biosMargin = 20;
            let biosY = 30;
            const biosLineHeight = 18;
            const biosDelay = 12; // frames between each message - faster for realism
            
            ctx.font = '14px "Courier New", "Lucida Console", monospace';
            
            // BIOS vendor and version
            if (frame > biosDelay * 0) {
                ctx.fillStyle = '#00ff00';
                ctx.fillText('PhoenixBIOS 4.0 Release 6.0', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 1) {
                ctx.fillText('Copyright (C) 1985-2003 Phoenix Technologies Ltd.', biosMargin, biosY);
                biosY += biosLineHeight * 2;
            }
            
            // CPU detection
            if (frame > biosDelay * 2) {
                ctx.fillStyle = '#ffff00';
                ctx.fillText('CPU Type : Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 3) {
                ctx.fillText('CPU Speed : 3200 MHz', biosMargin, biosY);
                biosY += biosLineHeight;
                ctx.fillText('Cache Size : 12288 KB', biosMargin, biosY);
                biosY += biosLineHeight * 2;
            }
            
            // Memory detection - more detailed
            if (frame > biosDelay * 4) {
                ctx.fillStyle = '#00ff00';
                ctx.fillText('Memory Test : 16384MB OK', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 5) {
                ctx.fillText('Base Memory : 640KB', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 6) {
                ctx.fillText('Extended Memory : 16320MB', biosMargin, biosY);
                biosY += biosLineHeight * 2;
            }
            
            // IDE detection
            if (frame > biosDelay * 7) {
                ctx.fillStyle = '#ffff00';
                ctx.fillText('IDE Channel 0 Master : WDC WD10EZEX-00BN5A0', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 8) {
                ctx.fillText('IDE Channel 1 Master : HL-DT-ST DVD-RW GH24NSB0', biosMargin, biosY);
                biosY += biosLineHeight * 2;
            }
            
            // Boot device order
            if (frame > biosDelay * 9) {
                ctx.fillStyle = '#00ff00';
                ctx.fillText('Boot Device Priority:', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 10) {
                ctx.fillText('  1. Hard Disk', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 11) {
                ctx.fillText('  2. CD-ROM', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 12) {
                ctx.fillText('  3. USB Device', biosMargin, biosY);
                biosY += biosLineHeight * 2;
            }
            
            // POST messages
            if (frame > biosDelay * 13) {
                ctx.fillStyle = '#ffff00';
                ctx.fillText('Verifying DMI Pool Data...', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 14) {
                ctx.fillText('Update DMI Data...', biosMargin, biosY);
                biosY += biosLineHeight;
            }
            
            if (frame > biosDelay * 15) {
                ctx.fillStyle = '#00ff00';
                ctx.fillText('DMI pool data updated successfully.', biosMargin, biosY);
                biosY += biosLineHeight * 2;
            }
            
            // Booting message
            if (frame > biosDelay * 16) {
                ctx.fillStyle = '#ffff00';
                ctx.fillText('Booting from Hard Disk...', biosMargin, biosY);
            }
            break;
        }
    }
}

