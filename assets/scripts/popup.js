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

rrCheckbox.addEventListener("change", function () {
    if (rrCheckbox.checked) {
        toggleStatus.innerHTML = `<strong>O</strong>n`;
        thisBrowser.storage.local.set({ toggleState: true });
    } else {
        toggleStatus.innerHTML = `<strong>Of</strong>f`;
        thisBrowser.storage.local.set({ toggleState: false });
    }
})

// Get toggle state
thisBrowser.storage.local.get("toggleState").then(({ toggleState }) => {
    if (toggleState) {
        rrCheckbox.checked = true;
    } else {
        rrCheckbox.checked = false;
        toggleStatus.innerHTML = `<strong>Of</strong>f`;
    }
});

// Toggle state hotkey
thisBrowser.commands.onCommand.addListener(function(command) {
    if (command === "toggle-ruler") {
        thisBrowser.storage.local.get("toggleState").then(({ toggleState }) => {
            if (toggleState === true) {
                thisBrowser.storage.local.set({ toggleState: false });
                rrCheckbox.checked = false;
                toggleStatus.innerHTML = `<strong>Of</strong>f`;
            } else {
                thisBrowser.storage.local.set({ toggleState: true });
                rrCheckbox.checked = true;
                toggleStatus.innerHTML = `<strong>O</strong>n`;

            }
        })
    }
})

// Ruler position
const options = ["Below cursor", "Above cursor", "On cursor"];
const arrowLeft = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");
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
const overlayOpacitySettings = document.getElementById("overlay-opacity");
thisBrowser.storage.local.get("overlayOpacity").then(({ overlayOpacity }) => {
    if (overlayOpacity) {
        overlayOpacitySettings.value = overlayOpacity;
    }
    else {
        overlayOpacitySettings.value = 80;
    }
});

overlayOpacitySettings.addEventListener("input", () => {
    thisBrowser.storage.local.set({
        overlayOpacity: overlayOpacitySettings.value
    });
})

// Overlay colour
const overlayColourSettings = document.getElementById("overlay-colour");
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
const lineColourSettings = document.getElementById("line-colour");
thisBrowser.storage.local.get("lineColour").then(({ lineColour }) => {
    if (lineColour) {
        lineColourSettings.value = lineColour;
    }
    else {
        lineColourSettings.value = "0, 0, 0";
    }
})

lineColourSettings.addEventListener("input", () => {
    thisBrowser.storage.local.set({
        lineColour: lineColourSettings.value
    });
})