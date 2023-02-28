let isOn = true;

// Get the blocked count and update the UI
chrome.storage.local.get('blockedCount', function(result) {
  const blockedCount = result.blockedCount;
  document.getElementById('blockedCount').textContent = blockedCount;
});

// Handle the toggle button click
document.getElementById('toggleButton').addEventListener('click', function() {
  isOn = !isOn;
  if (isOn) {
    chrome.browserAction.setIcon({ path: 'icon.png' });
    chrome.browserAction.setTitle({ title: 'Ad and Tracker Blocker' });
    chrome.webRequest.onBeforeRequest.addListener(
      blockAdsAndTrackers,
      { urls: ['<all_urls>'] },
      ['blocking']
    );
    document.getElementById('toggleButton').textContent = 'Turn Off';
  } else {
    chrome.browserAction.setIcon({ path: 'icon-off.png' });
    chrome.browserAction.setTitle({ title: 'Ad and Tracker Blocker (Off)' });
    chrome.webRequest.onBeforeRequest.removeListener(blockAdsAndTrackers);
    document.getElementById('toggleButton').textContent = 'Turn On';
  }
});

// Define the function to block ads and trackers
function blockAdsAndTrackers(details) {
  // Define the regular expressions for ads and trackers
  const adRegex = /\/ads\//i;
  const trackerRegex = /\/trackers\//i;
  
  // Check if the request matches an ad or tracker
  if (details.url.match(adRegex) || details.url.match(trackerRegex)) {
    // Increment the counter
    chrome.storage.local.get('blockedCount', function(result) {
      const newCount = result.blockedCount + 1;
      chrome.storage.local.set({ 'blockedCount': newCount });
    });
    
    // Cancel the request to block the ad or tracker
    return { cancel: true };
  }
}
