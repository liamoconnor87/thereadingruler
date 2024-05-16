var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
var isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
var thisBrowser;

if (isChrome) {
    thisBrowser = chrome
} else if (isFirefox) {
    thisBrowser = browser
}

var styleElement = document.createElement('style');
styleElement.innerHTML = `
#rr-overlay {
    position: fixed;
    width: 100%;
    height: calc(100% - 53px);
    bottom: 0;
    left: 0;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    background-color: rgb(0, 0, 0, .8);
    border-top: 2px solid rgb(0, 0, 0);
}`;


var overlayDiv = document.createElement('div');
overlayDiv.id = 'rr-overlay';
document.body.appendChild(overlayDiv);
document.body.appendChild(styleElement);

document.addEventListener("mousemove", async function (event) {
    // Janky but working for now
    thisBrowser.storage.local.get("ruler").then(({ ruler }) => {
        if (ruler == 2) {
            mouseY = event.clientY;
        } else if (ruler == 1) {
            mouseY = event.clientY - 17;
        } else {
            mouseY = event.clientY + 17;
        }
    });

    var windowHeight = window.innerHeight;
    var overlay = document.querySelector("#rr-overlay");
    var overlayHeight = windowHeight - mouseY; // Calculate the height from the bottom of the window

    thisBrowser.storage.local.get("overlayOpacity").then(({ overlayOpacity }) => {
        if (overlayOpacity) {
            opacityValue = overlayOpacity / 100;
        } else {
            opacityValue = 0.8;
        }
    })

    thisBrowser.storage.local.get("overlayColour").then(({ overlayColour }) => {
        if (overlayColour) {
            ovColValue = overlayColour;
        } else {
            ovColValue = "0, 0, 0";
        }
    })

    thisBrowser.storage.local.get("lineColour").then(({ lineColour }) => {
        if (lineColour) {
            lineColValue = lineColour;
        } else {
            lineColValue = "0, 0, 0";
        }
    })

    overlay.style.height = overlayHeight + "px";
    overlay.style.bottom = 0; // Position the overlay at the bottom of the window
    overlay.style.opacity = 1; // Make the overlay visible
    overlay.style.backgroundColor = `rgba(${ovColValue}, ${opacityValue})`;
    overlay.style.borderTopColor = `rgb(${lineColValue})`;
});

document.addEventListener("mouseout", function (event) {
    // Hide the line and the overlay when the mouse leaves the window
    var overlay = document.querySelector("#rr-overlay");
    overlay.style.opacity = 0; // Hide the overlay when the mouse leaves the window
});

//  Refresh the page when the toggle state changes
function refreshPage() {
    thisBrowser.storage.local.get("toggleState").then(({ toggleState }) => {
        if (toggleState) {
            if (overlayDiv) {
                overlayDiv.style.display = "block";
            }
        } else {
            if (overlayDiv) {
                overlayDiv.style.display = "none";
            }
        }
    });
}

thisBrowser.storage.onChanged.addListener(refreshPage);

refreshPage();

// Not working
// Toggle state hotkey
thisBrowser.commands.onCommand.addListener(function (command) {
    if (command === "toggle-ruler") {
        thisBrowser.storage.local.get("toggleState").then(({ toggleState }) => {
            if (toggleState === true) {
                thisBrowser.storage.local.set({ toggleState: false });
                overlayDiv.style.display = "none";
            } else {
                thisBrowser.storage.local.set({ toggleState: true });
                overlayDiv.style.display = "block";

            }
        })
    }
})