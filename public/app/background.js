/*global chrome*/
// Called when the user clicks on the browser action
console.log("chrome on bg", chrome);
console.log("chrome.tabs", chrome.tabs);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.includes("google.com")) {
    chrome.tabs.query({ url: tab.url }, tabs => {
      tabs.forEach(tab => {
      });
      chrome.tabs.sendMessage(tab.id, { message: "open_google_tab", url: tab.url });
    });

    chrome.browserAction.onClicked.addListener(function(tab) {

      // Send a message to the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          message: "clicked_browser_action"
        });
      });
    });
  }
});


