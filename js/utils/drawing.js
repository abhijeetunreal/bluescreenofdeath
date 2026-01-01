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
    ctx.fillStyle = '#fff'; 
    ctx.font = '24px "Tahoma", sans-serif'; 
    ctx.textAlign = 'center';
    ctx.fillText("Windows is updating your computer...", canvas.width/2, canvas.height/2 - 50);
    ctx.strokeStyle = '#fff'; 
    ctx.strokeRect(canvas.width/2 - 150, canvas.height/2, 300, 25);
    ctx.fillStyle = '#33cc33'; 
    ctx.fillRect(canvas.width/2 - 148, canvas.height/2 + 2, (progress % 100 / 100) * 296, 21);
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

