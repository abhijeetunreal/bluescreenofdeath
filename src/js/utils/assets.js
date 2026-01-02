// Asset loading and data

/**
 * Creates an image with error handling and fallback support
 */
function createImageWithFallback(primarySrc, fallbackSrc = null, imageName = 'image') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    let loadAttempts = 0;
    const maxAttempts = fallbackSrc ? 2 : 1;
    
    function tryLoad(src) {
        loadAttempts++;
        img.src = src;
    }
    
    img.onerror = function() {
        if (loadAttempts < maxAttempts && fallbackSrc) {
            // Silently try fallback without logging
            tryLoad(fallbackSrc);
        } else {
            // Only log if it's not a network/CORS issue (which are common and expected)
            // Mark as failed but don't throw - allow app to continue
            img._loadFailed = true;
        }
    };
    
    img.onload = function() {
        img._loadFailed = false;
    };
    
    // Start loading with primary source
    tryLoad(primarySrc);
    
    return img;
}

const imgWin = createImageWithFallback(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/512px-Windows_logo_-_2021.svg.png',
    null,
    'Windows logo'
);

const imgApple = createImageWithFallback(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/256px-Apple_logo_black.svg.png',
    null,
    'Apple logo (black)'
);

// White Apple logo for dark backgrounds
// Using a data URI or filtered black logo as fallback
// The white SVG from Wikimedia may not always be available, so we'll use the black logo
// and let the drawing function apply a white filter if needed
const imgAppleWhite = createImageWithFallback(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/512px-Apple_logo_black.svg.png',
    null,
    'Apple logo (white)'
);

const imgAndroid = createImageWithFallback(
    'https://upload.wikimedia.org/wikipedia/commons/6/64/Android_logo_2019_%28stacked%29.svg',
    null,
    'Android logo'
);

const imgChrome = createImageWithFallback(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/512px-Google_Chrome_icon_%28February_2022%29.svg.png',
    null,
    'Chrome logo'
);

const imgUbuntu = createImageWithFallback(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/UbuntuCoF.svg/512px-UbuntuCoF.svg.png',
    null,
    'Ubuntu logo'
);

const quotes = [
    "Reality is merely an illusion, albeit a very persistent one.",
    "The only way to do great work is to love what you do.",
    "Error 404: Sleep not found.",
    "I'm not lazy, I'm just on energy saving mode.",
    "Everything is fine. (It is not fine.)",
    "Be the person your dog thinks you are."
];

export { imgWin, imgApple, imgAppleWhite, imgAndroid, imgChrome, imgUbuntu, quotes };

