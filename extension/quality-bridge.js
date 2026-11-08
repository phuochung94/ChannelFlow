(() => {
  let enabled = false;
  function sync() {
    window.postMessage({source: 'channelflow-quality-v1', enabled}, location.origin);
  }
  chrome.storage.local.get({autoQuality: true}).then(settings => {
    enabled = settings.autoQuality === true;
    sync();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.autoQuality) {
      enabled = changes.autoQuality.newValue === true;
      sync();
    }
  });
  // Repeat so the page-world script also receives settings if it loads later.
  setInterval(sync, 2000);
})();
