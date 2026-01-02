// Global state management

let currentMode = 'color';
let currentColor = '#000000';
let frame = 0;
let progress = 0;

// Mode-specific data
let particles = [];
let matrixChars = [];
let hackerLines = [];
let crackLines = [];
let dvdPos = { x: 100, y: 100, vx: 3, vy: 3, color: '#fff' };
let currentQuote = "";

// macOS Boot state
let bootProgress = 0;
let bootPhase = 'booting'; // 'booting' | 'transitioning' | 'login'
let bootStartFrame = 0;
let lastProgressUpdate = 0;
let nextProgressDelay = 0;
let transitionOpacity = 0;

export function getCurrentMode() {
    return currentMode;
}

export function setCurrentMode(mode) {
    currentMode = mode;
}

export function getCurrentColor() {
    return currentColor;
}

export function setCurrentColor(color) {
    currentColor = color;
}

export function getFrame() {
    return frame;
}

export function incrementFrame() {
    frame++;
}

export function resetFrame() {
    frame = 0;
}

export function getProgress() {
    return progress;
}

export function incrementProgress(amount = 0.02) {
    progress += amount;
}

export function resetProgress() {
    progress = 0;
}

export function getParticles() {
    return particles;
}

export function setParticles(newParticles) {
    particles = newParticles;
}

export function getMatrixChars() {
    return matrixChars;
}

export function setMatrixChars(chars) {
    matrixChars = chars;
}

export function getHackerLines() {
    return hackerLines;
}

export function setHackerLines(lines) {
    hackerLines = lines;
}

export function addHackerLine(line) {
    hackerLines.push(line);
    if (hackerLines.length > 30) {
        hackerLines.shift();
    }
}

export function getCrackLines() {
    return crackLines;
}

export function setCrackLines(lines) {
    crackLines = lines;
}

export function getDvdPos() {
    return dvdPos;
}

export function setDvdPos(pos) {
    dvdPos = pos;
}

export function getCurrentQuote() {
    return currentQuote;
}

export function setCurrentQuote(quote) {
    currentQuote = quote;
}

// macOS Boot state functions
export function getBootProgress() {
    return bootProgress;
}

export function setBootProgress(progress) {
    bootProgress = Math.max(0, Math.min(100, progress));
}

export function getBootPhase() {
    return bootPhase;
}

export function setBootPhase(phase) {
    bootPhase = phase;
}

export function getBootStartFrame() {
    return bootStartFrame;
}

export function setBootStartFrame(frame) {
    bootStartFrame = frame;
}

export function getLastProgressUpdate() {
    return lastProgressUpdate;
}

export function setLastProgressUpdate(frame) {
    lastProgressUpdate = frame;
}

export function getNextProgressDelay() {
    return nextProgressDelay;
}

export function setNextProgressDelay(delay) {
    nextProgressDelay = delay;
}

export function getTransitionOpacity() {
    return transitionOpacity;
}

export function setTransitionOpacity(opacity) {
    transitionOpacity = Math.max(0, Math.min(1, opacity));
}

export function resetBootState() {
    bootProgress = 0;
    bootPhase = 'booting';
    bootStartFrame = 0;
    lastProgressUpdate = 0;
    nextProgressDelay = 0;
    transitionOpacity = 0;
}

