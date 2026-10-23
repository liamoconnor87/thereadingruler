var thisBrowser = typeof browser !== "undefined" ? browser : chrome;

var styleElement = document.createElement('style');
styleElement.innerHTML = `
#rr-overlay {
    position: fixed;
    width: 100%;
    height: calc(100% - 53px);
    bottom: 0;
    left: 0;
    z-index: 99999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    background-color: rgba(${RR_DEFAULT_OVERLAY_RGB}, .7);
    border-top: 2px solid rgb(${RR_BRAND_TEAL_RGB});
}`;


var overlayDiv = document.createElement('div');
overlayDiv.id = 'rr-overlay';
document.body.appendChild(overlayDiv);
document.body.appendChild(styleElement);

// Cached settings - refreshed on load and whenever storage changes, rather than
// re-read on every mousemove, which raced the paint below against the storage read
var rulerOption = 0;
var opacityValue = 0.8;
var overlayColourValue = RR_DEFAULT_OVERLAY_RGB;
var lineColourValue = RR_ACCENT_RGB;

function refreshSettings() {
    thisBrowser.storage.local.get(["ruler", "overlayOpacity", "overlayColour", "lineColour"]).then((result) => {
        rulerOption = result.ruler !== undefined ? result.ruler : 0;
        opacityValue = result.overlayOpacity !== undefined ? result.overlayOpacity / 100 : 0.8;
        overlayColourValue = result.overlayColour !== undefined ? result.overlayColour : RR_DEFAULT_OVERLAY_RGB;
        lineColourValue = result.lineColour !== undefined ? result.lineColour : RR_ACCENT_RGB;
    });
}

document.addEventListener("mousemove", function (event) {
    var mouseY;
    if (rulerOption == 2) {
        mouseY = event.clientY;
    } else if (rulerOption == 1) {
        mouseY = event.clientY - 17;
    } else {
        mouseY = event.clientY + 17;
    }

    var windowHeight = window.innerHeight;
    var overlay = document.querySelector("#rr-overlay");
    var overlayHeight = windowHeight - mouseY; // Calculate the height from the bottom of the window

    overlay.style.height = overlayHeight + "px";
    overlay.style.bottom = 0; // Position the overlay at the bottom of the window
    overlay.style.opacity = 1; // Make the overlay visible
    overlay.style.backgroundColor = `rgba(${overlayColourValue}, ${opacityValue})`;
    overlay.style.borderTopColor = `rgb(${lineColourValue})`;
});

document.addEventListener("mouseout", function (event) {
    // Hide the line and the overlay when the mouse leaves the window
    var overlay = document.querySelector("#rr-overlay");
    overlay.style.opacity = 0; // Hide the overlay when the mouse leaves the window
});

//  Refresh the page when the toggle state changes
function refreshPage() {
    thisBrowser.storage.local.get("toggleState").then(({ toggleState }) => {
        if (overlayDiv) {
            overlayDiv.style.display = toggleState ? "block" : "none";
        }
    });
}

thisBrowser.storage.onChanged.addListener(function () {
    refreshPage();
    refreshSettings();
});

refreshPage();
refreshSettings();
