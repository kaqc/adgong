// Initialize the counter
chrome.storage.local.set({ 'blockedCount': 0 });

// Listen for web requests and block ads and trackers
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
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
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);
