let activeTab = null;
let startTime = null;

// Productivity categories
const categories = {
  productive: ["leetcode.com", "github.com", "stackoverflow.com"],
  unproductive: ["facebook.com", "instagram.com", "youtube.com"]
};

// Listen when tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await trackTime();
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    activeTab = tab.url;
    startTime = Date.now();
  });
});

// Listen when URL updates in the same tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    await trackTime();
    activeTab = changeInfo.url;
    startTime = Date.now();
  }
});

// Store time in chrome.storage
async function trackTime() {
  if (activeTab && startTime) {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const hostname = new URL(activeTab).hostname;

    chrome.storage.local.get(["timeData"], (data) => {
      let timeData = data.timeData || {};
      if (!timeData[hostname]) {
        timeData[hostname] = 0;
      }
      timeData[hostname] += duration;
      chrome.storage.local.set({ timeData });
    });
  }
}
