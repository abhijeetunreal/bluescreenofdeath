// QR Code utilities

const imgQRCode = new Image();
// Using api.qrserver.com which supports CORS
imgQRCode.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.windows.com/stopcode&bgcolor=ffffff';

// Handle image load errors gracefully
imgQRCode.onerror = function() {
    console.warn('QR code image failed to load, will retry with alternative source');
    // Fallback to alternative API if first one fails
    imgQRCode.src = 'https://quickchart.io/qr?text=https://www.windows.com/stopcode&size=200';
};

/**
 * Draw a QR code on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} size - Size of the QR code
 */
export function drawQRCode(ctx, x, y, size) {
    if (imgQRCode.complete && imgQRCode.naturalWidth > 0) {
        ctx.drawImage(imgQRCode, x, y, size, size);
    }
}

/**
 * Get the QR code image (for checking if loaded, etc.)
 * @returns {HTMLImageElement} The QR code image
 */
export function getQRCodeImage() {
    return imgQRCode;
}

