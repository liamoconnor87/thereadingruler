var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
var isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;

if (isChrome) {
    let thisBrowser = chrome
} else if (isFirefox) {
    let thisBrowser = browser
}

var styleElement = document.createElement('style');
styleElement.innerHTML = `
#rr-line {
    position: fixed;
    width: 100%;
    height: 3px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    pointer-events: none;
    /* to prevent line from blocking mouse events */
    background: rgb(0, 0, 0);
    z-index: 9999;
    opacity: 0;
}
#rr-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
}`;

var lineDiv = document.createElement('div');
var overlayDiv = document.createElement('div');
lineDiv.id = 'rr-line';
overlayDiv.id = 'rr-overlay';
document.body.appendChild(lineDiv);
document.body.appendChild(overlayDiv);
document.body.appendChild(styleElement);

document.addEventListener("mousemove", function (event) {
    var mouseY = event.clientY + 17;
    var windowHeight = window.innerHeight;
    var line = document.querySelector("#rr-line");
    var overlay = document.querySelector("#rr-overlay");
    var overlayHeight = windowHeight - mouseY; // Calculate the height from the bottom of the window

    line.style.top = mouseY + "px";
    overlay.style.height = overlayHeight + "px";
    overlay.style.bottom = 0; // Position the overlay at the bottom of the window
    overlay.style.opacity = 1; // Make the overlay visible
    line.style.opacity = 1;

    // Calculate the height of the line
    var lineHeight = line.offsetHeight;
    line.style.top = (mouseY + lineHeight) + "px"; // Position the line so that its bottom is aligned with the mouse cursor
});

document.addEventListener("mouseout", function (event) {
    // Hide the line and the overlay when the mouse leaves the window
    var overlay = document.querySelector("#rr-overlay");
    var line = document.querySelector("#rr-line");
    overlay.style.opacity = 0; // Hide the overlay when the mouse leaves the window
    line.style.opacity = 0;
});

//  Refresh the page when the toggle state changes
function refreshPage() {
    thisBrowser.storage.local.get("toggleState").then(({ toggleState }) => {
        if (toggleState) {
            if (lineDiv && overlayDiv) {
                lineDiv.style.display = "block";
                overlayDiv.style.display = "block";
            }
        } else {
            if (lineDiv && overlayDiv) {
                lineDiv.style.display = "none";
                overlayDiv.style.display = "none";
            }
        }
    });
}

thisBrowser.storage.onChanged.addListener(refreshPage);

refreshPage();
