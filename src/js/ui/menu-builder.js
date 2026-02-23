/**
 * Builds desktop bar and mobile menu from the mode registry.
 * Run after DOM ready; call initDropdowns() after build so dropdowns work.
 */

import { getCategories, getModesForCategory } from '../config/mode-registry.js';

const DROPDOWN_BTN_CLASS = 'drop-btn px-3 py-1.5 rounded cursor-pointer text-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-hover)] min-h-8';
const DROPDOWN_CONTENT_CLASS = 'dropdown-content opacity-0 invisible absolute top-full left-1/2 -translate-x-1/2 -translate-y-0.5 bg-[var(--color-surface)] min-w-[160px] max-w-[90vw] rounded border border-[var(--color-border)] z-[2001] py-1 max-h-[70vh] overflow-y-auto mt-1 transition-[opacity,visibility] duration-150 pointer-events-none max-[480px]:fixed max-[480px]:left-1/2 max-[480px]:bottom-[60px] max-[480px]:top-auto';
const MENU_ITEM_CLASS = 'menu-item block w-full text-left text-sm py-2 px-3 border-0 bg-transparent cursor-pointer text-[var(--color-text)] hover:bg-[var(--color-hover)]';

function createDesktopBar() {
    const fragment = document.createDocumentFragment();

    const swatchGroup = document.createElement('div');
    swatchGroup.className = 'swatch-group flex gap-2 px-1 items-center max-[480px]:gap-1.5 max-[480px]:px-0.5';
    swatchGroup.innerHTML = `
        <button class="swatch active w-6 h-6 rounded-full flex-shrink-0 cursor-pointer" style="background:#000" onclick="setMode('color', '#000000', this)" aria-label="Black" role="button"></button>
        <button class="swatch w-6 h-6 rounded-full flex-shrink-0 cursor-pointer" style="background:#fff" onclick="setMode('color', '#ffffff', this)" aria-label="White" role="button"></button>
        <input type="color" id="customPicker" class="w-6 h-6 rounded-full cursor-pointer" oninput="setMode('color', this.value)" title="Custom" aria-label="Custom color">
    `;
    fragment.appendChild(swatchGroup);

    const div1 = document.createElement('div');
    div1.className = 'divider w-px h-5 bg-[var(--color-border)] mx-1';
    fragment.appendChild(div1);

    const categories = getCategories();
    for (const cat of categories) {
        const modes = getModesForCategory(cat.id);
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown relative inline-block pb-2 -mb-2 max-[480px]:mb-0 max-[480px]:pb-0';
        const btn = document.createElement('button');
        btn.className = DROPDOWN_BTN_CLASS;
        btn.setAttribute('aria-label', `${cat.label} modes menu`);
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = cat.label;
        const content = document.createElement('div');
        content.className = DROPDOWN_CONTENT_CLASS;
        content.setAttribute('role', 'menu');
        content.setAttribute('aria-label', `${cat.label} modes`);

        if (cat.id === 'games') {
            for (const m of modes) {
                const b = document.createElement('button');
                b.className = MENU_ITEM_CLASS;
                b.textContent = m.label;
                b.onclick = function () { window.setMode(m.id, null, this); };
                content.appendChild(b);
            }
            const hr = document.createElement('div');
            hr.className = 'h-px bg-[var(--color-border)] my-1';
            content.appendChild(hr);
            const screensaverBtn = document.createElement('button');
            screensaverBtn.id = 'gameScreensaverBtn';
            screensaverBtn.className = 'menu-item block w-full text-left text-sm py-2 px-3 border-0 bg-transparent cursor-pointer text-green-600 hover:bg-[var(--color-hover)]';
            screensaverBtn.textContent = 'Game Screensaver';
            screensaverBtn.onclick = () => { window.toggleGameScreensaver?.(); };
            content.appendChild(screensaverBtn);
        } else {
            for (const m of modes) {
                const b = document.createElement('button');
                b.className = MENU_ITEM_CLASS;
                b.textContent = m.label;
                b.onclick = function () { window.setMode(m.id, null, this); };
                content.appendChild(b);
            }
        }

        dropdown.appendChild(btn);
        dropdown.appendChild(content);
        fragment.appendChild(dropdown);
    }

    const div2 = document.createElement('div');
    div2.className = 'divider w-px h-5 bg-[var(--color-border)] mx-1';
    fragment.appendChild(div2);

    const homeBtn = document.createElement('button');
    homeBtn.id = 'homeBtn';
    homeBtn.className = 'btn-primary px-3 py-1.5 rounded text-sm cursor-pointer min-h-8';
    homeBtn.textContent = 'Home';
    homeBtn.onclick = () => { window.showHomePage?.(); };
    homeBtn.setAttribute('aria-label', 'Show home page');
    fragment.appendChild(homeBtn);

    const fsBtn = document.createElement('button');
    fsBtn.id = 'fsBtn';
    fsBtn.className = 'btn-accent px-3 py-1.5 rounded text-sm font-medium cursor-pointer min-h-8';
    fsBtn.textContent = 'FS';
    fsBtn.onclick = () => { window.toggleFullscreen?.(); };
    fsBtn.setAttribute('aria-label', 'Toggle fullscreen mode');
    fragment.appendChild(fsBtn);

    const hideBarBtn = document.createElement('button');
    hideBarBtn.id = 'hideBarBtn';
    hideBarBtn.className = 'btn-primary px-3 py-1.5 rounded text-sm cursor-pointer min-h-8';
    hideBarBtn.textContent = 'Hide';
    hideBarBtn.onclick = () => {
        document.body.classList.add('ui-bar-hidden');
    };
    hideBarBtn.setAttribute('aria-label', 'Hide menu bar');
    fragment.appendChild(hideBarBtn);

    return fragment;
}

function createMobileMenuContent() {
    const fragment = document.createDocumentFragment();

    const colorGrid = document.createElement('div');
    colorGrid.className = 'grid grid-cols-3 gap-2 mb-5';
    colorGrid.innerHTML = `
        <button class="aspect-square rounded-md border border-[var(--color-border)] bg-black text-white text-xs" onclick="setMode('color', '#000000', this); closeMobileMenu();">Black</button>
        <button class="aspect-square rounded-md border border-[var(--color-border)] bg-white text-black text-xs" onclick="setMode('color', '#ffffff', this); closeMobileMenu();">White</button>
        <button class="aspect-square rounded-md border border-[var(--color-border)] bg-gray-200 text-gray-700 text-xs relative" onclick="closeMobileMenu();">
            <input type="color" id="mobileCustomPicker" class="absolute inset-0 w-full h-full opacity-0" oninput="setMode('color', this.value); closeMobileMenu();">
            Custom
        </button>
    `;
    fragment.appendChild(colorGrid);

    const categories = getCategories();
    for (const cat of categories) {
        const modes = getModesForCategory(cat.id);
        const section = document.createElement('div');
        section.className = 'mb-5';
        const heading = document.createElement('div');
        heading.className = 'text-xs font-medium text-[var(--color-text-muted)] mb-1.5 mt-2 first:mt-0';
        heading.textContent = cat.label;
        section.appendChild(heading);
        const list = document.createElement('div');
        list.className = 'space-y-1.5';
        for (const m of modes) {
            const btn = document.createElement('button');
            btn.className = 'mobile-option-btn w-full py-2.5 px-3 rounded text-sm text-left';
            btn.setAttribute('data-mode', m.id);
            btn.textContent = m.label;
            btn.onclick = () => {
                window.setMode(m.id, null, btn);
                window.closeMobileMenu?.();
            };
            list.appendChild(btn);
        }
        if (cat.id === 'games') {
            const hr = document.createElement('div');
            hr.className = 'h-px bg-[var(--color-border)] my-1';
            list.appendChild(hr);
            const screensaverBtn = document.createElement('button');
            screensaverBtn.id = 'gameScreensaverBtnMobile';
            screensaverBtn.className = 'mobile-option-btn w-full py-2.5 px-3 rounded text-sm text-left text-green-600';
            screensaverBtn.textContent = 'Game Screensaver';
            screensaverBtn.onclick = () => { window.toggleGameScreensaver?.(); window.closeMobileMenu?.(); };
            list.appendChild(screensaverBtn);
        }
        section.appendChild(list);
        fragment.appendChild(section);
    }

    const bottomRow = document.createElement('div');
    bottomRow.className = 'flex gap-2 mt-4 mb-2';
    bottomRow.innerHTML = `
        <button class="flex-1 py-2.5 rounded text-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]" onclick="showHomePage(); closeMobileMenu();">Home</button>
        <button class="flex-1 py-2.5 rounded text-sm bg-[var(--color-text)] text-white font-medium" onclick="toggleFullscreen(); closeMobileMenu();">Fullscreen</button>
        <button class="flex-1 py-2.5 rounded text-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]" onclick="setMode('color', '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')); closeMobileMenu();">Random</button>
    `;
    fragment.appendChild(bottomRow);

    return fragment;
}

/**
 * Build desktop bar and mobile menu from registry. Call once after DOM ready.
 * Call initDropdowns() after this so dropdown behavior is attached.
 */
export function buildMenus() {
    const uiContainer = document.getElementById('ui-container');
    if (uiContainer) {
        uiContainer.innerHTML = '';
        uiContainer.appendChild(createDesktopBar());
    }

    const mobileContent = document.getElementById('mobile-menu-content');
    if (mobileContent) {
        mobileContent.innerHTML = '';
        mobileContent.appendChild(createMobileMenuContent());
    }
}
