// Canvas setup and utilities

const canvas = document.getElementById('colorCanvas');
const ctx = canvas.getContext('2d');
const body = document.getElementById('mainBody');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export function getCanvas() {
    return canvas;
}

export function getCtx() {
    return ctx;
}

export function getBody() {
    return body;
}

export function getIsTouchDevice() {
    return isTouchDevice;
}

export function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

