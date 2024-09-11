chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startLinkedinScraping") {
    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id },
        files: ["content.js"],
      },
      () => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "startLinkedinScraping",
          count: request.count,
          sleep: request.sleep,
        });
      }
    );
  } else if (request.action === "startLinkedinTargetScraping") {
    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id },
        files: ["content.js"],
      },
      () => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "startLinkedinTargetScraping",
          userUrn: request.userUrn,
        });
      }
    );
  } else if (request.action === "startRememberScraping") {
    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id },
        files: ["content.js"],
      },
      () => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "startRememberScraping",
          token: request.token,
          userAgent: request.userAgent,
          totalPageCount: request.totalPageCount,
        });
      }
    );
  } else if (request.action === "googleUrlScraping") {
    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id },
        files: ["content.js"],
      },
      () => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "googleUrlScraping",
        });
      }
    );
  }
});
