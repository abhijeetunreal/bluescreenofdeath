// Canvas setup and utilities

const canvas = document.getElementById('colorCanvas');
let ctx = null;
const body = document.getElementById('mainBody');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Initialize context with error handling
if (canvas) {
    try {
        ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get 2D canvas context');
        }
    } catch (error) {
        console.error('Error initializing canvas context:', error);
    }
} else {
    console.error('Canvas element not found');
}

export function getCanvas() {
    return canvas;
}

export function getCtx() {
    if (!ctx) {
        console.warn('Canvas context not available');
    }
    return ctx;
}

export function getBody() {
    return body;
}

export function getIsTouchDevice() {
    return isTouchDevice;
}

export function resizeCanvas() {
    if (!canvas) {
        console.warn('Cannot resize canvas: canvas element not found');
        return;
    }
    
    try {
        canvas.width = window.innerWidth || 0;
        canvas.height = window.innerHeight || 0;
    } catch (error) {
        console.error('Error resizing canvas:', error);
    }
}

