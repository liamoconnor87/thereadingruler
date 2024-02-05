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
        browser.storage.local.set({ toggleState: true });
    } else {
        toggleStatus.innerHTML = `<strong>Of</strong>f`;
        browser.storage.local.set({ toggleState: false });
    }
})

// Store that bad boy
browser.storage.local.get("toggleState").then(({ toggleState }) => {
    if (toggleState) {
        rrCheckbox.checked = true;
    } else {
        rrCheckbox.checked = false;
        toggleStatus.innerHTML = `<strong>Of</strong>f`;
    }
});