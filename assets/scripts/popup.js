window.onload = function () {
    var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
    var isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
    var thisBrowser;

    if (isChrome) {
        thisBrowser = chrome
    } else if (isFirefox) {
        thisBrowser = browser
    }

    var rrCheckbox = document.getElementById("rr-checkbox");
    var toggleStatus = document.getElementById("switch-status");

    if (rrCheckbox.checked) {
        toggleStatus.innerHTML = `<strong>O</strong>n`;
    } else {
        toggleStatus.innerHTML = `<strong>Of</strong>f`;
    }

    const inputs = document.querySelectorAll('.settings input');
    const overlayOpacitySettings = document.getElementById("overlay-opacity");
    const overlayColourSettings = document.getElementById("overlay-colour");
    const lineColourSettings = document.getElementById("line-colour");
    const arrowLeft = document.getElementById("arrow-left");
    const arrowRight = document.getElementById("arrow-right");

    rrCheckbox.addEventListener("change", function () {
        if (rrCheckbox.checked) {
            toggleStatus.innerHTML = `<strong>O</strong>n`;
            thisBrowser.storage.local.set({ toggleState: true });
            neonGlow(true);
        } else {
            toggleStatus.innerHTML = `<strong>Of</strong>f`;
            thisBrowser.storage.local.set({ toggleState: false });
            neonGlow(false);
        }
    })

    // Get toggle state
    thisBrowser.storage.local.get("toggleState").then(({ toggleState }) => {
        if (toggleState) {
            rrCheckbox.checked = true;
            neonGlow(true);
        } else {
            rrCheckbox.checked = false;
            neonGlow(false);
            toggleStatus.innerHTML = `<strong>Of</strong>f`;
        }
    });

    // Add neon glow to field text
    function neonGlow(bool) {
        // Some 'rustic' electricity travel delay...
        setTimeout(() => {
            if (bool == true) {
                // On
                inputs.forEach(input => {
                    input.style.color = 'rgb(240, 109, 255)';

                })
            } else {
                // Off
                inputs.forEach(input => {
                    input.style.color = 'rgb(240, 109, 255, .6)';
                })
            }
        }, 100);
    }

    // Ruler position
    const options = ["Below cursor", "Above cursor", "On cursor"];
    var rulerPosition = document.getElementById("ruler-position");
    let optionIndex;

    // Get ruler position
    thisBrowser.storage.local.get("ruler").then(({ ruler }) => {
        if (ruler) {
            optionIndex = ruler;
            rulerPosition.innerHTML = options[optionIndex];
        }
        else {
            optionIndex = 0;
            rulerPosition.innerHTML = options[optionIndex];
        }
    });

    arrowLeft.addEventListener("click", () => {
        if (optionIndex > 0) {
            optionIndex--;
            rulerPosition.innerHTML = options[optionIndex];
            thisBrowser.storage.local.set({ ruler: optionIndex });
        }
    })

    arrowRight.addEventListener("click", () => {
        if (optionIndex < 2) {
            optionIndex++;
            rulerPosition.innerHTML = options[optionIndex];
            thisBrowser.storage.local.set({ ruler: optionIndex });
        }
    })

    // Overlay opacity
    thisBrowser.storage.local.get("overlayOpacity").then(({ overlayOpacity }) => {
        if (overlayOpacity) {
            overlayOpacitySettings.value = overlayOpacity;
        }
        else {
            overlayOpacitySettings.value = 70;
        }
    });

    overlayOpacitySettings.addEventListener("input", () => {
        thisBrowser.storage.local.set({
            overlayOpacity: overlayOpacitySettings.value
        });
    })

    // Overlay colour
    thisBrowser.storage.local.get("overlayColour").then(({ overlayColour }) => {
        if (overlayColour) {
            overlayColourSettings.value = overlayColour;
        }
        else {
            overlayColourSettings.value = "0, 0, 0";
        }
    })

    overlayColourSettings.addEventListener("input", () => {
        thisBrowser.storage.local.set({
            overlayColour: overlayColourSettings.value
        });
    })

    // Line Colour
    thisBrowser.storage.local.get("lineColour").then(({ lineColour }) => {
        if (lineColour) {
            lineColourSettings.value = lineColour;
        }
        else {
            lineColourSettings.value = "240, 109, 255";
        }
    })

    lineColourSettings.addEventListener("input", () => {
        thisBrowser.storage.local.set({
            lineColour: lineColourSettings.value
        });
    })
}