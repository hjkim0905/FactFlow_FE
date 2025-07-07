chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ tabId: tab.id }, () => {
        console.log('Side Panel Opened');
        chrome.windows.getCurrent({}, function (window) {
            chrome.windows.update(window.id, { width: 500 });
        });
    });
});
