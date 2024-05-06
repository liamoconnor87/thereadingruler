// var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
// var isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
// var thisBrowser;

// if (isChrome) {
//     thisBrowser = chrome
// } else if (isFirefox) {
//     thisBrowser = browser
// }

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
        // thisBrowser.storage.local.set({ toggleState: true });
    } else {
        toggleStatus.innerHTML = `<strong>Of</strong>f`;
        // thisBrowser.storage.local.set({ toggleState: false });
    }
})

// // Store that bad boy
// thisBrowser.storage.local.get("toggleState").then(({ toggleState }) => {
//     if (toggleState) {
//         rrCheckbox.checked = true;
//     } else {
//         rrCheckbox.checked = false;
//         toggleStatus.innerHTML = `<strong>Of</strong>f`;
//     }
// });

// Ruler position
const options = ["Below cursor", "Above cursor", "On cursor"];
const arrowLeft = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");
var rulerPosition = document.getElementById("ruler-position");
let optionIndex = 0;
rulerPosition.innerHTML = options[optionIndex];

arrowLeft.addEventListener("click", () => {
    if (optionIndex > 0) {
        optionIndex--;
        console.log(optionIndex);
        rulerPosition.innerHTML = options[optionIndex];
    }
})

arrowRight.addEventListener("click", () => {
    if (optionIndex < 2) {
        optionIndex++;
        console.log(optionIndex);
        rulerPosition.innerHTML = options[optionIndex];
    }
})