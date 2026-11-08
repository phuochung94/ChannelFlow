document.documentElement.lang = chrome.i18n.getUILanguage();
for (const element of document.querySelectorAll('[data-i18n]')) {
  element.textContent = chrome.i18n.getMessage(element.dataset.i18n);
}
for (const element of document.querySelectorAll('[data-i18n-aria]')) {
  element.setAttribute('aria-label', chrome.i18n.getMessage(element.dataset.i18nAria));
}
for (const element of document.querySelectorAll('[data-i18n-title]')) {
  element.title = chrome.i18n.getMessage(element.dataset.i18nTitle);
}
const defaults = {enabled:true, autoQuality:true, preventAutoPause:true, musicEnabled:true, musicMode:'queue', preventMusicAutoPause:true};
const statusBox = document.getElementById('status');
const nextButton = document.getElementById('next');
const resetButton = document.getElementById('reset');
let tabId;
async function send(type) { return chrome.tabs.sendMessage(tabId, {type}); }
function applySettings(settings) {
  for (const key of Object.keys(defaults)) {
    const control = document.getElementById(key);
    if (control.type === 'checkbox') control.checked = settings[key];
    else control.value = settings[key];
  }
}
async function refresh() {
  try {
    const state = await send('status');
    const site = state.platform === 'music' ? 'YouTube Music' : 'YouTube';
    statusBox.textContent = site + ' · ' + state.status;
    statusBox.title = statusBox.textContent;
    nextButton.disabled = !state.supported || state.busy;
    resetButton.disabled = false;
  } catch {
    statusBox.textContent = chrome.i18n.getMessage('connectionError');
    nextButton.disabled = resetButton.disabled = true;
  }
}
for (const key of Object.keys(defaults)) {
  const control = document.getElementById(key);
  control.addEventListener('change', async () => {
    await chrome.storage.local.set({[key]: control.type === 'checkbox' ? control.checked : control.value});
    await refresh();
  });
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  for (const [key,change] of Object.entries(changes)) {
    if (!(key in defaults)) continue;
    const control = document.getElementById(key);
    if (control.type === 'checkbox') control.checked = change.newValue;
    else control.value = change.newValue;
  }
});
nextButton.addEventListener('click', async () => {
  nextButton.disabled = true;
  try { await send('next'); } finally { await refresh(); }
});
resetButton.addEventListener('click', async () => { try { await send('reset'); } finally { await refresh(); } });
(async () => {
  applySettings(await chrome.storage.local.get(defaults));
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  tabId = tab?.id;
  await refresh();
  setInterval(refresh, 1000);
})();
