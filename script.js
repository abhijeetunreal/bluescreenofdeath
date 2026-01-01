const canvas = document.getElementById('colorCanvas');
const ctx = canvas.getContext('2d');
const body = document.getElementById('mainBody');

let currentMode = 'color';
let currentColor = '#000000';
let uiTimeout, frame = 0, progress = 0;

// --- Assets ---
const imgWin = new Image(); 
imgWin.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/512px-Windows_logo_-_2021.svg.png';
const imgApple = new Image(); 
imgApple.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/256px-Apple_logo_black.svg.png';
const imgAndroid = new Image(); 
imgAndroid.src = 'https://upload.wikimedia.org/wikipedia/commons/6/64/Android_logo_2019_%28stacked%29.svg';
[imgWin, imgApple, imgAndroid].forEach(img => img.crossOrigin = 'anonymous');

// --- Mode Data ---
let particles = [], matrixChars = [], hackerLines = [], crackLines = [];
let dvdPos = { x: 100, y: 100, vx: 3, vy: 3, color: '#fff' };
let currentQuote = "";

const quotes = [
    "Reality is merely an illusion, albeit a very persistent one.",
    "The only way to do great work is to love what you do.",
    "Error 404: Sleep not found.",
    "I'm not lazy, I'm just on energy saving mode.",
    "Everything is fine. (It is not fine.)",
    "Be the person your dog thinks you are."
];

function initMode() {
    progress = 0; frame = 0;
    if (currentMode === 'macos_drift') {
        particles = Array.from({length: 80}, () => ({ 
            x: Math.random()*canvas.width, 
            y: Math.random()*canvas.height, 
            vx: (Math.random()-0.5)*2, 
            vy: (Math.random()-0.5)*2, 
            size: Math.random()*3+1, 
            hue: Math.random()*360 
        }));
    }
    if (currentMode === 'matrix') {
        const cols = Math.floor(canvas.width / 20);
        matrixChars = Array(cols).fill(0).map(() => Math.random() * -100);
    }
    if (currentMode === 'hacker') {
        hackerLines = [];
    }
    if (currentMode === 'broken_screen') {
        crackLines = Array.from({length: 12}, () => ({ 
            x: Math.random()*canvas.width, 
            y: Math.random()*canvas.height, 
            angle: Math.random()*Math.PI*2, 
            length: 100+Math.random()*400 
        }));
    }
    if (currentMode === 'quotes') {
        currentQuote = quotes[Math.floor(Math.random()*quotes.length)];
    }
}

// --- Helper: Draw Centered Logo with White Filter ---
function drawWhiteLogo(img, size, yOffset = 0) {
    if (img.complete) {
        ctx.save();
        ctx.filter = 'brightness(0) invert(1)';
        ctx.drawImage(img, canvas.width/2 - size/2, canvas.height/2 - size/2 + yOffset, size, size);
        ctx.restore();
    }
}

// --- Drawers ---

function drawWinSpinner(x, y, radius) {
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

function drawWinXPUpdate() {
    ctx.fillStyle = '#003399'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#fff'; ctx.font = '24px "Tahoma", sans-serif'; ctx.textAlign = 'center';
    ctx.fillText("Windows is updating your computer...", canvas.width/2, canvas.height/2 - 50);
    ctx.strokeStyle = '#fff'; ctx.strokeRect(canvas.width/2 - 150, canvas.height/2, 300, 25);
    ctx.fillStyle = '#33cc33'; ctx.fillRect(canvas.width/2 - 148, canvas.height/2 + 2, (progress % 100 / 100) * 296, 21);
}

function drawBrokenScreen() {
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1;
    crackLines.forEach(c => {
        ctx.beginPath(); ctx.moveTo(c.x, c.y);
        const ex = c.x + Math.cos(c.angle) * c.length; const ey = c.y + Math.sin(c.angle) * c.length;
        ctx.lineTo(ex, ey); ctx.stroke();
        for(let i=0; i<3; i++) {
            ctx.beginPath(); ctx.moveTo(c.x + (ex-c.x)*0.5, c.y + (ey-c.y)*0.5);
            ctx.lineTo(c.x + Math.cos(c.angle+0.5)*c.length*0.3, c.y + Math.sin(c.angle+0.5)*c.length*0.3);
            ctx.stroke();
        }
    });
    for(let i=0; i<5; i++) {
        ctx.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.3)`;
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 100, 2);
    }
}

// --- Core Loop ---

function animate() {
    frame++; progress += 0.02;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.textAlign = 'left';

    switch(currentMode) {
        case 'color': 
            ctx.fillStyle = currentColor; ctx.fillRect(0,0,canvas.width,canvas.height); 
            break;
        case 'win_10_upd':
            ctx.fillStyle = '#0067b8'; ctx.fillRect(0,0,canvas.width,canvas.height);
            drawWhiteLogo(imgWin, 100, -100);
            drawWinSpinner(canvas.width/2, canvas.height/2 + 10, 35);
            ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '22px Segoe UI';
            ctx.fillText(`Working on updates ${Math.min(100, Math.floor(progress*10)) % 101}%`, canvas.width/2, canvas.height/2 + 80);
            break;
        case 'win_xp_upd': drawWinXPUpdate(); break;
        case 'win_10_bsod':
            ctx.fillStyle = '#0078d7'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = '#fff'; ctx.font = '100px Segoe UI'; ctx.fillText(':(', 100, 200);
            ctx.font = '24px Segoe UI'; ctx.fillText('Your PC ran into a problem...', 100, 300);
            break;
        case 'win_xp_bsod':
            ctx.fillStyle = '#0000aa'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = '#fff'; ctx.font = '16px monospace'; 
            ["A problem has been detected...", "STOP: 0x000000D1", "Check hardware..."].forEach((l, i) => ctx.fillText(l, 40, 60 + i*22));
            break;
        case 'win_bios':
            ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#ccc'; ctx.font='14px monospace';
            ["BIOS Ver 1.0.4", "Memory Check: 16384MB OK", "Booting..."].forEach((l,i) => { if(frame>i*20) ctx.fillText(l, 40, 40+i*20); });
            break;
        case 'macos_drift':
            ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>canvas.width) p.vx*=-1; if(p.y<0||p.y>canvas.height) p.vy*=-1; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fillStyle=`hsla(${p.hue+(frame%360)},70%,70%,0.8)`; ctx.fill(); });
            break;
        case 'macos_hello': 
            ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); 
            ctx.fillStyle='#000'; ctx.textAlign='center'; ctx.font='italic bold 100px serif'; ctx.fillText('hello', canvas.width/2, canvas.height/2); 
            break;
        case 'macos_panic':
            ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='bold 18px sans-serif'; ctx.fillText("You need to restart your computer...", canvas.width/2, canvas.height/2);
            break;
        case 'ios_update':
            ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            drawWhiteLogo(imgApple, 80, -60);
            ctx.fillStyle='#333'; ctx.fillRect(canvas.width/2-75, canvas.height/2+50, 150, 3);
            ctx.fillStyle='#fff'; ctx.fillRect(canvas.width/2-75, canvas.height/2+50, (progress%100/100)*150, 3);
            break;
        case 'ios_disabled':
            ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='30px sans-serif'; ctx.fillText("iPhone is disabled", canvas.width/2, canvas.height/2);
            break;
        case 'broken_screen': drawBrokenScreen(); break;
        case 'white_noise':
            const id = ctx.createImageData(canvas.width, canvas.height);
            for(let i=0; i<id.data.length; i+=4) { const v = Math.random()*255; id.data[i]=id.data[i+1]=id.data[i+2]=v; id.data[i+3]=255; }
            ctx.putImageData(id, 0, 0); break;
        case 'radar':
            ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            const cx = canvas.width/2, cy = canvas.height/2, r = Math.min(cx, cy) * 0.8;
            const angle = (frame / 50) % (Math.PI*2);
            ctx.strokeStyle = '#00ff00'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle)*r, cy + Math.sin(angle)*r); ctx.stroke();
            break;
        case 'hacker':
            ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = '#0f0'; ctx.font = '14px monospace'; 
            if (frame % 5 === 0) {
                hackerLines.push("0x" + Math.random().toString(16).slice(2,10).toUpperCase() + " PROCESSING...");
                if (hackerLines.length > 30) hackerLines.shift();
            }
            hackerLines.forEach((l, i) => ctx.fillText(l, 20, 30 + i*20));
            break;
        case 'no_signal':
            const cols = ['#fff', '#ff0', '#0ff', '#0f0', '#f0f', '#f00', '#00f'];
            cols.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(i*(canvas.width/7), 0, canvas.width/7, canvas.height); });
            break;
        case 'ubuntu':
            ctx.fillStyle = '#300a24'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText("ubuntu 22.04", canvas.width/2, canvas.height - 100);
            break;
        case 'chromeos':
            ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='#4285F4'; ctx.textAlign='center'; ctx.font='bold 40px sans-serif'; ctx.fillText("chromeOS", canvas.width/2, canvas.height/2);
            break;
        case 'matrix':
            ctx.fillStyle='rgba(0,0,0,0.05)'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='#0f0'; ctx.font='18px monospace';
            matrixChars.forEach((y, i) => { ctx.fillText(String.fromCharCode(Math.random()*128), i*20, y); if(y>canvas.height && Math.random()>0.975) matrixChars[i]=0; else matrixChars[i]+=20; });
            break;
        case 'dvd': 
            ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            dvdPos.x += dvdPos.vx; dvdPos.y += dvdPos.vy;
            if (dvdPos.x <= 0 || dvdPos.x + 100 >= canvas.width) dvdPos.vx *= -1;
            if (dvdPos.y <= 0 || dvdPos.y + 50 >= canvas.height) dvdPos.vy *= -1;
            ctx.fillStyle = '#fff'; ctx.fillRect(dvdPos.x, dvdPos.y, 100, 50);
            break;
        case 'flip_clock':
            ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='bold 80px monospace';
            ctx.fillText(new Date().toLocaleTimeString(), canvas.width/2, canvas.height/2);
            break;
        case 'quotes':
            ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='italic 24px serif';
            ctx.fillText('"' + currentQuote + '"', canvas.width/2, canvas.height/2);
            break;
    }
    requestAnimationFrame(animate);
}

function setMode(mode, val, el) {
    currentMode = mode;
    if (val) currentColor = val;
    initMode();
    document.querySelectorAll('.swatch, .dropdown-content button').forEach(i => i.classList.remove('active'));
    if (el) el.classList.add('active');
    resetUITimer();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
}

function resetUITimer() {
    body.classList.remove('hide-ui');
    canvas.style.cursor = 'default';
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(() => {
        body.classList.add('hide-ui');
        canvas.style.cursor = 'none';
    }, 3000);
}

window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initMode(); });
window.addEventListener('mousemove', resetUITimer);
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') toggleFullscreen();
    if (e.code === 'Space') setMode('color', '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
});

canvas.width = window.innerWidth; canvas.height = window.innerHeight;
animate(); resetUITimer();

// --- Dropdown Hover Handling with Delay ---
const dropdowns = document.querySelectorAll('.dropdown');
const hideTimeouts = new Map();

dropdowns.forEach(dropdown => {
    const content = dropdown.querySelector('.dropdown-content');
    let hideTimeout = null;

    dropdown.addEventListener('mouseenter', () => {
        // Clear any pending hide timeout
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        // Show dropdown immediately
        content.classList.add('show');
    });

    dropdown.addEventListener('mouseleave', () => {
        // Add delay before hiding
        hideTimeout = setTimeout(() => {
            content.classList.remove('show');
            hideTimeout = null;
        }, 150); // 150ms delay
    });
});

