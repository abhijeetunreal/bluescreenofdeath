// Windows modes

import * as state from '../core/state.js';
import { drawWhiteLogo, drawWinSpinner, drawWinXPUpdate, drawWin10Spinner } from '../utils/drawing.js';
import { imgWin } from '../utils/assets.js';
import { drawQRCode } from '../utils/qrcode.js';
import { loadTemplate } from '../utils/template-loader.js';
import { renderTemplateToCanvas } from '../utils/template-renderer.js';

const templateCache = new Map();

export async function initWindowsMode(mode, canvas) {
    // Preload template for this mode
    if (mode && !templateCache.has(mode)) {
        const template = await loadTemplate(mode);
        if (template) {
            templateCache.set(mode, template);
        }
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
            
            // Improved spinner with 6 dots - positioned above text
            const loaderSize = 40;
            drawWin10Spinner(ctx, canvas.width/2, mainSectionY - loaderSize/2 - 20, loaderSize/2, frame);
            break;
        }
        case 'win_xp_upd':
            drawWinXPUpdate(ctx, canvas, progress);
            break;
        case 'win_10_bsod': {
            // Render template (preloaded during init)
            const template = templateCache.get(mode);
            const percentComplete = Math.min(100, Math.floor(progress * 100));
            renderTemplateToCanvas(template, ctx, canvas, { percentComplete });
            
            const leftMargin = 80;
            const topMargin = 80;
            const qrSize = 180;
            // QR code positioned with left edge aligned with text block
            const qrX = leftMargin;
            const qrY = topMargin;
            
            // Sad face emoji - positioned to the left, partially behind QR code
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 140px "Segoe UI", sans-serif';
            ctx.fillText(':(', leftMargin - 60, topMargin + 100);
            
            // White horizontal bars to the left of QR code (characteristic Windows 10 BSOD design)
            ctx.fillStyle = '#fff';
            ctx.fillRect(qrX - 20, qrY + 20, 15, 3);
            ctx.fillRect(qrX - 20, qrY + 30, 15, 3);
            
            // QR code - drawn after sad face so it overlaps from the right
            drawQRCode(ctx, qrX, qrY, qrSize);
            
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

