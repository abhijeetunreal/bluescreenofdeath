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
    ctx.fillStyle = '#003399'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Stage messages that change based on progress
    let stageMessage = "Preparing to install";
    let detailMessage = "Please wait...";
    const progressPercent = (progress % 100) / 100;
    
    if (progressPercent < 0.3) {
        stageMessage = "Preparing to install";
        detailMessage = "Gathering required information...";
    } else if (progressPercent < 0.7) {
        stageMessage = "Installing updates";
        detailMessage = "This may take several minutes...";
    } else {
        stageMessage = "Configuring settings";
        detailMessage = "Almost done...";
    }
    
    ctx.fillStyle = '#fff'; 
    ctx.font = 'bold 26px "Tahoma", sans-serif'; 
    ctx.textAlign = 'center';
    ctx.fillText(stageMessage, canvas.width/2, canvas.height/2 - 80);
    
    ctx.font = '20px "Tahoma", sans-serif';
    ctx.fillText("Windows is updating your computer", canvas.width/2, canvas.height/2 - 40);
    
    ctx.font = '18px "Tahoma", sans-serif';
    ctx.fillText(detailMessage, canvas.width/2, canvas.height/2 - 10);
    
    // Progress bar with XP styling
    const barWidth = 400;
    const barHeight = 28;
    const barX = canvas.width/2 - barWidth/2;
    const barY = canvas.height/2 + 20;
    
    // Outer border (white)
    ctx.strokeStyle = '#fff'; 
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Inner border (darker blue)
    ctx.strokeStyle = '#001a66';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX + 2, barY + 2, barWidth - 4, barHeight - 4);
    
    // Progress fill (XP green)
    const fillWidth = (progressPercent * (barWidth - 6));
    ctx.fillStyle = '#33cc33'; 
    ctx.fillRect(barX + 3, barY + 3, fillWidth, barHeight - 6);
    
    // Percentage text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px "Tahoma", sans-serif';
    ctx.fillText(`${Math.floor(progressPercent * 100)}%`, canvas.width/2, barY + barHeight + 30);
    
    // Warning text
    ctx.font = '16px "Tahoma", sans-serif';
    ctx.fillText("Do not turn off your computer", canvas.width/2, barY + barHeight + 60);
}

export function drawBrokenScreen(ctx, canvas, crackLines) {
    ctx.fillStyle = '#000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; 
    ctx.lineWidth = 1;
    crackLines.forEach(c => {
        ctx.beginPath(); 
        ctx.moveTo(c.x, c.y);
        const ex = c.x + Math.cos(c.angle) * c.length; 
        const ey = c.y + Math.sin(c.angle) * c.length;
        ctx.lineTo(ex, ey); 
        ctx.stroke();
        for(let i=0; i<3; i++) {
            ctx.beginPath(); 
            ctx.moveTo(c.x + (ex-c.x)*0.5, c.y + (ey-c.y)*0.5);
            ctx.lineTo(c.x + Math.cos(c.angle+0.5)*c.length*0.3, c.y + Math.sin(c.angle+0.5)*c.length*0.3);
            ctx.stroke();
        }
    });
    for(let i=0; i<5; i++) {
        ctx.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.3)`;
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 100, 2);
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

// Improved Windows 10 spinner with more realistic animation
export function drawWin10Spinner(ctx, x, y, radius, frame) {
    const dotCount = 5;
    const baseAngle = (frame / 30) % (Math.PI * 2);
    
    for (let i = 0; i < dotCount; i++) {
        const angle = baseAngle + (i * (Math.PI * 2 / dotCount));
        const dx = x + Math.cos(angle) * radius;
        const dy = y + Math.sin(angle) * radius;
        const opacity = 0.3 + (0.7 * (1 - (i / dotCount)));
        const size = 4;
        
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

