// Listen for the toggle-overlay command
chrome.commands.onCommand.addListener(function (command) {
    if (command === 'toggle-overlay') {
        // Retrieve the current toggle state
        chrome.storage.local.get('toggleState', function (data) {
            const newToggleState = !data.toggleState;

            // Update the toggle state in storage
            chrome.storage.local.set({ toggleState: newToggleState }, function () {
                // Notify the content script or other parts of the extension
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleOverlay", state: newToggleState });
                });
            });
        });
    }
});