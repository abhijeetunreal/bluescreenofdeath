// Drawing helper functions

export function drawWhiteLogo(ctx, img, canvas, size, yOffset = 0) {
    if (img.complete) {
        ctx.save();
        ctx.filter = 'brightness(0) invert(1)';
        ctx.drawImage(img, canvas.width/2 - size/2, canvas.height/2 - size/2 + yOffset, size, size);
        ctx.restore();
    }
}

export function drawWinSpinner(ctx, x, y, radius, frame) {
    const dotCount = 6;
    for (let i = 0; i < dotCount; i++) {
        const angle = (frame / 20) + (i * (Math.PI * 2 / 12));
        const dx = x + Math.cos(angle) * radius;
        const dy = y + Math.sin(angle) * radius;
        const size = 3 + (i * 0.8);
        ctx.beginPath();
        ctx.arc(dx, dy, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (i / dotCount) + ')';
        ctx.fill();
    }
}

export function drawWinXPUpdate(ctx, canvas, progress) {
    // Windows XP update screen blue
    ctx.fillStyle = '#003399'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Stage messages that change based on progress - more realistic
    let stageMessage = "Preparing to install";
    let detailMessage = "Please wait...";
    const progressPercent = (progress % 100) / 100;
    
    if (progressPercent < 0.25) {
        stageMessage = "Preparing to install";
        detailMessage = "Gathering required information...";
    } else if (progressPercent < 0.5) {
        stageMessage = "Installing updates";
        detailMessage = "This may take several minutes...";
    } else if (progressPercent < 0.85) {
        stageMessage = "Installing updates";
        detailMessage = "Please wait while Windows configures your computer...";
    } else {
        stageMessage = "Configuring settings";
        detailMessage = "Almost done...";
    }
    
    ctx.fillStyle = '#fff'; 
    ctx.font = 'bold 28px "Tahoma", sans-serif'; 
    ctx.textAlign = 'center';
    ctx.fillText(stageMessage, canvas.width/2, canvas.height/2 - 90);
    
    ctx.font = '22px "Tahoma", sans-serif';
    ctx.fillText("Windows is updating your computer", canvas.width/2, canvas.height/2 - 50);
    
    ctx.font = '20px "Tahoma", sans-serif';
    ctx.fillText(detailMessage, canvas.width/2, canvas.height/2 - 15);
    
    // Progress bar with XP styling - more accurate
    const barWidth = 450;
    const barHeight = 30;
    const barX = canvas.width/2 - barWidth/2;
    const barY = canvas.height/2 + 25;
    
    // Outer border (white) - thicker for XP style
    ctx.strokeStyle = '#fff'; 
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Inner border (darker blue)
    ctx.strokeStyle = '#001a66';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX + 2, barY + 2, barWidth - 4, barHeight - 4);
    
    // Progress fill (XP green) - brighter green
    const fillWidth = (progressPercent * (barWidth - 6));
    ctx.fillStyle = '#33cc33'; 
    ctx.fillRect(barX + 3, barY + 3, fillWidth, barHeight - 6);
    
    // Percentage text - larger and bolder
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px "Tahoma", sans-serif';
    ctx.fillText(`${Math.floor(progressPercent * 100)}%`, canvas.width/2, barY + barHeight + 35);
    
    // Warning text - more prominent
    ctx.font = '18px "Tahoma", sans-serif';
    ctx.fillText("Do not turn off your computer", canvas.width/2, barY + barHeight + 65);
}

export function drawBrokenScreen(ctx, canvas, crackLines) {
    // Black background
    ctx.fillStyle = '#000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw main crack lines - more realistic
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; 
    ctx.lineWidth = 2;
    crackLines.forEach(c => {
        ctx.beginPath(); 
        ctx.moveTo(c.x, c.y);
        const ex = c.x + Math.cos(c.angle) * c.length; 
        const ey = c.y + Math.sin(c.angle) * c.length;
        ctx.lineTo(ex, ey); 
        ctx.stroke();
        
        // Add branching cracks for realism
        for(let i=0; i<2; i++) {
            const branchAngle = c.angle + (Math.random() - 0.5) * 0.8;
            const branchLength = c.length * (0.2 + Math.random() * 0.3);
            ctx.beginPath();
            ctx.moveTo(c.x + (ex-c.x)*0.4, c.y + (ey-c.y)*0.4);
            ctx.lineTo(c.x + Math.cos(branchAngle)*branchLength, c.y + Math.sin(branchAngle)*branchLength);
            ctx.stroke();
        }
    });
    
    // Add screen damage effects - colored lines
    for(let i=0; i<8; i++) {
        const r = Math.random() * 255;
        const g = Math.random() * 255;
        const b = Math.random() * 255;
        ctx.fillStyle = `rgba(${r},${g},${b},0.4)`;
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 80 + Math.random()*40, 2);
    }
    
    // Add small shard effects
    for(let i=0; i<15; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random()*0.4})`;
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 3, 3);
    }
}

// Draw a QR code pattern (simplified grid pattern that looks like a QR code)
export function drawQRCodePattern(ctx, x, y, size) {
    const cellSize = size / 25; // 25x25 grid
    ctx.fillStyle = '#fff';
    
    // Draw finder patterns (corners)
    const finderSize = 7;
    const positions = [
        [0, 0], [18, 0], [0, 18]
    ];
    
    positions.forEach(([fx, fy]) => {
        // Outer square
        ctx.fillRect(x + fx * cellSize, y + fy * cellSize, finderSize * cellSize, finderSize * cellSize);
        // Inner square (negative)
        ctx.fillStyle = '#0078D4';
        ctx.fillRect(x + (fx + 1) * cellSize, y + (fy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = '#fff';
        // Center square
        ctx.fillRect(x + (fx + 2) * cellSize, y + (fy + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    });
    
    // Draw deterministic data pattern (consistent QR code)
    // Use a simple hash function based on position to create a stable pattern
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            // Skip finder pattern areas
            if ((i < 8 && j < 8) || (i < 8 && j > 16) || (i > 16 && j < 8)) {
                continue;
            }
            // Deterministic pattern based on position (creates consistent QR code)
            const hash = (i * 31 + j * 17) % 3;
            if (hash === 0 || hash === 1) {
                ctx.fillRect(x + i * cellSize, y + j * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Improved Windows 10 spinner with 6 dots - matches reference implementation
export function drawWin10Spinner(ctx, x, y, radius, frame) {
    const dotCount = 6;
    // Animation cycle - 4 seconds per full rotation (240 frames at 60fps)
    const cycleTime = 240;
    const fps = 60;
    
    // Starting angles for each dot (in degrees, converted to radians)
    const startAngles = [0, 20, 40, 60, 80, 100].map(a => (a * Math.PI) / 180);
    
    // Delays for each dot (in seconds, converted to frames)
    const delays = [0.9, 0.775, 0.65, 0.525, 0.4, 0.275].map(d => d * fps);
    
    for (let i = 0; i < dotCount; i++) {
        // Calculate current frame with delay
        const adjustedFrame = (frame + delays[i]) % cycleTime;
        const progress = adjustedFrame / cycleTime;
        
        // Each dot rotates from its starting angle
        // The animation goes: start -> +180deg -> +360deg (back to start)
        let rotation;
        if (progress < 0.2) {
            // First 20%: rotate from start to start+180
            rotation = startAngles[i] + (progress / 0.2) * Math.PI;
        } else if (progress < 0.6) {
            // 20-60%: stay at start+180
            rotation = startAngles[i] + Math.PI;
        } else {
            // 60-100%: rotate from start+180 to start+360
            rotation = startAngles[i] + Math.PI + ((progress - 0.6) / 0.4) * Math.PI;
        }
        
        const dx = x + Math.cos(rotation) * radius;
        const dy = y + Math.sin(rotation) * radius;
        
        // Opacity: fade in/out based on position
        let opacity;
        if (progress < 0.2) {
            opacity = 0.3 + (0.7 * (progress / 0.2));
        } else if (progress < 0.6) {
            opacity = 1.0;
        } else {
            opacity = 1.0 - (0.7 * ((progress - 0.6) / 0.4));
        }
        
        const size = 5;
        
        ctx.beginPath();
        ctx.arc(dx, dy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
}

// Draw a rounded rectangle
export function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Draw iOS-style progress bar with rounded corners
export function drawiOSProgressBar(ctx, x, y, width, height, progress) {
    const radius = height / 2;
    const progressWidth = Math.max(0, Math.min(width, progress * width));
    
    // Background (dark gray)
    ctx.fillStyle = '#333';
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.fill();
    
    // Progress fill (white)
    if (progressWidth > 0) {
        ctx.fillStyle = '#fff';
        drawRoundedRect(ctx, x, y, progressWidth, height, radius);
        ctx.fill();
    }
}

// Draw macOS-style progress bar
export function drawMacOSProgressBar(ctx, x, y, width, height, progress) {
    const radius = 4;
    const progressWidth = Math.max(0, Math.min(width, progress * width));
    
    // Background (dark gray)
    ctx.fillStyle = '#2a2a2a';
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.fill();
    
    // Progress fill (light gray/white)
    if (progressWidth > 0) {
        ctx.fillStyle = '#aaa';
        drawRoundedRect(ctx, x, y, progressWidth, height, radius);
        ctx.fill();
    }
}

