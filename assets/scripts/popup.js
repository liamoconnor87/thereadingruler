window.onload = function () {
    // Browser detection
    var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
    var isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
    var thisBrowser = isChrome ? chrome : (isFirefox ? browser : null);

    // DOM elements
    var rrCheckbox = document.getElementById("rr-checkbox");
    var toggleStatus = document.getElementById("switch-status");
    const inputs = document.querySelectorAll('.settings input');
    const overlayOpacitySettings = document.getElementById("overlay-opacity");
    const overlayColourSettings = document.getElementById("overlay-colour");
    const lineColourSettings = document.getElementById("line-colour");
    const arrowLeft = document.getElementById("arrow-left");
    const arrowRight = document.getElementById("arrow-right");
    const rulerPosition = document.getElementById("ruler-position");

    // Options for ruler position
    const options = ["Below cursor", "Above cursor", "On cursor"];
    let optionIndex;

    // Initialize toggle status
    function updateToggleStatus() {
        toggleStatus.innerHTML = rrCheckbox.checked ? `<strong>O</strong>n` : `<strong>Of</strong>f`;
    }

    // Neon glow effect
    function neonGlow(bool) {
        setTimeout(() => {
            inputs.forEach(input => {
                input.style.color = bool ? 'rgb(240, 109, 255)' : 'rgba(240, 109, 255, 0.6)';
            });
        }, 100);
    }

    // Initialize settings from storage
    function initializeSettings() {
        thisBrowser.storage.local.get(["toggleState", "ruler", "overlayOpacity", "overlayColour", "lineColour"]).then((result) => {
            // Toggle state
            if (result.toggleState !== undefined) {
                rrCheckbox.checked = result.toggleState;
                neonGlow(result.toggleState);
            }
            updateToggleStatus();

            // Ruler position
            optionIndex = result.ruler !== undefined ? result.ruler : 0;
            rulerPosition.innerHTML = options[optionIndex];

            // Overlay opacity
            overlayOpacitySettings.value = result.overlayOpacity !== undefined ? result.overlayOpacity : 70;

            // Overlay colour
            overlayColourSettings.value = result.overlayColour !== undefined ? result.overlayColour : "0, 0, 0";

            // Line colour
            lineColourSettings.value = result.lineColour !== undefined ? result.lineColour : "240, 109, 255";
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
            rulerPosition.innerHTML = options[optionIndex];
            thisBrowser.storage.local.set({ ruler: optionIndex });
        }
    });

    arrowRight.addEventListener("click", () => {
        if (optionIndex < 2) {
            optionIndex++;
            rulerPosition.innerHTML = options[optionIndex];
            thisBrowser.storage.local.set({ ruler: optionIndex });
        }
    });

    overlayOpacitySettings.addEventListener("input", () => {
        thisBrowser.storage.local.set({ overlayOpacity: overlayOpacitySettings.value });
    });

    overlayColourSettings.addEventListener("input", () => {
        thisBrowser.storage.local.set({ overlayColour: overlayColourSettings.value });
    });

    lineColourSettings.addEventListener("input", () => {
        thisBrowser.storage.local.set({ lineColour: lineColourSettings.value });
    });

    // Initialize settings
    initializeSettings();
};
