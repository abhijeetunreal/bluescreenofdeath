// Asset loading and data

const imgWin = new Image(); 
imgWin.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/512px-Windows_logo_-_2021.svg.png';

const imgApple = new Image(); 
imgApple.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/256px-Apple_logo_black.svg.png';

const imgAndroid = new Image(); 
imgAndroid.src = 'https://upload.wikimedia.org/wikipedia/commons/6/64/Android_logo_2019_%28stacked%29.svg';

[imgWin, imgApple, imgAndroid].forEach(img => img.crossOrigin = 'anonymous');

const quotes = [
    "Reality is merely an illusion, albeit a very persistent one.",
    "The only way to do great work is to love what you do.",
    "Error 404: Sleep not found.",
    "I'm not lazy, I'm just on energy saving mode.",
    "Everything is fine. (It is not fine.)",
    "Be the person your dog thinks you are."
];

export { imgWin, imgApple, imgAndroid, quotes };

