// Asset loading and data

const imgWin = new Image(); 
imgWin.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/512px-Windows_logo_-_2021.svg.png';

const imgApple = new Image(); 
imgApple.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/256px-Apple_logo_black.svg.png';

// White Apple logo for dark backgrounds (better quality than filtering)
const imgAppleWhite = new Image();
// Use a PNG version that's more reliable
imgAppleWhite.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Apple_Logo_White.svg/512px-Apple_Logo_White.svg.png';

const imgAndroid = new Image(); 
imgAndroid.src = 'https://upload.wikimedia.org/wikipedia/commons/6/64/Android_logo_2019_%28stacked%29.svg';

const imgChrome = new Image();
imgChrome.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/512px-Google_Chrome_icon_%28February_2022%29.svg.png';

const imgUbuntu = new Image();
imgUbuntu.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/UbuntuCoF.svg/512px-UbuntuCoF.svg.png';

[imgWin, imgApple, imgAppleWhite, imgAndroid, imgChrome, imgUbuntu].forEach(img => img.crossOrigin = 'anonymous');

const quotes = [
    "Reality is merely an illusion, albeit a very persistent one.",
    "The only way to do great work is to love what you do.",
    "Error 404: Sleep not found.",
    "I'm not lazy, I'm just on energy saving mode.",
    "Everything is fine. (It is not fine.)",
    "Be the person your dog thinks you are."
];

export { imgWin, imgApple, imgAppleWhite, imgAndroid, imgChrome, imgUbuntu, quotes };

