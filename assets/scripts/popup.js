window.onload = function () {
    var thisBrowser = typeof browser !== "undefined" ? browser : chrome;

    // DOM elements
    var rrCheckbox = document.getElementById("rr-checkbox");
    var toggleStatus = document.getElementById("switch-status");
    const inputs = document.querySelectorAll('.settings input');
    const overlayOpacitySettings = document.getElementById("overlay-opacity");
    const overlayColourSettings = document.getElementById("overlay-colour");
    const overlayColourPicker = document.getElementById("overlay-colour-picker");
    const lineColourSettings = document.getElementById("line-colour");
    const lineColourPicker = document.getElementById("line-colour-picker");
    const arrowLeft = document.getElementById("arrow-left");
    const arrowRight = document.getElementById("arrow-right");
    const rulerPosition = document.getElementById("ruler-position");

    // Options for ruler position
    const cursorPosition = ["<strong>Bel</strong>ow <strong>cur</strong>sor", "<strong>Abo</strong>ve <strong>cur</strong>sor", "<strong>O</strong>n <strong>cur</strong>sor"];
    let optionIndex;

    const DEFAULT_OVERLAY_OPACITY = 70;

    // Initialize toggle status
    function updateToggleStatus() {
        toggleStatus.innerHTML = rrCheckbox.checked ? `<strong>O</strong>n` : `<strong>Of</strong>f`;
        updateUnderline();
    }

    // Last known-good "R, G, B" triplet - a mid-typed or malformed value never reaches CSS
    let currentLineColour = RR_ACCENT_RGB;

    function isValidRgbTriplet(value) {
        return /^\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*$/.test(value);
    }

    // Keeps the colour-wheel swatch and the typed "R, G, B" field in sync
    function hexToRgbTriplet(hex) {
        const n = parseInt(hex.slice(1), 16);
        return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    }

    function rgbTripletToHex(value) {
        const [r, g, b] = value.split(',').map(n => parseInt(n, 10));
        return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
    }

    // Canonical "R, G, B" spacing for the text field - exactly one space after each
    // comma, no matter how the value arrived (typed, pasted, or loaded from storage)
    function normaliseRgbTriplet(value) {
        const [r, g, b] = value.split(',').map(n => parseInt(n, 10));
        return `${r}, ${g}, ${b}`;
    }

    // Keep a "R, G, B" triplet's lightness within [min, max] - the popup's own UI
    // needs this (a too-dark colour disappears on it, a too-light one washes it out);
    // the stored/overlay-facing value passed around elsewhere is never touched.
    const MIN_CHROME_LIGHTNESS = 0.35;
    const MIN_BG_LIGHTNESS = 0.15;
    const MAX_BG_LIGHTNESS = 0.3;
    function clampLightness(value, min, max) {
        const [r, g, b] = value.split(',').map(n => parseInt(n, 10));
        const lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255;
        if (lightness < min) {
            const factor = (min - lightness) / (1 - lightness);
            const lighten = c => Math.round(c + (255 - c) * factor);
            return `${lighten(r)}, ${lighten(g)}, ${lighten(b)}`;
        }
        if (lightness > max) {
            const factor = max / lightness;
            const darken = c => Math.round(c * factor);
            return `${darken(r)}, ${darken(g)}, ${darken(b)}`;
        }
        return value;
    }

    // Reflect the line colour onto the popup's own dividers and position arrows
    function applyLineColour(value) {
        if (!isValidRgbTriplet(value)) return;
        currentLineColour = clampLightness(value, MIN_CHROME_LIGHTNESS, 1);
        document.documentElement.style.setProperty('--rr-line-colour', `rgb(${currentLineColour})`);
        updateUnderline();
    }

    // Title underline - always visible, same colour and delay as the field values' glow
    function updateUnderline() {
        setTimeout(() => {
            const underline = rrCheckbox.checked ? `rgb(${currentLineColour})` : `rgba(${currentLineColour}, 0.6)`;
            document.documentElement.style.setProperty('--rr-title-underline', underline);
        }, 100);
    }

    // Neon glow effect - follows the current (valid) line colour
    function neonGlow(bool) {
        setTimeout(() => {
            inputs.forEach(input => {
                input.style.color = bool ? `rgb(${currentLineColour})` : `rgba(${currentLineColour}, 0.6)`;
            });
        }, 100);
    }

    // Reflect the overlay colour onto the popup's own background tint - clamped so it
    // never reaches the shadow colour's black at one end or washes out the white font at the other
    function applyBgColour(value) {
        if (!isValidRgbTriplet(value)) return;
        const clamped = clampLightness(value, MIN_BG_LIGHTNESS, MAX_BG_LIGHTNESS);
        document.documentElement.style.setProperty('--rr-bg-colour', `rgb(${clamped})`);
    }

    // Line/overlay colour - keeps the text field, the wheel swatch, and storage in sync
    function setLineColour(value) {
        const valid = isValidRgbTriplet(value);
        lineColourSettings.value = valid ? normaliseRgbTriplet(value) : value;
        // Only a complete, valid triplet is ever persisted - a mid-typed or cleared
        // field never overwrites the last good stored colour
        if (valid) {
            lineColourPicker.value = rgbTripletToHex(value);
            thisBrowser.storage.local.set({ lineColour: normaliseRgbTriplet(value) });
        }
        applyLineColour(value);
        neonGlow(rrCheckbox.checked);
    }

    function setOverlayColour(value) {
        const valid = isValidRgbTriplet(value);
        overlayColourSettings.value = valid ? normaliseRgbTriplet(value) : value;
        if (valid) {
            overlayColourPicker.value = rgbTripletToHex(value);
            thisBrowser.storage.local.set({ overlayColour: normaliseRgbTriplet(value) });
        }
        applyBgColour(value);
    }

    // Initialize settings from storage
    function getSettings() {
        thisBrowser.storage.local.get(["toggleState", "ruler", "overlayOpacity", "overlayColour", "lineColour"]).then((result) => {
            // Line colour - resolved first so neonGlow below picks it up
            const lineColour = result.lineColour !== undefined ? result.lineColour : RR_ACCENT_RGB;
            lineColourSettings.value = isValidRgbTriplet(lineColour) ? normaliseRgbTriplet(lineColour) : lineColour;
            lineColourPicker.value = rgbTripletToHex(lineColour);
            applyLineColour(lineColour);

            // Toggle state
            if (result.toggleState !== undefined) {
                rrCheckbox.checked = result.toggleState;
                neonGlow(result.toggleState);
            }
            updateToggleStatus();

            // Ruler position + cursor position
            optionIndex = result.ruler !== undefined ? result.ruler : 0;
            rulerPosition.innerHTML = cursorPosition[optionIndex];

            // Overlay opacity
            overlayOpacitySettings.value = result.overlayOpacity !== undefined ? result.overlayOpacity : DEFAULT_OVERLAY_OPACITY;

            // Overlay colour
            const overlayColour = result.overlayColour !== undefined ? result.overlayColour : RR_DEFAULT_OVERLAY_RGB;
            overlayColourSettings.value = isValidRgbTriplet(overlayColour) ? normaliseRgbTriplet(overlayColour) : overlayColour;
            overlayColourPicker.value = rgbTripletToHex(overlayColour);
            applyBgColour(overlayColour);
        });
    }

    // Event listeners
    rrCheckbox.addEventListener("change", function () {
        updateToggleStatus();
        thisBrowser.storage.local.set({ toggleState: rrCheckbox.checked });
        neonGlow(rrCheckbox.checked);
    });

    arrowLeft.addEventListener("click", () => {
        if (optionIndex > 0) {
            optionIndex--;
            rulerPosition.innerHTML = cursorPosition[optionIndex];
            thisBrowser.storage.local.set({ ruler: optionIndex });
        }
    });

    arrowRight.addEventListener("click", () => {
        if (optionIndex < 2) {
            optionIndex++;
            rulerPosition.innerHTML = cursorPosition[optionIndex];
            thisBrowser.storage.local.set({ ruler: optionIndex });
        }
    });

    function isValidOpacity(value) {
        return value !== "" && Number.isFinite(Number(value));
    }

    overlayOpacitySettings.addEventListener("input", () => {
        if (isValidOpacity(overlayOpacitySettings.value)) {
            thisBrowser.storage.local.set({ overlayOpacity: overlayOpacitySettings.value });
        }
    });
    // Left invalid (including cleared) when the field loses focus - fall back to the default
    overlayOpacitySettings.addEventListener("blur", () => {
        if (!isValidOpacity(overlayOpacitySettings.value)) {
            overlayOpacitySettings.value = DEFAULT_OVERLAY_OPACITY;
            thisBrowser.storage.local.set({ overlayOpacity: DEFAULT_OVERLAY_OPACITY });
        }
    });

    overlayColourSettings.addEventListener("input", () => setOverlayColour(overlayColourSettings.value));
    overlayColourPicker.addEventListener("input", () => setOverlayColour(hexToRgbTriplet(overlayColourPicker.value)));
    // Left invalid (including cleared) when the field loses focus - fall back to the default
    overlayColourSettings.addEventListener("blur", () => {
        if (!isValidRgbTriplet(overlayColourSettings.value)) setOverlayColour(RR_DEFAULT_OVERLAY_RGB);
    });

    lineColourSettings.addEventListener("input", () => setLineColour(lineColourSettings.value));
    lineColourPicker.addEventListener("input", () => setLineColour(hexToRgbTriplet(lineColourPicker.value)));
    lineColourSettings.addEventListener("blur", () => {
        if (!isValidRgbTriplet(lineColourSettings.value)) setLineColour(RR_ACCENT_RGB);
    });

    thisBrowser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === "toggleOverlay") {
            getSettings();
        }
    });

    // Footer link - randomised each time the popup opens, between Coffee and a store rating
    const RATE_URLS = {
        firefox: "https://addons.mozilla.org/en-GB/firefox/addon/the-reading-ruler/reviews/",
        chrome: "https://chromewebstore.google.com/detail/jkennjdaolcdgmkddhnojdhhjcebdfpe"
    };
    if (Math.random() < 0.5) {
        const footerLink = document.querySelector(".buy-coffee");
        footerLink.href = navigator.userAgent.includes("Firefox") ? RATE_URLS.firefox : RATE_URLS.chrome;
        footerLink.innerHTML = "<strong>Lea</strong>ve a <strong>rat</strong>ing!";
    }

    // Initialize settings
    getSettings();
};
