var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
var isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;

if (isChrome) {
    let thisBrowser = chrome
} else if (isFirefox) {
    let thisBrowser = browser
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

// Store that bad boy
thisBrowser.storage.local.get("toggleState").then(({ toggleState }) => {
    if (toggleState) {
        rrCheckbox.checked = true;
    } else {
        rrCheckbox.checked = false;
        toggleStatus.innerHTML = `<strong>Of</strong>f`;
    }
});