// Windows modes

import * as state from '../core/state.js';
import { getCanvas } from '../core/canvas.js';
import { drawWhiteLogo, drawWinSpinner, drawWinXPUpdate, drawWin10Spinner, drawWin11Spinner } from '../utils/drawing.js';
import { imgWin } from '../utils/assets.js';
import { drawQRCode } from '../utils/qrcode.js';
import { loadTemplate } from '../utils/template-loader.js';
import { renderTemplateToCanvas } from '../utils/template-renderer.js';

const templateCache = new Map();

// Iframe container for win_ransomware mode
const canvas = getCanvas();
let ransomwareContainer = null;
let ransomwareIframe = null;

// Mode-specific state for enhanced BSOD
let enhancedBsodState = {
    progress: 0,
    lastUpdateFrame: 0,
    nextUpdateDelay: 0, // frames to wait before next update
    blackScreenActive: false,
    blackScreenStartFrame: 0,
    reached100Frame: 0
};

// Mode-specific state for Windows 11 loading screen
let win11LoadingState = {
    progress: 0,
    lastUpdateFrame: 0,
    nextUpdateDelay: 180, // Initial delay: 3 seconds (180 frames at 60fps)
    blackScreenActive: false,
    blackScreenStartFrame: 0,
    reached100Frame: 0,
    welcomeScreenActive: false
};

// Track current Windows mode to detect mode switches
let currentWindowsMode = null;

export async function initWindowsMode(mode, canvas) {
    // Clean up previous mode if switching
    if (currentWindowsMode && currentWindowsMode !== mode) {
        cleanupWindowsMode();
    }
    
    currentWindowsMode = mode;
    
    // Handle win_ransomware as a special case (full HTML page in iframe)
    if (mode === 'win_ransomware') {
        await loadAndInjectRansomware();
        return;
    }
    
    // Ensure canvas is visible for non-ransomware modes
    if (mode !== 'win_ransomware' && canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
    // Preload template for this mode (skip modes that don't use templates)
    const modesWithoutTemplates = ['win_xp_upd']; // Modes that are drawn directly, not from templates
    if (mode && !modesWithoutTemplates.includes(mode) && !templateCache.has(mode)) {
        try {
            const template = await loadTemplate(mode);
            if (template) {
                templateCache.set(mode, template);
            }
        } catch (error) {
            // Silently ignore template loading errors for modes that might not have templates
            console.debug(`Template not found for mode: ${mode}`, error);
        }
    }
    
    // Reset state when switching to a different Windows mode
    const isModeSwitch = currentWindowsMode !== null && currentWindowsMode !== mode;
    const previousMode = currentWindowsMode;
    currentWindowsMode = mode;
    
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
    // Also reset if switching away from enhanced BSOD to prevent state leakage
    else if (isModeSwitch && previousMode === 'win_10_bsod_enhanced') {
        enhancedBsodState = {
            progress: 0,
            lastUpdateFrame: 0,
            nextUpdateDelay: 60,
            blackScreenActive: false,
            blackScreenStartFrame: 0,
            reached100Frame: 0
        };
    }
    
    // Reset Windows 11 loading state when initializing that mode
    if (mode === 'win_11_loading') {
        win11LoadingState = {
            progress: 0,
            lastUpdateFrame: 0,
            nextUpdateDelay: 180, // Initial delay: 3 seconds (180 frames at 60fps)
            blackScreenActive: false,
            blackScreenStartFrame: 0,
            reached100Frame: 0,
            welcomeScreenActive: false
        };
    }
    // Also reset if switching away from Windows 11 loading to prevent state leakage
    else if (isModeSwitch && previousMode === 'win_11_loading') {
        win11LoadingState = {
            progress: 0,
            lastUpdateFrame: 0,
            nextUpdateDelay: 180,
            blackScreenActive: false,
            blackScreenStartFrame: 0,
            reached100Frame: 0,
            welcomeScreenActive: false
        };
    }
}

export function renderWindowsMode(mode, ctx, canvas) {
    // Ensure canvas is visible for non-ransomware modes
    if (mode !== 'win_ransomware' && canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
    const frame = state.getFrame();
    const progress = state.getProgress();
    
    switch(mode) {
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
            // Clamp dump progress to 0-1 range
            const dumpProgress = Math.max(0, Math.min(1, progress * 2));
            
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
        case 'win_11_loading': {
            // Handle welcome screen (after black screen transition)
            if (win11LoadingState.welcomeScreenActive) {
                // Welcome screen with blue background
                ctx.fillStyle = '#005a9e';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '48px "Segoe UI Variable", "Segoe UI", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Welcome', canvas.width / 2, canvas.height / 2);
                break;
            }
            
            // Handle black screen overlay
            if (win11LoadingState.blackScreenActive) {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // After 3 seconds of black screen, transition to welcome screen
                const blackScreenDuration = frame - win11LoadingState.blackScreenStartFrame;
                if (blackScreenDuration > 180) { // ~3 seconds at 60fps
                    win11LoadingState.welcomeScreenActive = true;
                }
                break;
            }
            
            // Update progress with realistic stuttering animation
            if (win11LoadingState.progress < 100) {
                const framesSinceLastUpdate = frame - win11LoadingState.lastUpdateFrame;
                
                if (framesSinceLastUpdate >= win11LoadingState.nextUpdateDelay) {
                    let increment = 1;
                    
                    // Realistic progress behavior matching HTML
                    if (win11LoadingState.progress < 30) {
                        // Fast updates: 1-3% increments
                        increment = Math.floor(Math.random() * 3) + 1;
                    } else if (win11LoadingState.progress < 90) {
                        // Slow updates: random 0-1% increments (30% chance of increment)
                        increment = Math.random() > 0.7 ? 1 : 0;
                    } else {
                        // Very slow updates: random 0-1% increments (5% chance of increment)
                        increment = Math.random() > 0.95 ? 1 : 0;
                    }
                    
                    win11LoadingState.progress = Math.min(100, win11LoadingState.progress + increment);
                    win11LoadingState.lastUpdateFrame = frame;
                    
                    // Random delay based on progress stage
                    if (win11LoadingState.progress < 90) {
                        // 500-2000ms delay (30-120 frames at 60fps)
                        win11LoadingState.nextUpdateDelay = Math.floor(Math.random() * 90) + 30;
                    } else {
                        // 2000-5000ms delay (120-300 frames at 60fps)
                        win11LoadingState.nextUpdateDelay = Math.floor(Math.random() * 180) + 120;
                    }
                }
            } else if (win11LoadingState.progress >= 100 && win11LoadingState.reached100Frame === 0) {
                // Just reached 100%, record the frame
                win11LoadingState.reached100Frame = frame;
            } else if (win11LoadingState.reached100Frame > 0) {
                // Wait 3 seconds at 100% before showing black screen
                const framesAt100 = frame - win11LoadingState.reached100Frame;
                if (framesAt100 > 180) { // ~3 seconds at 60fps
                    win11LoadingState.blackScreenActive = true;
                    win11LoadingState.blackScreenStartFrame = frame;
                }
            }
            
            // Render background (black)
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Render template (if available) for text elements
            const template = templateCache.get(mode);
            if (template) {
                const percentComplete = Math.floor(win11LoadingState.progress);
                renderTemplateToCanvas(template, ctx, canvas, { percentComplete });
            }
            
            // Draw 5-dot spinner - centered above text
            const spinnerY = canvas.height * 0.4; // Position at 40% from top
            const spinnerRadius = 35; // Increased from 25px to 35px for more spacing between dots
            drawWin11Spinner(ctx, canvas.width / 2, spinnerY - 30, spinnerRadius, frame);
            
            // Draw text manually if template didn't render (fallback)
            if (!template) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '28px "Segoe UI Variable", "Segoe UI", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Working on updates', canvas.width / 2, canvas.height * 0.4 + 30);
                
                ctx.fillStyle = '#cccccc';
                ctx.font = '18px "Segoe UI Variable", "Segoe UI", sans-serif';
                const percentComplete = Math.floor(win11LoadingState.progress);
                ctx.fillText(`${percentComplete}% complete`, canvas.width / 2, canvas.height * 0.4 + 70);
                ctx.fillText('Please keep your computer on.', canvas.width / 2, canvas.height * 0.4 + 110);
            }
            break;
        }
        case 'win_ransomware':
            // Ransomware mode handles its own rendering through iframe
            // Hide the main canvas
            if (canvas) {
                canvas.style.display = 'none';
            }
            break;
        }
    }

/**
 * Load and inject Ransomware template
 */
async function loadAndInjectRansomware() {
    // Remove existing iframe if present
    if (ransomwareIframe) {
        ransomwareIframe.remove();
        ransomwareIframe = null;
    }
    
    // Hide the main canvas
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    // Create ransomware container if it doesn't exist
    if (!ransomwareContainer) {
        ransomwareContainer = document.createElement('div');
        ransomwareContainer.id = 'ransomware-container';
        ransomwareContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1000;
            background: #000;
        `;
        document.body.appendChild(ransomwareContainer);
    }
    
    // Create iframe for the ransomware template
    ransomwareIframe = document.createElement('iframe');
    ransomwareIframe.id = 'ransomware-iframe';
    ransomwareIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    `;
    ransomwareIframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    
    // Load the template
    try {
        const template = await loadTemplate('win_ransomware');
        if (template && template.html) {
            // If template has HTML content, use it
            ransomwareIframe.srcdoc = template.html;
        } else {
            // Fallback: load from file directly
            ransomwareIframe.src = 'src/templates/windows/win_ransomware.html';
        }
    } catch (error) {
        console.warn('Failed to load Ransomware template, using direct path:', error);
        ransomwareIframe.src = 'src/templates/windows/win_ransomware.html';
    }
    
    ransomwareContainer.appendChild(ransomwareIframe);
    ransomwareContainer.style.display = 'block';
}

/**
 * Clean up ransomware state when switching away from ransomware mode
 */
function cleanupRansomware() {
    // Hide ransomware container
    if (ransomwareContainer) {
        ransomwareContainer.style.display = 'none';
    }
    
    // Remove iframe
    if (ransomwareIframe) {
        ransomwareIframe.remove();
        ransomwareIframe = null;
    }
    
    // Show main canvas again
    if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
}

/**
 * Clean up Windows mode state when switching away from Windows modes
 */
export function cleanupWindowsMode() {
    // Clean up ransomware if it was active
    if (currentWindowsMode === 'win_ransomware') {
        cleanupRansomware();
    }
    
    // Show main canvas
    if (canvas) {
        canvas.style.display = 'block';
        canvas.classList.remove('hidden');
    }
    
    currentWindowsMode = null;
}

