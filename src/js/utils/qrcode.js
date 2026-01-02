// QR Code utilities

const imgQRCode = new Image();
imgQRCode.crossOrigin = 'anonymous';
let qrLoadAttempts = 0;
const maxQrLoadAttempts = 2;

// Using api.qrserver.com which supports CORS
imgQRCode.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.windows.com/stopcode&bgcolor=ffffff';

// Handle image load errors gracefully
imgQRCode.onerror = function() {
    qrLoadAttempts++;
    if (qrLoadAttempts < maxQrLoadAttempts) {
        console.warn('QR code image failed to load, will retry with alternative source');
        // Fallback to alternative API if first one fails
        imgQRCode.src = 'https://quickchart.io/qr?text=https://www.windows.com/stopcode&size=200';
    } else {
        console.warn('QR code image failed to load after multiple attempts. QR code will not be displayed.');
        imgQRCode._loadFailed = true;
    }
};

imgQRCode.onload = function() {
    imgQRCode._loadFailed = false;
};

/**
 * Draw a QR code on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} size - Size of the QR code
 */
export function drawQRCode(ctx, x, y, size) {
    if (!ctx || !imgQRCode) return;
    
    // Check if image loaded successfully and is not marked as failed
    if (imgQRCode.complete && imgQRCode.naturalWidth > 0 && !imgQRCode._loadFailed) {
        try {
            ctx.drawImage(imgQRCode, x, y, size, size);
        } catch (error) {
            console.warn('Failed to draw QR code:', error);
        }
    }
}

/**
 * Get the QR code image (for checking if loaded, etc.)
 * @returns {HTMLImageElement} The QR code image
 */
export function getQRCodeImage() {
    return imgQRCode;
}

