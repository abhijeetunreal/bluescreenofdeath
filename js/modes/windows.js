// Windows modes

import * as state from '../core/state.js';
import { drawWhiteLogo, drawWinSpinner, drawWinXPUpdate, drawWin10Spinner } from '../utils/drawing.js';
import { imgWin } from '../utils/assets.js';
import { drawQRCode } from '../utils/qrcode.js';

export function initWindowsMode(mode, canvas) {
    // Windows modes don't need special initialization
}

export function renderWindowsMode(mode, ctx, canvas) {
    const frame = state.getFrame();
    const progress = state.getProgress();
    
    switch(mode) {
        case 'win_10_upd': {
            ctx.fillStyle = '#0067b8';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Windows logo
            drawWhiteLogo(ctx, imgWin, canvas, 100, -100);
            
            // Improved spinner
            drawWin10Spinner(ctx, canvas.width/2, canvas.height/2 + 10, 35, frame);
            
            // Update messages that cycle
            const updateMessages = [
                "Working on updates",
                "Installing updates",
                "Configuring Windows",
                "Don't turn off your PC"
            ];
            const messageIndex = Math.floor((frame / 120) % updateMessages.length);
            const currentMessage = updateMessages[messageIndex];
            
            // Percentage calculation
            const percentComplete = Math.min(100, Math.floor(progress * 100));
            
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = '24px Segoe UI';
            ctx.fillText(currentMessage, canvas.width/2, canvas.height/2 + 70);
            ctx.font = '20px Segoe UI';
            ctx.fillText(`${percentComplete}% complete`, canvas.width/2, canvas.height/2 + 100);
            break;
        }
        case 'win_xp_upd':
            drawWinXPUpdate(ctx, canvas, progress);
            break;
        case 'win_10_bsod': {
            ctx.fillStyle = '#0078D4';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const leftMargin = 80;
            const topMargin = 120;
            const qrSize = 180;
            const qrX = canvas.width - qrSize - 80;
            const qrY = topMargin + 40;
            
            // Sad face emoji
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 120px Segoe UI';
            ctx.fillText(':(', leftMargin, topMargin + 100);
            
            // Main error message
            ctx.font = '28px Segoe UI';
            ctx.fillText('Your PC ran into a problem and needs to restart.', leftMargin, topMargin + 200);
            ctx.fillText("We're just collecting some error info, and then we'll restart for you.", leftMargin, topMargin + 240);
            
            // Percentage indicator
            const percentComplete = Math.min(100, Math.floor(progress * 100));
            ctx.font = '24px Segoe UI';
            ctx.fillText(`${percentComplete}% complete`, leftMargin, topMargin + 300);
            
            // Error code
            ctx.font = '20px Segoe UI';
            ctx.fillText('If you\'d like to know more, you can search online later for this error:', leftMargin, topMargin + 360);
            ctx.font = 'bold 20px Segoe UI';
            ctx.fillText('CRITICAL_PROCESS_DIED', leftMargin, topMargin + 390);
            ctx.font = '20px Segoe UI';
            ctx.fillText('Stop code: 0x000000EF', leftMargin, topMargin + 420);
            
            // QR code on the right
            drawQRCode(ctx, qrX, qrY, qrSize);
            
            // Website link below QR code
            ctx.font = '16px Segoe UI';
            ctx.textAlign = 'center';
            ctx.fillText('For more information about this issue', qrX + qrSize / 2, qrY + qrSize + 30);
            ctx.fillText('and possible fixes, visit', qrX + qrSize / 2, qrY + qrSize + 50);
            ctx.fillText('www.windows.com/stopcode', qrX + qrSize / 2, qrY + qrSize + 75);
            
            ctx.textAlign = 'left';
            break;
        }
        case 'win_xp_bsod': {
            ctx.fillStyle = '#0000AA';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px monospace';
            
            const xpMargin = 30;
            let yPos = 30;
            const lineHeight = 18;
            
            // Main error message
            ctx.fillText('A problem has been detected and Windows has been shut down', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('to prevent damage to your computer.', xpMargin, yPos);
            yPos += lineHeight * 2;
            
            ctx.font = '16px monospace';
            ctx.fillText('The problem seems to be caused by the following file: ntoskrnl.exe', xpMargin, yPos);
            yPos += lineHeight * 2;
            
            // STOP error
            ctx.font = 'bold 16px monospace';
            ctx.fillText('STOP: 0x000000D1 (0x00000000, 0x00000002, 0x00000000, 0xF8A0B2C4)', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('DRIVER_IRQL_NOT_LESS_OR_EQUAL', xpMargin, yPos);
            yPos += lineHeight * 2;
            
            // Technical details
            ctx.font = '16px monospace';
            ctx.fillText('If this is the first time you\'ve seen this Stop error screen,', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('restart your computer. If this screen appears again, follow', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('these steps:', xpMargin, yPos);
            yPos += lineHeight * 2;
            
            ctx.fillText('Check to make sure any new hardware or software is properly installed.', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('If this is a new installation, ask your hardware or software manufacturer', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('for any Windows updates you might need.', xpMargin, yPos);
            yPos += lineHeight * 2;
            
            ctx.fillText('If problems continue, disable or remove any newly installed hardware', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('or software. Disable BIOS memory options such as caching or shadowing.', xpMargin, yPos);
            yPos += lineHeight * 2;
            
            ctx.fillText('If you need to use Safe Mode to remove or disable components, restart', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('your computer, press F8 to select Advanced Startup Options, and then', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('select Safe Mode.', xpMargin, yPos);
            yPos += lineHeight * 3;
            
            // Memory dump info
            ctx.fillText('Technical information:', xpMargin, yPos);
            yPos += lineHeight * 2;
            ctx.fillText('*** STOP: 0x000000D1 (0x00000000, 0x00000002, 0x00000000, 0xF8A0B2C4)', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('*** ntoskrnl.exe - Address F8A0B2C4 base at F8A00000, DateStamp 3b7d855c', xpMargin, yPos);
            yPos += lineHeight * 2;
            ctx.fillText('Beginning dump of physical memory', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('Physical memory dump complete.', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('Contact your system administrator or technical support group for further', xpMargin, yPos);
            yPos += lineHeight;
            ctx.fillText('assistance.', xpMargin, yPos);
            break;
        }
        case 'win_bios': {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const biosMargin = 20;
            let biosY = 30;
            const biosLineHeight = 18;
            const biosDelay = 15; // frames between each message
            
            ctx.font = '14px monospace';
            
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
                biosY += biosLineHeight * 2;
            }
            
            // Memory detection
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

